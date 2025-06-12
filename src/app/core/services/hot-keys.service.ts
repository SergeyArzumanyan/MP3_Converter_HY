import { Injectable, OnDestroy } from '@angular/core';

import { HotKeyBinding } from "@Core/interfaces";

@Injectable({
  providedIn: 'root',
})
export class HotKeysService implements OnDestroy {
  private bindings: HotKeyBinding[] = [];
  private pressedKeys: Set<string> = new Set();

  constructor() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  /**
   * Registers a new hotkey listener
   * @param combo Array of key strings, e.g. ['Control', 'Shift', 'S']
   * @param callback Function to execute on combo match
   */
  registerHotKey(combo: string[], callback: () => void): void {
    this.bindings.push({
      keys: new Set(combo.map(k => this.normalizeKey(k))),
      callback
    });
  }


  private onKeyDown = (event: KeyboardEvent) => {
    const key = this.normalizeKey(event.key);
    this.pressedKeys.add(key);
    this.checkBindings();
  };

  private onKeyUp = (event: KeyboardEvent) => {
    const key = this.normalizeKey(event.key);
    this.pressedKeys.delete(key);
  };

  private normalizeKey(key: string): string {
    const modifiers = ['Shift', 'Control', 'Alt', 'Meta'];
    return modifiers.includes(key) ? key : key.toLowerCase();
  }


  private checkBindings(): void {
    for (const binding of this.bindings) {
      if (this.setsMatch(binding.keys, this.pressedKeys)) {
        binding.callback();
      }
    }
  }

  private setsMatch(setA: Set<string>, setB: Set<string>): boolean {
    if (setA.size !== setB.size) return false;
    for (const key of setA) {
      if (!setB.has(key)) return false;
    }
    return true;
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }
}
