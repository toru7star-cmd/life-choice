"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    // 開発中はHMRとService Workerのキャッシュが競合しリロードループになるため本番ビルドのみ登録する
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // 登録失敗時はオフライン対応が効かないだけなので無視する
      });
    }
  }, []);

  return null;
}
