import Image from "next/image";
import { Choice } from "@/lib/types";
import { cn } from "@/lib/utils";

const CHOICE_ICON_SRC: Record<Choice, string> = {
  future: "/icon-future.png",
  present: "/icon-present.png",
  drift: "/icon-drift.png",
};

const CHOICE_ICON_INTRINSIC_SIZE: Record<Choice, { width: number; height: number }> = {
  future: { width: 332, height: 329 },
  present: { width: 354, height: 291 },
  drift: { width: 341, height: 317 },
};

interface ChoiceIconProps {
  choice: Choice;
  size?: number;
  className?: string;
}

export default function ChoiceIcon({ choice, size = 28, className }: ChoiceIconProps) {
  const { width, height } = CHOICE_ICON_INTRINSIC_SIZE[choice];
  const renderWidth = Math.round((width / height) * size);

  return (
    <Image
      src={CHOICE_ICON_SRC[choice]}
      alt=""
      width={width}
      height={height}
      style={{ height: size, width: renderWidth }}
      className={cn("select-none [-webkit-touch-callout:none]", className)}
      draggable={false}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
}
