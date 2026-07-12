"use client";

import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CategoryEditor from "@/components/CategoryEditor";
import {
  addCategory,
  deleteCategory,
  getAllCategories,
  reorderCategories,
} from "@/lib/storage";
import { CHOICE_ORDER, UserCategoryItem } from "@/lib/types";

export default function SettingsPage() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [categories, setCategories] = useState<UserCategoryItem[]>([]);

  useEffect(() => {
    // localStorageはSSR時に読めないため、マウント後にクライアントでのみ読み込む
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCategories(getAllCategories());
    setLoaded(true);
  }, []);

  function refresh() {
    setCategories(getAllCategories());
  }

  function handleMove(id: string, direction: "up" | "down") {
    const item = categories.find((c) => c.id === id);
    if (!item) return;
    const sameType = categories
      .filter((c) => c.category === item.category)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    const index = sameType.findIndex((c) => c.id === id);
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= sameType.length) return;

    const reordered = [...sameType];
    [reordered[index], reordered[swapIndex]] = [
      reordered[swapIndex],
      reordered[index],
    ];
    reorderCategories(
      item.category,
      reordered.map((c) => c.id)
    );
    refresh();
  }

  if (!loaded) {
    return <div className="flex-1" />;
  }

  return (
    <div className="flex-1 px-6 pt-10 pb-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-1 text-sm text-muted-foreground"
      >
        <ChevronLeftIcon className="size-4" />
        戻る
      </button>

      <h1 className="mb-1 text-lg font-medium text-foreground">自分の分類</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        あなたにとって、どの行動がどの分類に当たるかを自由に登録できます。
      </p>

      {CHOICE_ORDER.map((category) => (
        <CategoryEditor
          key={category}
          category={category}
          items={categories
            .filter((c) => c.category === category)
            .sort((a, b) => a.sortOrder - b.sortOrder)}
          onAdd={(label) => {
            addCategory(category, label);
            refresh();
          }}
          onDelete={(id) => {
            deleteCategory(id);
            refresh();
          }}
          onMove={handleMove}
        />
      ))}
    </div>
  );
}
