import { clampNumber, sanitizeFinite } from '../../services/physics/vectorMath';

interface ParamControlProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  accentColor?: string;
  onChange: (value: number) => void;
}

export function ParamControl({
  id,
  label,
  value,
  min,
  max,
  step = 0.5,
  unit = '',
  accentColor = '#2563EB',
  onChange,
}: ParamControlProps) {
  const safeVal = clampNumber(sanitizeFinite(value, min), min, max);

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '' || raw === '-') return;
    const parsed = Number(raw);
    if (Number.isFinite(parsed)) {
      onChange(clampNumber(parsed, min, max));
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-sm inline-block shrink-0"
            style={{ backgroundColor: accentColor }}
            aria-hidden="true"
          />
          <span>{label}</span>
        </label>
        <div className="flex items-center gap-1">
          <input
            id={`${id}-num`}
            aria-label={`${label} numeric value`}
            type="number"
            min={min}
            max={max}
            step={step}
            value={Number(safeVal.toFixed(2))}
            onChange={handleNumberChange}
            className="w-16 px-1.5 py-0.5 text-right text-xs font-mono tabular-nums rounded border border-slate-200 bg-white text-slate-900 focus:border-blue-500 focus:outline-none"
          />
          {unit && <span className="text-xs text-slate-500 font-mono">{unit}</span>}
        </div>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={safeVal}
        onChange={(e) => onChange(clampNumber(Number(e.target.value), min, max))}
        className="w-full pk-slider"
      />
    </div>
  );
}
