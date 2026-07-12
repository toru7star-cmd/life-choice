"use client";

import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CHOICE_ICONS, CHOICE_LABELS, CHOICE_ORDER, Choice } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ChoiceSelectorProps {
  value: Choice | null;
  onChange: (choice: Choice) => void;
}

export default function ChoiceSelector({ value, onChange }: ChoiceSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      {CHOICE_ORDER.map((choice) => {
        const isSelected = value === choice;
        return (
          <Button
            key={choice}
            type="button"
            variant={isSelected ? "secondary" : "outline"}
            onClick={() => onChange(choice)}
            aria-pressed={isSelected}
            className={cn(
              "h-auto w-full justify-start gap-4 rounded-2xl px-5 py-4 text-left",
              isSelected && "ring-1 ring-foreground/15"
            )}
          >
            <span className="text-3xl leading-none" aria-hidden>
              {CHOICE_ICONS[choice]}
            </span>
            <span className="flex-1 text-base font-medium whitespace-normal">
              {CHOICE_LABELS[choice]}
            </span>
            {isSelected && (
              <CheckIcon className="size-5 text-muted-foreground" aria-hidden />
            )}
          </Button>
        );
      })}
    </div>
  );
}
