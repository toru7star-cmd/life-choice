import { CatMessage, CatMessageInput, CatMessageProvider } from "./types";

/**
 * 将来、日記の内容や過去の記録の傾向をもとにAIでメッセージを生成する実装。
 * 現時点ではAPI接続を行わない雛形のみで、APIキーや外部通信は含まない。
 * 差し替える際は src/lib/cat-message/index.ts の catMessageProvider を
 * `new AICatMessageProvider(...)` に置き換えるだけでよい構成にしてある。
 */
export class AICatMessageProvider implements CatMessageProvider {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getMessage(input: CatMessageInput): CatMessage {
    throw new Error("AICatMessageProvider is not implemented yet.");
  }
}
