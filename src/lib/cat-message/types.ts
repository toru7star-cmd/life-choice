import { Choice } from "@/lib/types";

export interface CatMessageInput {
  choice: Choice;
  diary?: string;
  recordDate: string;
}

export interface CatMessage {
  message: string;
  closingMessage: string;
}

export interface CatMessageProvider {
  getMessage(input: CatMessageInput): CatMessage;
}
