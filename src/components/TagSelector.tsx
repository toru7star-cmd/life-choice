"use client";

import { useEffect, useState } from "react";
import { getCategoriesByType } from "@/lib/storage";
import { Choice, UserCategoryItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TagSelectorProps {
  category: Choice;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export default function TagSelector({ category, selectedIds, onChange }: TagSelectorProps) {
  const [items, setItems] = useState<UserCategoryItem[]>([]);

  useEffect(() => {
    // localStorageはSSR時に読めないため、マウント後にクライアントでのみ読み込む
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(getCategoriesByType(category));
  }, [category]);

  if (items.length === 0) return null;

  function toggle(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((existingId) => existingId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const isSelected = selectedIds.includes(item.id);
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => toggle(item.id)}
            aria-pressed={isSelected}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition-colors",
              isSelected
                ? "border-foreground/20 bg-secondary text-foreground"
                : "border-border text-muted-foreground"
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
