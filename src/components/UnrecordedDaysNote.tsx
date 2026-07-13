"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getUnrecordedMessage } from "@/lib/unrecorded-message";
import { getAllRecords } from "@/lib/storage";

export default function UnrecordedDaysNote() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // localStorageはSSR時に読めないため、マウント後にクライアントでのみ読み込む
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessage(getUnrecordedMessage(getAllRecords()));
  }, []);

  if (!message) return null;

  return (
    <div className="mt-auto flex items-end gap-3 self-start pt-8">
      <Image
        src="/tom.png"
        alt=""
        width={327}
        height={400}
        style={{ height: 64, width: "auto" }}
        className="shrink-0 rounded-xl select-none [-webkit-touch-callout:none]"
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
      />
      <div className="relative max-w-[210px] rounded-2xl bg-white px-4 py-3 text-sm leading-relaxed text-foreground shadow-sm ring-1 ring-black/5">
        {message}
        <span
          className="absolute -bottom-1.5 left-6 size-3 rotate-45 rounded-[2px] bg-white ring-1 ring-black/5"
          aria-hidden
        />
      </div>
    </div>
  );
}
