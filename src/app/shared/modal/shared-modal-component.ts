
/** Angular imports */
import { Component, Input, OnInit, ViewChild, Pipe } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';
import { Store } from '@ngrx/store';

/** Third party library import */
import { NgbModal, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

/** Custom imports */
import { ApiCallClass } from '../modal/apicall.modal';
import { ServerApi } from '../outer-services/app.apicall.service';
import { StorageService } from '../outer-services/storage.service';
import { EventDispatchService } from '../outer-services/event-dispatch.service';
import { AsmntCommonState, defaultCommonText } from '../../state-management/state/main-state';



@Component({
  selector: 'ngbd-modal-content',
  template: `<div class="modal-header" data-keyboard="false">
      <h4 class="modal-title"> {{headerText}}{{((modalCommonText)?.commonText[headsection])}}{{trans_error}}</h4>
      </div>
      <div class="modal-body"  >
     {{session_exp_txt }} {{err_occ }}{{((modalCommonText)?.commonText[headingText])}}</div>
      <div class="modal-footer"  [hidden]="closevalue">     
      <button id="save" type="button" class="btn-common btn-success" (click)=" deleteTestScore()" >{{(modalCommonText)?.commonText[yesbtn]}}</button> 
      <button id="cancel" type="button" class="btn-common btn-primary" (click)="activeModal.close('Close click')">{{(modalCommonText)?.commonText[nobtn]}}</button> 
      </div>   
     <div class="modal-footer" [hidden]="!closevalue">
    
     <button id="reload" type="button" class="btn-common btn-warning" (click)="reloadmodal()" >Reload</button> 
     <button id="logout" type="button" class="btn-common btn-warning" (click)="logoutmodal()" >Sign out</button> 
     </div>    
    `
})
export class NgbdModalContent implements OnInit {
  headsection;
  yesbtn;
  nobtn;
  @Input() deletevalue;
  @Input() arrayValue;
  @Input() arrayMobValue;

  @Input() trans_error;
  // @Input() closebtn;
  @Input() err_occ;

  @Input() session_exp_txt;
  @Input() sessionName;

  @Input() Closebtnvalue;

  unsavedTxt;
  @Input() commonButtons;
  @Input() valueofunchange;

  browserDom: BrowserDomAdapter;
  closevalue = false;
  testScoreArr = [];
  headerText
  modalCommonText;
  headingText;
  constructor(private http: Http, private router: Router, private store: Store<AsmntCommonState>,
    public activeModal: NgbActiveModal, private apiJson: ApiCallClass, private storageService: StorageService,
    private eventService: EventDispatchService) {
    this.browserDom = new BrowserDomAdapter();
    this.modalCommonText = JSON.parse(this.storageService.sessionStorageGet('AsmntCommonTextStorage'));
    // this.modalCommonText = store.select('AsmntCommonText');
    // this.unsavedTxt = this.commonButtons['unsavedTxt'];
  }

  ngOnInit() {

    // console.log("close vlaue is  :in shared");
    try {
      setTimeout(function () {
        // try {
        if (this.commonButtons != undefined) {
          console.log('this.commonButtons : ' + this.commonButtons)
          this.headerText = this.commonButtons.headerText;
          this.headingText = this.commonButtons.unsavedTxt;
          this.headsection = this.commonButtons.headsection;
          this.nobtn = this.commonButtons.nobtn;
          this.yesbtn = this.commonButtons.yesbtn;
        }
        // console.log('headtext--' + this.headingText)
        // } catch (e) {
        //   console.log('in model component---' + e.message);
        // }
        this.browserDom.setStyle(document.querySelector('.modal-dialog'), "width", "90%");
      }.bind(this), 0);
    }
    catch (e) {
      alert("error--->" + e.message);
    }
    if (this.Closebtnvalue == 1) {
      this.closevalue = true;
    }

  }

  deleteTestScore() {
    if (this.deletevalue >= 0) {
      for (var i = 0; i < this.arrayValue.length; i++) {
        if (this.deletevalue == i) {
          this.arrayValue.splice(i, 1);
          for (let j = 0; j < 2; j++) {
            this.browserDom.setStyle(document.querySelectorAll('.SaveBtn' + i)[j], "display", "none");
            this.browserDom.setStyle(document.querySelectorAll('.edtBtn' + i)[j], "display", "block");
            this.browserDom.setStyle(document.querySelectorAll('.cancelBtn' + i)[j], "display", "none");
          }
        }
      }
      for (var i = 0; i < this.arrayMobValue.length; i++) {
        if (this.deletevalue == i) {
          this.arrayMobValue.splice(i, 1);
          for (let j = 0; j < 2; j++) {
            this.browserDom.setStyle(document.querySelectorAll('.SaveBtn' + i)[j], "display", "none");
            this.browserDom.setStyle(document.querySelectorAll('.edtBtn' + i)[j], "display", "block");
            this.browserDom.setStyle(document.querySelectorAll('.cancelBtn' + i)[j], "display", "none");
          }
        }
      }
    }

    if (this.sessionName == "sessioncheck") {
      let evnt = document.createEvent("CustomEvent");
      evnt.initEvent("sessionExtend", true, true);
      this.eventService.dispatch(evnt);
    }
    if (this.valueofunchange == "unsavedcheck") {
      let evnt = document.createEvent("CustomEvent");
      evnt.initEvent("unsaved", true, true);

      this.eventService.dispatch(evnt);
    }
    this.activeModal.close(true);
  }

  closemodal() {
    // console.log("called close()");

    this.activeModal.close(true);

  }
  reloadmodal() {
    window.location.reload();
  }
  logoutmodal() {
    this.storageService.mainLogOut();
    // window.location.href = 'login/loginForm';
  }
}

@Component({
  selector: 'ngbd-modal-loader',
  template: `
     <div  id="backdrop"  style="display:none;position: fixed;width: 100%;height: 100%;left:0;top:0;z-index:9999;
background: rgba(0,0,0,0.7);">

 <div  align="center" class="loading-center-v" >
    <div class="loader"></div>
    </div></div>
    `
})
export class NgbdModalLoaderContent implements OnInit {
  shwHideVal;
  browserDom: BrowserDomAdapter;
  constructor() {
    this.browserDom = new BrowserDomAdapter();
  }

  ngOnInit() {

  }
  showLoading() {
    //console.log("coming in showLoading");
    setTimeout(function () {
      this.browserDom.setStyle(document.querySelector('#backdrop'), "display", "block");
    }.bind(this), 0);
  }

  hideLoading() {
    // console.log("coming in hideLoading");
    this.browserDom.setStyle(document.querySelector('#backdrop'), "display", "none");
  }

}




@Component({
  selector: 'ngbd-modal-content',
  template: `
  
  <div class="modal-header" style="color: #0b8cbc;" data-keyboard="false">
      <h5 class="modal-title" [hidden]="!deleteValueTxt"> Delete Answer Set {{answerSet_txt}}</h5>
      <h5 class="modal-title" [hidden]="deleteValueTxt"> {{(modalCommonText)?.commonText[headsection]}} {{answerSet_txt}}</h5>
      
      </div>
      <div class="modal-body"><h6 id="thought">{{((modalCommonText)?.commonText[enter_thought_txt])}}</h6><p  [hidden]="showcomponent">
      <textarea class="form-control popup-textarea-plp2" rows="5" id="comment" placeholder="" [(ngModel)]="str"></textarea></p>
     <p [hidden]="!showcomponent" >{{delete_sure_txt}}</p>
     <p style="color: #FF0000; font-size:14px;" [hidden]="!showcomponent">{{action_undone_txt}}</p>
     </div>
      <div class="modal-footer">      
      <button id="save" type="button" class="{{classProperty}}"  (click)=" assessmentCommonAction()" >{{(modalCommonText)?.commonText[yesbtn]}}</button> 
      <button id="cancel" type="button" class="btn-common btn-warning" (click)="activeModal.close('Close click')">{{(modalCommonText)?.commonText[nobtn]}}</button> 
      </div>    
    `
})
export class AssessmentModalPopups implements OnInit {
  //saveModal parameters
  headsection;
  enter_thought_txt;
  @Input() textarea_txt;
  yesbtn;
  nobtn;
  @Input() classProperty;
  // @Input() jsonObjTxt;
  str: string;

  //deleteModal parameters

  @Input() showvalue;
  @Input() delete_sure_txt;
  @Input() answerSet_txt;
  @Input() action_undone_txt;
  @Input() commonButtons;
  @Input() Deletebtnvalue;

  showcomponent = false;
  modalCommonText;
  deleteValueTxt = false;
  browserDom: BrowserDomAdapter;
  constructor(private http: Http,
    public activeModal: NgbActiveModal, private apiJson: ApiCallClass, private store: Store<AsmntCommonState>,
    private eventService: EventDispatchService, private storageService: StorageService) {
    this.browserDom = new BrowserDomAdapter();
    this.modalCommonText = JSON.parse(this.storageService.sessionStorageGet('AsmntCommonTextStorage'));
    // this.modalCommonText = store.select('AsmntCommonText');
  }
  ngOnInit() {
    setTimeout(function () {
      this.nobtn = this.commonButtons.nobtn;
      this.yesbtn = this.commonButtons.yesbtn;
      this.enter_thought_txt = this.commonButtons.enter_thought_txt;
      this.headsection = this.commonButtons.headsection;
      this.browserDom.setStyle(document.querySelector('.modal-dialog'), "width", "90%");
      if (this.showvalue == 1) {
        this.showcomponent = true;
        this.classProperty = "btn-common btn-danger";
      }
      else {
        this.classProperty = "btn-common btn-success";
      }
      this.str = this.textarea_txt;
    }.bind(this), 0);
    if (this.Deletebtnvalue == 1) {
      this.deleteValueTxt = true;
    }
  }


  assessmentCommonAction() {

    if (this.showvalue == 1) {
      // console.log("delete Ok !...");
      let evnt = document.createEvent("CustomEvent");
      evnt.initEvent("DeleteButtonAction", true, true);
      this.eventService.dispatch(evnt);

    } else {
      if (this.showvalue == 2) {
        this.storageService.sessionStorageSet("textareaValue", this.str);
        let evnt = document.createEvent("CustomEvent");
        evnt.initEvent("SaveButtonAction", true, true);
        this.eventService.dispatch(evnt);

      }

    }
    this.activeModal.close();
  }

  ngOnDistroy() {
    // console.log("comming to distroy !...");
    this.showvalue = "";
  }
}




@Component({
  selector: 'ngbd-modal-snackbar',
  template: `<div id="snackbar">
  {{snackbarname}}
  </div>    `
})
export class SnackBar implements OnInit {
  snackbarname
  constructor() {
  }

  ngOnInit() {

  }
  myFunction(funcName) {
    this.snackbarname = funcName;
    let x = document.getElementById("snackbar");
    x.className = "show";
    x.innerHTML = ' <i class="fa fa-check" aria-hidden="true"></i>&nbsp;' + funcName;
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
  }
}
