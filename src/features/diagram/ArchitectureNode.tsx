import { Handle, Position, type NodeProps } from "@xyflow/react";
import { memo } from "react";
import { categoryConfig } from "../../data/uiData";
import { cn } from "../../utils/cn";
import type { ArchitectureNode as ArchitectureNodeType } from "./types";

function ArchitectureNodeComponent({ data }: NodeProps<ArchitectureNodeType>) {
  const category = categoryConfig[data.category];
  const serviceCode = data.serviceCode ?? data.title.slice(0, 4).toUpperCase();

  return (
    <div
      className={cn(
        "group relative min-w-48 max-w-56 rounded-2xl border bg-slate-950/90 p-3 text-left shadow-2xl backdrop-blur-xl transition-all duration-200",
        category.border,
        data.selected && "scale-[1.03] ring-2 ring-cyan-300/80",
        data.connected && !data.selected && "ring-1 ring-cyan-400/40",
        data.dimmed && "opacity-30 grayscale",
        !data.dimmed && `hover:-translate-y-1 hover:shadow-xl ${category.glow}`,
      )}
      dir="ltr"
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2.5 !w-2.5 !border-2 !border-slate-950 !bg-cyan-300"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!h-2.5 !w-2.5 !border-2 !border-slate-950 !bg-cyan-300"
      />

      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-0 transition group-hover:opacity-100" />
      <div className="relative flex items-start gap-3">
        <div className={cn("relative grid h-13 w-13 shrink-0 place-items-center rounded-2xl border bg-slate-950 text-center shadow-inner", category.border)}>
          <span className="text-[11px] font-black tracking-tight text-white">{serviceCode}</span>
          <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-lg border border-slate-800 bg-slate-950 text-sm shadow-lg">
            {data.icon}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white", category.badge)}>
              {category.label}
            </span>
            {data.matched && <span className="rounded-full bg-cyan-400/20 px-2 py-0.5 text-[10px] font-bold text-cyan-100">match</span>}
          </div>
          <h3 className="mt-2 truncate text-sm font-black text-white">{data.title}</h3>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-400">{data.subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export const ArchitectureNode = memo(ArchitectureNodeComponent);
