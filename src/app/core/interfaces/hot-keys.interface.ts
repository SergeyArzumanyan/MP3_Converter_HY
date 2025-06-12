import { HotKey } from "@Core/enums";

export interface HotKeyBinding {
  keys: Set<string>;
  callback: () => void;
}

export interface HotKeyHint {
  keys: HotKey[];
  action: string;
}
