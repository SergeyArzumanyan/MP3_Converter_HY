import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { HotKeyHint } from "@Core/interfaces";

@Component({
  selector: 'app-hot-keys-hint',
  templateUrl: './hot-keys-hint.component.html',
  styleUrls: ['./hot-keys-hint.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotKeysHintComponent {
  @Input({ required: true }) shortcuts: HotKeyHint[] = [];
}
