import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type { Vector3D } from '../../types/physics';

export interface Vector3DInput {
  id: string;
  vec: Vector3D;
  color: number;
  label: string;
  visible?: boolean;
}

interface Vector3DCanvasProps {
  vectors: Vector3DInput[];
  showGrid: boolean;
  showAxisLabels: boolean;
  showParallelogram?: boolean;
  parallelogramPair?: [Vector3D, Vector3D];
  showRightHandCurl?: boolean;
  ariaLabel: string;
}

const _up = new THREE.Vector3(0, 1, 0);
const _dir = new THREE.Vector3();
const _quat = new THREE.Quaternion();

function detectSoftwareGl(): boolean {
  try {
    const probeCanvas = document.createElement('canvas');
    const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) ?? '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

// Physics coordinates (X right, Y forward/back, Z up) -> Three.js (X right, Y up, Z forward)
function physicsToThree(v: Vector3D): THREE.Vector3 {
  return new THREE.Vector3(v.x, v.z, -v.y);
}

// Build a composite 3-part 3D arrow (base collar + shaft + machined ring + tip cone)
function createCompositeArrow(colorHex: number): THREE.Group {
  const group = new THREE.Group();

  const shaftMat = new THREE.MeshStandardMaterial({
    color: colorHex,
    roughness: 0.35,
    metalness: 0.2,
  });
  const collarMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.2,
    metalness: 0.75,
  });
  const tipMat = new THREE.MeshStandardMaterial({
    color: colorHex,
    roughness: 0.25,
    metalness: 0.35,
  });

  const baseRing = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.08, 16), collarMat);
  baseRing.position.y = 0.04;
  group.add(baseRing);

  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1, 16), shaftMat);
  shaft.name = 'shaft';
  group.add(shaft);

  const neckRing = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.02, 10, 20), collarMat);
  neckRing.rotation.x = Math.PI / 2;
  neckRing.name = 'neck';
  group.add(neckRing);

  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.42, 20), tipMat);
  cone.name = 'cone';
  group.add(cone);

  return group;
}

function updateCompositeArrow(group: THREE.Group, vec: Vector3D) {
  const target = physicsToThree(vec);
  const len = target.length();

  if (len < 0.05) {
    group.visible = false;
    return;
  }
  group.visible = true;

  _dir.copy(target).normalize();
  _quat.setFromUnitVectors(_up, _dir);
  group.quaternion.copy(_quat);

  const coneH = Math.min(0.42, len * 0.35);
  const shaftH = Math.max(0.05, len - coneH);

  const shaft = group.getObjectByName('shaft') as THREE.Mesh;
  const neck = group.getObjectByName('neck') as THREE.Mesh;
  const cone = group.getObjectByName('cone') as THREE.Mesh;

  shaft.scale.set(1, shaftH, 1);
  shaft.position.y = shaftH / 2;

  neck.position.y = shaftH;
  cone.scale.set(1, coneH / 0.42, 1);
  cone.position.y = shaftH + coneH / 2;
}

