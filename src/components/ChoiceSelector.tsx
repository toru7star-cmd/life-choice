"use client";

import { CheckIcon } from "lucide-react";
import ChoiceIcon from "@/components/ChoiceIcon";
import { Button } from "@/components/ui/button";
import { CHOICE_LABELS, CHOICE_ORDER, Choice } from "@/lib/types";
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
            <ChoiceIcon choice={choice} size={30} />
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
