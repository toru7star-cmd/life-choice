"use client";

import { ChevronDownIcon, ChevronUpIcon, XIcon } from "lucide-react";
import { useState } from "react";
import ChoiceIcon from "@/components/ChoiceIcon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CHOICE_LABELS, Choice, UserCategoryItem } from "@/lib/types";

interface CategoryEditorProps {
  category: Choice;
  items: UserCategoryItem[];
  onAdd: (label: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
}

export default function CategoryEditor({
  category,
  items,
  onAdd,
  onDelete,
  onMove,
}: CategoryEditorProps) {
  const [newLabel, setNewLabel] = useState("");

  function handleAdd() {
    const trimmed = newLabel.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setNewLabel("");
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ChoiceIcon choice={category} size={20} />
          {CHOICE_LABELS[category]}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {items.length > 0 && (
          <ul className="flex flex-col gap-2">
            {items.map((item, index) => (
              <li
                key={item.id}
                className="flex items-center gap-1 rounded-xl border px-3 py-2.5"
              >
                <span className="flex-1 text-sm text-foreground">{item.label}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onMove(item.id, "up")}
                  disabled={index === 0}
                  aria-label="上に移動"
                >
                  <ChevronUpIcon className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onMove(item.id, "down")}
                  disabled={index === items.length - 1}
                  aria-label="下に移動"
                >
                  <ChevronDownIcon className="size-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label="削除"
                      />
                    }
                  >
                    <XIcon className="size-4" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>「{item.label}」を削除しますか</AlertDialogTitle>
                      <AlertDialogDescription>
                        この分類項目を削除します。すでに記録した日記には影響しません。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>キャンセル</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(item.id)}>
                        削除する
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </li>
            ))}
          </ul>
        )}

        <div className="flex gap-2">
          <Input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="行動を追加"
            className="h-10 flex-1"
          />
          <Button type="button" onClick={handleAdd} className="h-10">
            追加
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
