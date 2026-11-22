export interface StreamlitTutorRequest {
  type: 'tutor_request';
  requestId: string;
  message: string;
  history: { role: 'user' | 'model'; text: string }[];
  context: {
    subject: string;
    chapter: string;
    topic: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    hintFirst: boolean;
  };
}

export interface StreamlitTutorResponse {
  requestId: string;
  reply?: string;
  error?: string;
}

type RenderListener = (args: Record<string, unknown>) => void;

const renderListeners = new Set<RenderListener>();
let initialized = false;
let lastHeight = 0;

export function isStreamlitRuntime(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.has('streamlitUrl') || window.location.pathname.includes('/component/');
}

function sendFrameHeight() {
  if (!isStreamlitRuntime()) return;
  const rootHeight = Math.max(
    document.documentElement?.scrollHeight ?? 0,
    document.body?.scrollHeight ?? 0,
    820,
  );
  if (Math.abs(rootHeight - lastHeight) > 4) {
    lastHeight = rootHeight;
    window.parent.postMessage(
      {
        isStreamlitMessage: true,
        type: 'streamlit:setFrameHeight',
        height: rootHeight,
      },
      '*',
    );
  }
}

export function initStreamlitBridge(): void {
  if (initialized || !isStreamlitRuntime()) return;
  initialized = true;

  window.addEventListener('message', (event: MessageEvent) => {
    const data = event.data as { type?: string; args?: Record<string, unknown> } | null;
    if (data?.type === 'streamlit:render' && data.args) {
      renderListeners.forEach((listener) => listener(data.args!));
      window.requestAnimationFrame(sendFrameHeight);
    }
  });

  window.parent.postMessage(
    {
      isStreamlitMessage: true,
      type: 'streamlit:componentReady',
      apiVersion: 1,
    },
    '*',
  );

  sendFrameHeight();

  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(() => {
      sendFrameHeight();
    });
    if (document.body) {
      observer.observe(document.body);
    }
  }
}

export function requestStreamlitTutor(
  payload: Omit<StreamlitTutorRequest, 'type' | 'requestId'>,
): Promise<{ reply?: string; error?: string }> {
  const requestId = `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return new Promise((resolve) => {
    const timeoutId = window.setTimeout(() => {
      renderListeners.delete(onRender);
      resolve({ error: 'Timed out waiting for the Streamlit AI Tutor response.' });
    }, 30000);

    const onRender: RenderListener = (args) => {
      const response = args.tutor_response as StreamlitTutorResponse | undefined;
      if (response && response.requestId === requestId) {
        window.clearTimeout(timeoutId);
        renderListeners.delete(onRender);
        resolve({
          reply: response.reply,
          error: response.error,
        });
      }
    };

    renderListeners.add(onRender);

    const message: StreamlitTutorRequest = {
      type: 'tutor_request',
      requestId,
      ...payload,
    };

    window.parent.postMessage(
      {
        isStreamlitMessage: true,
        type: 'streamlit:setComponentValue',
        value: message,
        dataType: 'json',
      },
      '*',
    );
  });
}
