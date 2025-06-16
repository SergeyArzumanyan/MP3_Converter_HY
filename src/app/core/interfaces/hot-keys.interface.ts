import { HotKey } from "@Core/enums";

export interface HotKeyBinding {
  keys: Set<string>;
  callback: () => void;
  id: string;
}

export interface HotKeyHint {
  keys: HotKey[];
  action: string;
}
