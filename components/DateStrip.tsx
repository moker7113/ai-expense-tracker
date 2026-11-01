"use client";

import { useEffect, useRef } from "react";
import { daysInMonth, todayKey, weekdayOf } from "@/lib/date";

type Props = {
  month: string;
  selected: string;
  markedDays: Set<string>;
  onSelect: (dateKey: string) => void;
};

export default function DateStrip({ month, selected, markedDays, onSelect }: Props) {
  const selectedRef = useRef<HTMLButtonElement>(null);
  const today = todayKey();

  // 選中的日期自動捲到中間
  useEffect(() => {
    selectedRef.current?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [selected, month]);

  return (
    <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-3 pt-1">
      {daysInMonth(month).map((key) => {
        const isSelected = key === selected;
        const isToday = key === today;
        return (
          <button
            key={key}
            ref={isSelected ? selectedRef : undefined}
            onClick={() => onSelect(key)}
            className={`flex w-[52px] shrink-0 snap-center flex-col items-center gap-1 rounded-2xl py-2.5 transition-all duration-200 ${
              isSelected
                ? "bg-brand scale-105 text-white shadow-glow"
                : "bg-card text-foreground shadow-soft active:scale-95"
            }`}
          >
            <span className={`text-[11px] font-medium ${isSelected ? "text-white/80" : isToday ? "text-accent" : "text-muted"}`}>
              {isToday ? "今天" : weekdayOf(key)}
            </span>
            <span className="text-lg font-bold leading-none tabular-nums">{Number(key.slice(8))}</span>
            <span
              className={`h-1 w-1 rounded-full ${
                markedDays.has(key) ? (isSelected ? "bg-white" : "bg-accent") : "bg-transparent"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
