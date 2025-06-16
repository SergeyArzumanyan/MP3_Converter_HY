import { Injectable, OnDestroy } from '@angular/core';

import { HotKeyBinding } from "@Core/interfaces";

@Injectable({
  providedIn: 'root',
})
export class HotKeysService implements OnDestroy {
  private bindings: HotKeyBinding[] = [];
  private pressedKeys: Set<string> = new Set();
  private executedCombos: Set<string> = new Set();

  constructor() {
    this.addEventListeners();
  }

  private addEventListeners(): void {
    document.addEventListener('keydown', this.onKeyDown, true);
    document.addEventListener('keyup', this.onKeyUp, true);

    window.addEventListener('blur', this.onWindowBlur);
    window.addEventListener('focus', this.onWindowFocus);
  }

  private removeEventListeners(): void {
    document.removeEventListener('keydown', this.onKeyDown, true);
    document.removeEventListener('keyup', this.onKeyUp, true);
    window.removeEventListener('blur', this.onWindowBlur);
    window.removeEventListener('focus', this.onWindowFocus);
  }

  /**
   * Registers a new hotkey listener
   * @param combo Array of key strings, e.g. ['Control', 'Shift', 'S']
   * @param callback Function to execute on combo match
   * @returns Function to unregister the hotkey
   */
  registerHotKey(combo: string[], callback: () => void): () => void {
    const binding: HotKeyBinding = {
      keys: new Set(combo.map(k => this.normalizeKey(k))),
      callback,
      id: this.generateBindingId(combo)
    };

    this.bindings.push(binding);

    return () => {
      this.bindings = this.bindings.filter(b => b.id !== binding.id);
    };
  }

  private generateBindingId(combo: string[]): string {
    return combo.sort().join('+');
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (this.isInputField(event.target as Element)) {
      return;
    }

    const key = this.normalizeKey(event.key);
    this.pressedKeys.add(key);

    // Prevent default for registered combinations
    if (this.shouldPreventDefault()) {
      event.preventDefault();
    }

    this.checkBindings();
  };

  private onKeyUp = (event: KeyboardEvent) => {
    const key = this.normalizeKey(event.key);
    this.pressedKeys.delete(key);

    this.executedCombos.clear();
  };

  private onWindowBlur = () => {
    this.pressedKeys.clear();
    this.executedCombos.clear();
  };

  private onWindowFocus = () => {
    this.pressedKeys.clear();
    this.executedCombos.clear();
  };

  private isInputField(element: Element | null): boolean {
    if (!element) return false;

    const tagName = element.tagName.toLowerCase();
    const inputTypes = ['input', 'textarea', 'select'];

    return inputTypes.includes(tagName) ||
      element.getAttribute('contenteditable') === 'true';
  }

  private normalizeKey(key: string): string {
    const keyMap: { [key: string]: string } = {
      'Control': 'ctrl',
      'Ctrl': 'ctrl',
      'Alt': 'alt',
      'Shift': 'shift',
      'Meta': 'meta',
      'Cmd': 'meta',
      'Command': 'meta',
      ' ': 'space',
      'Escape': 'escape',
      'Enter': 'enter',
      'Tab': 'tab',
      'Backspace': 'backspace',
      'Delete': 'delete',
      'ArrowUp': 'arrowup',
      'ArrowDown': 'arrowdown',
      'ArrowLeft': 'arrowleft',
      'ArrowRight': 'arrowright'
    };

    return keyMap[key] || key.toLowerCase();
  }

  private shouldPreventDefault(): boolean {
    for (const binding of this.bindings) {
      if (this.setsMatch(binding.keys, this.pressedKeys)) {
        return true;
      }
    }
    return false;
  }

  private checkBindings(): void {
    for (const binding of this.bindings) {
      if (this.setsMatch(binding.keys, this.pressedKeys)) {
        const comboId = Array.from(binding.keys).sort().join('+');

        if (!this.executedCombos.has(comboId)) {
          this.executedCombos.add(comboId);

          try {
            binding.callback();
          } catch (error) {
            console.error('Error executing hotkey callback:', error);
          }
        }
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

  /**
   * Clear all registered hotkeys
   */
  clearAllHotKeys(): void {
    this.bindings = [];
  }

  /**
   * Get currently pressed keys (for debugging)
   */
  getCurrentlyPressedKeys(): string[] {
    return Array.from(this.pressedKeys);
  }

  ngOnDestroy(): void {
    this.removeEventListeners();
    this.clearAllHotKeys();
  }
}
