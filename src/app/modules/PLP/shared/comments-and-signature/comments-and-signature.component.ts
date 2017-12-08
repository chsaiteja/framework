import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { CommentsAndSignatureModel } from './comments-and-signature.model';
import { PLPNavHeaderComponent } from '../shared/PLP-nav-header.component';
import { PLPSharedService } from '../shared/PLP-shared.service';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';

import { CustomValidations } from '../shared/common-validation';
import { EndUrlArr } from '../../../../shared/constants/app.constants';
import { messages } from '../../../../shared/constants/messages';

@Component({
  selector: 'comments-and-signature',
  templateUrl: './comments-and-signature.layout.html',
})
export class CommentsAndSignatureComponent {
  @Input('report-status') report = "";
  @Output('changeView') changeInrView = new EventEmitter();
  @Output() containResult = new EventEmitter();

  commentsAndSignatureData = {
    Comment: "",
    Signature: ""
  };
  sectionObject;
  section = "CommentsAndSignature";
  endurl;
  public commentPostReq = {
    "AccountID": "",
    "Comment": "",
    "Signature": ""
  };
  errorMessage;
  successLabel;
  commentInfoPara = "";
  public edited = false;
  public errorVal = false;
  CommentAndSigForm: FormGroup;
  Comment: AbstractControl;

  constructor(private plpShared: PLPSharedService, private utils: Utilities,
    private serverApi: ServerApi, private storageService: StorageService, private apiJson: ApiCallClass, fb: FormBuilder) {
    this.CommentAndSigForm = fb.group({
      'Comment': ["", Validators.compose([CustomValidations.noScript, CustomValidations.maxlengthCheckForComment])],
      'Signature': ['']
    });
    this.Comment = this.CommentAndSigForm.controls['Comment'];
    this.errorMessage = messages;
  }

  ngOnInit() {
    this.utils.showLoading();
    this.sectionObject = this.plpShared.getSectionObject(this.section);
    this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&PLPSections");
    this.endurl = EndUrlArr;
    this.getCommentsAndSignatureData();
  }

  changeTextarea(event) {
    if (this.Comment.hasError("maxlengthCheckForComment")) {
      return event.which == 8;
    }
  }
  saveChanges() {
    if (this.plpShared.isJsonChanged(JSON.parse(this.storageService.sessionStorageGet("CommentsAndSignature")), this.commentsAndSignatureData)) {
      return true;
    } else {
      return false;
    }
    // return true;
  }
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander($event: any) {

    let change = this.saveChanges();
    if (change) {
      $event.returnValue = 'Your data will be lost!';
    }
  }
  getCommentsAndSignatureData() {
    // let filledstatus="";
    let data = {
      accountID: this.utils.getAccountId()
    }
    this.apiJson.method = "GET";
    this.apiJson.moduleName = "PLP";
    let urlObj = this.plpShared.getUrlObject(this.section);
    this.apiJson.endUrl = urlObj.endUrl;

    this.apiJson.sessionID = this.utils.getAuthKey();
    let dat = JSON.stringify(data);

    this.apiJson.data = dat;
    this.serverApi.callApi([this.apiJson]).subscribe((response) => {
      let commentSigntmp = response[0].Result;
      this.storageService.sessionStorageSet("CommentsAndSignature", JSON.stringify(commentSigntmp));
      this.commentsAndSignatureData = commentSigntmp;
      this.commentsAndSignatureData = response[0].Result;
      if (response[0].Result.Comment != null && response[0].Result.Comment.trim() != "") {

        this.commentInfoPara = (response[0].Result.Comment).replace(/\n/g, "<br/>");
        //filledstatus = "filled";
      }
      // else {
      //         filledstatus = "";
      // }
      //   if (filledstatus == "filled") {
      //   //alert("coming in if");
      //     this.containResult.emit({ "section": this.section, result: "filled" });
      // }
      // else {
      //   //alert("coming in else");
      //     this.containResult.emit({ "section": this.section, result: "empty" });
      // }

      this.utils.hideLoading();
    }, this.utils.handleError);
  }

  SaveComments() {
    this.utils.showLoading();
    let urlObj = this.plpShared.getUrlObject(this.section);
    this.apiJson.endUrl = urlObj.endUrl;
    this.apiJson.method = "POST";
    this.apiJson.moduleName = "PLP";
    this.apiJson.sessionID = this.utils.getAuthKey();
    this.commentPostReq = {
      "AccountID": this.utils.getAccountId(),
      "Comment": this.commentsAndSignatureData.Comment,
      "Signature": this.commentsAndSignatureData.Signature
    }
    let user = JSON.stringify(this.commentPostReq);
    this.apiJson.data = user;
    this.serverApi.callApi([this.apiJson]).subscribe((response) => {
      if (response.Result + "" == "true") {
        this.storageService.sessionStorageSet("CommentsAndSignature", JSON.stringify(this.commentsAndSignatureData));
        this.utils.hideLoading();
        if (this.commentsAndSignatureData.Comment == "" || this.commentsAndSignatureData.Comment == null) {
          //this.containResult.emit({ "section": this.section, result: "empty" });
          this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Empty");
        }
        else {
          // this.containResult.emit({ "section": this.section, result: "filled" });
          this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Filled");
        }
        let successMsg = this.plpShared.getSuccessMessage(this.section);
        this.successLabel = successMsg.update;
        this.edited = true;
        //wait 5 Seconds and hide
        setTimeout(function () {
          this.edited = false;
          // console.log(this.edited);
        }.bind(this), 5000);
      }
      else {
        this.utils.hideLoading();
        let successMsg = this.plpShared.getSuccessMessage(this.section);
        this.successLabel = successMsg.error;
        this.errorVal = true;
        //wait 5 Seconds and hide
        setTimeout(function () {
          this.errorVal = false;
          // console.log(this.edited);
        }.bind(this), 5000);
      }

    }, error => this.logError(error));
  }

  logError(error: any) {
    this.utils.hideLoading();
    let successMsg = this.plpShared.getSuccessMessage(this.section);
    this.successLabel = successMsg.error;
    this.errorVal = true;
    //wait 5 Seconds and hide
    setTimeout(function () {
      this.errorVal = false;
      // console.log(this.edited);
    }.bind(this), 5000);
  }

  changeView(evnt) {
    // this.changeInrView.emit(evnt);
  }

  savedDataAssigning() {
    //alert("inside comments and sign:"+sessionStorageGet("'"+this.section+"'"));
    for (let name in this.CommentAndSigForm.controls) {
      //(<Control>this.CommentAndSigForm.controls[name]).updateValue('');
      this.CommentAndSigForm.controls[name].setErrors(null);
    }
    if ((this.storageService.sessionStorageGet("'" + this.section + "'") == "" || (this.storageService.sessionStorageGet("CommentsAndSignature") + "" == "null"))) {
      this.commentsAndSignatureData.Comment = "";
      this.commentsAndSignatureData.Signature = JSON.parse(this.storageService.sessionStorageGet("CommentsAndSignature")).Signature;
    } else {
      this.commentsAndSignatureData.Comment = JSON.parse(this.storageService.sessionStorageGet("CommentsAndSignature")).Comment;
      this.commentsAndSignatureData.Signature = JSON.parse(this.storageService.sessionStorageGet("CommentsAndSignature")).Signature;
    }

  }

  changesMade() {
    if (this.plpShared.isJsonChanged(JSON.parse(this.storageService.sessionStorageGet("CommentsAndSignature")), this.commentsAndSignatureData)) {
      return true;
    } else {
      return false;
    }

  }
}
