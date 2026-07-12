"use client";

import { useEffect } from "react";

const RELOAD_GUARD_KEY = "mindful-log:last-auto-reload";
const GUARD_WINDOW_MS = 10000;

export default function ErrorBoundary({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    // 新しいデプロイ直後などに、古いビルドの参照が残っていることで
    // 一度だけ読み込みエラーが起きる場合がある。ユーザーに見せず、
    // 自動で再読み込みして回復する（短時間に繰り返す場合は諦めて表示する）。
    const now = Date.now();
    const last = Number(sessionStorage.getItem(RELOAD_GUARD_KEY) ?? 0);
    if (now - last > GUARD_WINDOW_MS) {
      sessionStorage.setItem(RELOAD_GUARD_KEY, String(now));
      window.location.reload();
    }
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
      <p className="text-base text-muted-foreground">
        読み込みに時間がかかっています。少し待ってからもう一度お試しください。
      </p>
    </div>
  );
}
