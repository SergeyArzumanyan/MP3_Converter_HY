import { Component } from '@angular/core';

import { ConfigService } from "@Core/services";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(public configService: ConfigService) {}
}
