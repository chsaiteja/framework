import { Component } from '@angular/core';
import { StorageService } from '../../shared/outer-services/storage.service';
import { Utilities } from '../../shared/outer-services/utilities.service';
import { Router } from '@angular/router';
@Component({
  selector: 'occ-detail-static-header',
  template: ` 
`,
})
export class OccDetailStaticHeaderComponent {
  menuState = false;
  // filter = { 'hidden': true };
  userName = "";
  constructor(private router: Router, private utils: Utilities, private storageService: StorageService) {
  }

  ngOnInit() {
    this.userName = this.storageService.sessionStorageGet("userName");
  }
  logout() {
    this.storageService.mainLogOut();

  }
  menuToggle() {
    this.menuState = !this.menuState;
  }
  menuClose() {
    this.menuState = false;
  }
}
