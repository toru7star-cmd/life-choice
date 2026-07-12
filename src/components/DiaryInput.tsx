"use client";

import { Textarea } from "@/components/ui/textarea";

const MAX_LENGTH = 100;

interface DiaryInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DiaryInput({ value, onChange }: DiaryInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX_LENGTH))}
        maxLength={MAX_LENGTH}
        rows={3}
        placeholder="一言日記（任意）例：資格の勉強を1時間した"
        className="min-h-24 resize-none rounded-2xl px-4 py-3 text-base"
      />
      <span className="self-end text-xs text-muted-foreground">
        {value.length} / {MAX_LENGTH}
      </span>
    </div>
  );
}
