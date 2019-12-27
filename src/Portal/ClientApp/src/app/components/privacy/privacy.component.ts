import { Component, OnInit } from '@angular/core';

import { fadeInOut } from '../../services/animations';
import { ConfigurationService } from '../../services/configuration.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css'],
  animations: [fadeInOut]
})
export class PrivacyComponent implements OnInit {

  isLoggedIn: boolean;

  constructor(public configurations: ConfigurationService, private authService: AuthService) {
    this.isLoggedIn = authService.isLoggedIn;
  }

  ngOnInit() {
  }

}
