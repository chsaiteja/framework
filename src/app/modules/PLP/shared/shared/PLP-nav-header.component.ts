import { Component, Input, Output, EventEmitter } from '@angular/core';

import { RouterModule, Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { PLPSharedService } from '../shared/PLP-shared.service';
@Component({
  selector: 'PLP-nav-header',
  templateUrl: './PLP-nav-header.layout.html',
})
export class PLPNavHeaderComponent {

  @Input('header') header: any = { previousSec: "", nextSec: "", nextSecLink: "", previousSecLink: "" };
  @Input('report-status') report = "";
  @Output() changeInrView = new EventEmitter();
  @Input() FrameworkObj;
  subscription: Subscription;
  headerTitleObj;
  constructor(private plpShared: PLPSharedService, private activeRoute: ActivatedRoute, private router: Router) {
  }
  ngOnInit() {
    this.getHeaderTitle(this.header.section);
    this.subscription = this.router.events.debounceTime(100).subscribe(event => {
      let urlArr = window.location.pathname.split('/');
      this.getHeaderTitle(urlArr[urlArr.length - 1])
      this.header = this.plpShared.getSectionObject(this.headerTitleObj.section);

    })

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  getHeaderTitle(url) {
    if (this.FrameworkObj != undefined) {
      this.headerTitleObj = this.FrameworkObj['compList'].find((inrobj) => {
        return inrobj.url == './' + url;
      });
    }
    // return obj;
  }
  loadPrevious(previous) {
    // alert("PLP nav header is:" + JSON.stringify(this.header));
    if (previous != undefined) {
      //this.getHeaderTitle(this.header.previousSec);
      this.changeInrView.emit(this.header.previousSec);
      this.router.navigate([this.header.previousSecLink], { relativeTo: this.activeRoute });
    }
  }

  loadNext(next) {
    // alert("PLP nav header is:" + JSON.stringify(this.header));
    if (next != undefined) {
      // this.getHeaderTitle(this.header.nextSec);
      this.changeInrView.emit(this.header.nextSec);
      this.router.navigate([this.header.nextSecLink], { relativeTo: this.activeRoute });
    }
  }
}