export function Vector3DCanvas({
  vectors,
  showGrid,
  showAxisLabels,
  showParallelogram = false,
  parallelogramPair,
  showRightHandCurl = false,
  ariaLabel,
}: Vector3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const propsRef = useRef({
    vectors,
    showGrid,
    showAxisLabels,
    showParallelogram,
    parallelogramPair,
    showRightHandCurl,
  });
  propsRef.current = {
    vectors,
    showGrid,
    showAxisLabels,
    showParallelogram,
    parallelogramPair,
    showRightHandCurl,
  };

  const sceneApiRef = useRef<{
    syncScene: () => void;
    setCameraPreset: (preset: 'iso' | 'top' | 'front') => void;
  } | null>(null);

  const [webglError, setWebglError] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const mount = mountRef.current;
    if (!container || !mount) return;

    const isSoftwareGl = detectSoftwareGl();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglError('WebGL 3D rendering is unavailable in this browser.');
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = false;

    const width = Math.max(300, container.clientWidth);
    const height = Math.max(320, container.clientHeight);
    renderer.setSize(width, height);
    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(9.2, 7.6, 10.2);
    camera.lookAt(0, 0.6, 0);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.08;
    controls.minDistance = 4;
    controls.maxDistance = 28;
    controls.target.set(0, 0.6, 0);

    // Warm/cool balanced lighting
    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x94a3b8, 0.9);
    scene.add(hemiLight);
    const keyLight = new THREE.DirectionalLight(0xfffbeb, 1.4);
    keyLight.position.set(8, 12, 8);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xdbeafe, 0.6);
    rimLight.position.set(-8, 4, -6);
    scene.add(rimLight);

    // Grid floor (XY physics plane -> XZ Three.js plane)
    const gridHelper = new THREE.GridHelper(12, 12, 0x94a3b8, 0xe2e8f0);
    scene.add(gridHelper);

    // Basis triad lines (X red/blue, Y green, Z amber)
    const axesGroup = new THREE.Group();
    const makeAxis = (from: THREE.Vector3, to: THREE.Vector3, hex: number) => {
      const geo = new THREE.BufferGeometry().setFromPoints([from, to]);
      const mat = new THREE.LineBasicMaterial({ color: hex });
      return new THREE.Line(geo, mat);
    };
    axesGroup.add(makeAxis(new THREE.Vector3(-6, 0.01, 0), new THREE.Vector3(6, 0.01, 0), 0x64748b));
    axesGroup.add(makeAxis(new THREE.Vector3(0, 0.01, -6), new THREE.Vector3(0, 0.01, 6), 0x64748b));
    axesGroup.add(makeAxis(new THREE.Vector3(0, -6, 0), new THREE.Vector3(0, 6, 0), 0x94a3b8));
    scene.add(axesGroup);

    // Origin sphere
    const originMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.3 }),
    );
    scene.add(originMesh);

    // Dynamic arrow pool
    const arrowMap = new Map<string, THREE.Group>();

    // Parallelogram mesh
    const paraGeo = new THREE.BufferGeometry();
    const paraPositions = new Float32Array(12);
    paraGeo.setAttribute('position', new THREE.BufferAttribute(paraPositions, 3));
    paraGeo.setIndex([0, 1, 2, 0, 2, 3]);
    const paraMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.22,
      roughness: 0.6,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const paraMesh = new THREE.Mesh(paraGeo, paraMat);
    scene.add(paraMesh);

    // Right-hand curl arc indicator
    const curlMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.35,
      metalness: 0.3,
    });
    let curlMesh: THREE.Mesh | null = null;

    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;
    let disposed = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function requestRender() {
      if (disposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame(() => {
        if (disposed) return;
        renderDirty = false;
        controls.update();
        renderer.render(scene, camera);
        const done = () => {
          renderBusy = false;
          if (renderDirty && !disposed) requestRender();
        };
        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    }

    function syncScene() {
      const state = propsRef.current;
      gridHelper.visible = state.showGrid;
      axesGroup.visible = state.showAxisLabels;

      const activeIds = new Set<string>();
      for (const item of state.vectors) {
        activeIds.add(item.id);
        let arrow = arrowMap.get(item.id);
        if (!arrow) {
          arrow = createCompositeArrow(item.color);
          arrowMap.set(item.id, arrow);
          scene.add(arrow);
        }
        if (item.visible === false) {
          arrow.visible = false;
        } else {
          updateCompositeArrow(arrow, item.vec);
        }
      }

      for (const [id, group] of arrowMap.entries()) {
        if (!activeIds.has(id)) {
          scene.remove(group);
          arrowMap.delete(id);
        }
      }

      if (state.showParallelogram && state.parallelogramPair) {
        const [a, b] = state.parallelogramPair;
        const p0 = new THREE.Vector3(0, 0, 0);
        const p1 = physicsToThree(a);
        const p3 = physicsToThree(b);
        const p2 = p1.clone().add(p3);

        const attr = paraGeo.getAttribute('position') as THREE.BufferAttribute;
        attr.setXYZ(0, p0.x, p0.y, p0.z);
        attr.setXYZ(1, p1.x, p1.y, p1.z);
        attr.setXYZ(2, p2.x, p2.y, p2.z);
        attr.setXYZ(3, p3.x, p3.y, p3.z);
        attr.needsUpdate = true;
        paraGeo.computeVertexNormals();
        paraMesh.visible = p1.length() > 0.05 && p3.length() > 0.05;
      } else {
        paraMesh.visible = false;
      }

      if (curlMesh) {
        scene.remove(curlMesh);
        curlMesh.geometry.dispose();
        curlMesh = null;
      }

      if (state.showRightHandCurl && state.parallelogramPair) {
        const [a, b] = state.parallelogramPair;
        const va = physicsToThree(a);
        const vb = physicsToThree(b);
        const la = va.length();
        const lb = vb.length();
        if (la > 0.2 && lb > 0.2) {
          const ua = va.clone().normalize();
          const ub = vb.clone().normalize();
          const angle = ua.angleTo(ub);
          if (angle > 0.08 && angle < Math.PI - 0.05) {
            const radius = Math.min(1.5, Math.min(la, lb) * 0.55);
            const pts: THREE.Vector3[] = [];
            const steps = 16;
            for (let i = 0; i <= steps; i++) {
              const t = i / steps;
              const interp = ua.clone().lerp(ub, t).normalize().multiplyScalar(radius);
              pts.push(interp);
            }
            const curve = new THREE.CatmullRomCurve3(pts);
            const tubeGeo = new THREE.TubeGeometry(curve, 16, 0.03, 8, false);
            curlMesh = new THREE.Mesh(tubeGeo, curlMat);
            scene.add(curlMesh);
          }
        }
      }

      requestRender();
    }

    sceneApiRef.current = {
      syncScene,
      setCameraPreset: (preset) => {
        if (preset === 'iso') {
          camera.position.set(9.2, 7.6, 10.2);
          controls.target.set(0, 0.6, 0);
        } else if (preset === 'top') {
          camera.position.set(0, 12.5, 0.01);
          controls.target.set(0, 0, 0);
        } else if (preset === 'front') {
          camera.position.set(0, 2.0, 12.5);
          controls.target.set(0, 0.6, 0);
        }
        camera.lookAt(controls.target);
        requestRender();
      },
    };

    controls.addEventListener('change', requestRender);

    const resizeObserver = new ResizeObserver(() => {
      if (disposed || !container) return;
      const nw = Math.max(300, container.clientWidth);
      const nh = Math.max(320, container.clientHeight);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
      requestRender();
    });
    resizeObserver.observe(container);

    syncScene();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener('change', requestRender);
      controls.dispose();
      paraGeo.dispose();
      paraMat.dispose();
      curlMat.dispose();
      if (curlMesh) curlMesh.geometry.dispose();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    sceneApiRef.current?.syncScene();
  }, [vectors, showGrid, showAxisLabels, showParallelogram, parallelogramPair, showRightHandCurl]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[380px] sm:h-[460px] lg:h-[520px] rounded-lg overflow-hidden bg-[#F8FAFC] border border-slate-200"
    >
      {webglError ? (
        <div className="w-full h-full flex items-center justify-center p-6 text-sm text-slate-600">
          {webglError}
        </div>
      ) : (
        <>
          <div ref={mountRef} data-testid="vector-3d-canvas" aria-label={ariaLabel} className="w-full h-full" />

          {/* Compact Camera & Basis Legend (solid rgba, no backdrop-filter over WebGL) */}
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 bg-white/95 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
            <span className="font-medium text-slate-700 mr-1">Camera:</span>
            <button
              type="button"
              onClick={() => sceneApiRef.current?.setCameraPreset('iso')}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-medium transition-colors"
            >
              Isometric
            </button>
            <button
              type="button"
              onClick={() => sceneApiRef.current?.setCameraPreset('top')}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-medium transition-colors"
            >
              Top (XY)
            </button>
            <button
              type="button"
              onClick={() => sceneApiRef.current?.setCameraPreset('front')}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-medium transition-colors"
            >
              Side (XZ)
            </button>
          </div>

          <div className="absolute bottom-3 left-3 bg-white/95 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 flex flex-wrap items-center gap-3 pointer-events-none">
            <span>Drag to orbit · Scroll to zoom</span>
            <span aria-hidden="true">·</span>
            {vectors.map((v) => (
              <span key={v.id} className="inline-flex items-center gap-1.5 font-medium">
                <span
                  className="w-2.5 h-2.5 rounded-sm inline-block"
                  style={{ backgroundColor: `#${v.color.toString(16).padStart(6, '0')}` }}
                />
                <span>{v.label}</span>
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
