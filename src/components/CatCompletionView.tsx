"use client";

import { CheckIcon } from "lucide-react";
import Image from "next/image";
import { CatMessage } from "@/lib/cat-message";

interface CatCompletionViewProps {
  catMessage: CatMessage;
}

export default function CatCompletionView({ catMessage }: CatCompletionViewProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <span className="flex size-12 items-center justify-center rounded-full bg-emerald-50">
          <CheckIcon className="size-6 text-emerald-600" aria-hidden />
        </span>
        <p className="text-xl font-medium text-foreground">記録が完了しました</p>
      </div>

      <div className="relative w-full max-w-xs rounded-3xl bg-white px-5 py-4 text-left shadow-sm ring-1 ring-black/5">
        <span className="absolute top-3 right-4 text-base opacity-70" aria-hidden>
          🐾
        </span>
        <p className="text-base leading-relaxed text-foreground">{catMessage.message}</p>
        <p className="mt-1 text-base leading-relaxed text-foreground">
          {catMessage.closingMessage}
        </p>
        <span
          className="absolute -bottom-2 left-10 size-4 rotate-45 rounded-[2px] bg-white ring-1 ring-black/5"
          aria-hidden
        />
      </div>

      <div className="w-[60%] max-w-[220px]">
        <Image
          src="/cat.png"
          alt=""
          width={715}
          height={887}
          className="h-auto w-full select-none [-webkit-touch-callout:none]"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          priority
        />
        <div className="mx-auto -mt-2 h-3 w-2/3 rounded-full bg-black/10 blur-sm" aria-hidden />
      </div>
    </div>
  );
}
