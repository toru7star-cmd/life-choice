import { TemplateCatMessageProvider } from "./template-provider";
import { CatMessageProvider } from "./types";

export type { CatMessage, CatMessageInput, CatMessageProvider } from "./types";
export { TemplateCatMessageProvider } from "./template-provider";
export { AICatMessageProvider } from "./ai-provider";

// 将来AIに差し替える際は、ここを `new AICatMessageProvider(...)` にするだけでよい。
export const catMessageProvider: CatMessageProvider = new TemplateCatMessageProvider();
