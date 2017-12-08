import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, Renderer, HostListener } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { CustomValidations } from '../shared/common-validation';
import { PLPNavHeaderComponent } from '../shared/PLP-nav-header.component';
import { TestScoresModel } from './test-scores.model';
import { PLPSharedService } from '../shared/PLP-shared.service';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { messages } from '../../../../shared/constants/messages';
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';

declare var $: any;
var indexVal = 0;

@Component({
  selector: 'test-scores',
  templateUrl: './test-scores.layout.html'
})

export class TestScoresComponent {
  browserDom: BrowserDomAdapter;
  @Input('report-status') report = "";
  @Output('changeView') changeInrView = new EventEmitter();
  @Output() containResult = new EventEmitter();
  @ViewChild('Testvalue') te: ElementRef;
  @ViewChild('Scorevalue') sc: ElementRef;
  @ViewChild('addTable') ad: ElementRef;
  @ViewChild('visibleclassname') visible1: ElementRef;
  testScoresData = [];
  testScoreArr = [];
  testScoreArrMob = [];
  isDisable = false;
  scoreEmptyVal = false;
  testEmpVal = false;
  sectionObject;
  questionObject;
  endurl;
  isClassVisible;
  findTable;
  nextHide = true;
  errorMessage;
  sectionsList;
  maxTestlen = false;
  section = "TestScores";
  testSc = new TestScoresModel;
  testScoresForm: FormGroup;
  public testScoresPostReq = {
    "AccountID": "",
    "TestScores": []
  };
  successLabel;
  public edited = false;
  public errorVal = false;
  public testEmptyVal = false;
  SaveChanges = "";
  testscoresArray: FormArray;
  constructor(private plpShared: PLPSharedService, private utils: Utilities, private storageService: StorageService,
    private serverApi: ServerApi, private apiJson: ApiCallClass, private fb: FormBuilder, private renderer: Renderer, private elementref: ElementRef) {

    this.browserDom = new BrowserDomAdapter();
    //Construct and populate the defenses FormArray outside of the FormBuilder so we can populate it dynamically
    this.testValidations();

    this.errorMessage = messages;
  }

  ngOnInit() {
    this.utils.showLoading();
    this.nextHide = false;
    this.sectionObject = this.plpShared.getSectionObject(this.section);
    this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&PLPSections");
    this.questionObject = this.plpShared.getQuestion(this.section);
    this.isDisable = false;
    this.testValidations();
    this.getTestScoresData();
    if (this.testScoreArr.length == 6) {
      this.findTable = "true";
      // this.isClassVisible = true;

    }
    else {
      this.findTable = "";
      // this.isClassVisible = false;

    }
  }

  changeText(event) {

  }
  getTestScoresData() {
    let urlObj = this.plpShared.getUrlObject(this.section);
    this.apiJson.endUrl = urlObj.endUrl;
    let testArr = [];
    let filledStatus = "";
    let data = {
      accountID: this.utils.getAccountId()
    }
    this.apiJson.method = "GET";
    this.apiJson.moduleName = "PLP";
    this.apiJson.sessionID = this.utils.getAuthKey();
    let dat = JSON.stringify(data);
    this.apiJson.data = dat;
    this.serverApi.callApi([this.apiJson]).subscribe((response) => {
      response[0].Result.forEach((obj, key) => {
        if ((obj.TestName == "" && obj.Score == "") || (obj.TestName + "" == "null" && obj.Score + "" == "null")) {
        }
        else {
          this.testScoreArr.push({ "createdTime": new Date().getTime(), "TestName": obj.TestName, "Score": obj.Score });
          // this.testScoreArr.push(obj);

          if (this.testScoreArr.length == 6) {
            this.findTable = "true";
            // this.isClassVisible = true;
          }
          else {
            this.findTable = "";
            // this.isClassVisible = false;
          }
          filledStatus = "filled";
        }
      })
      this.testScoreArr.sort(function (a, b) {
        return parseFloat(b.createdTime) - parseFloat(a.createdTime);
      });
      // console.log("this.testScoreArr--in get-->" + JSON.stringify(this.testScoreArr));

      this.testScoreArr.forEach((obj, key) => {
        this.testScoreArrMob.push({ "createdTime": new Date().getTime(), "TestNameMob": obj.TestName, "ScoreMob": obj.Score });
      })
      this.testScoreArrMob.sort(function (a, b) {
        return parseFloat(b.createdTime) - parseFloat(a.createdTime);
      });
      // console.log("this.testScoreArrMob--in get-->" + JSON.stringify(this.testScoreArrMob));
      this.testValidations();

      this.storageService.sessionStorageSet("testArr", JSON.stringify(this.testScoreArr));
      if (this.testScoreArr.length != 0 && this.testScoreArr.length != null) {
        this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Filled");
      }
      else {
        this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Empty");
      }
      this.utils.hideLoading();
    }, this.utils.handleError);
  }


  testValidations() {
    let testsFormGroup: FormGroup = new FormGroup({});
    let testsMobFormGroup: FormGroup = new FormGroup({});
    for (let d of this.testScoreArr) {
      let control: FormControl = new FormControl(d.TestName, Validators.compose([CustomValidations.maxlengthCheckForTest]));
      let control1: FormControl = new FormControl(d.Score, Validators.compose([CustomValidations.maxlengthCheckForTest]));
      testsFormGroup.addControl(d.TestName, control);
      testsFormGroup.addControl(d.Score, control1);
    }

    for (let d of this.testScoreArrMob) {
      let control: FormControl = new FormControl(d.TestNameMob, Validators.compose([CustomValidations.maxlengthCheckForTest]));
      let control1: FormControl = new FormControl(d.ScoreMob, Validators.compose([CustomValidations.maxlengthCheckForTest]));
      testsMobFormGroup.addControl(d.TestNameMob, control);
      testsMobFormGroup.addControl(d.ScoreMob, control1);
    }
    this.testScoresForm = this.fb.group({
      Test: ["", Validators.compose([CustomValidations.maxlengthCheckForTest])],
      score: ["", Validators.compose([CustomValidations.maxlengthCheckForTest])],
      testScores: testsFormGroup,
      testScoreArrMob: testsMobFormGroup
    });
  }

  addTest() {
    this.isClassVisible = "";
    if (this.te.nativeElement.value == "" && this.sc.nativeElement.value == "") {
      this.testEmptyVal = true;
      setTimeout(function () {
        this.testEmptyVal = false;
      }.bind(this), 5000);
    }
    else {
      //alert(this.te.nativeElement.value + "---score-----" + this.sc.nativeElement.value);
      if (this.te.nativeElement.value != "" && this.sc.nativeElement.value == "") {
        this.scoreEmptyVal = true;
        setTimeout(function () {
          this.scoreEmptyVal = false;
        }.bind(this), 5000);
      }
      else if (this.te.nativeElement.value == "" && this.sc.nativeElement.value != "") {
        this.testEmpVal = true;
        setTimeout(function () {
          this.testEmpVal = false;
        }.bind(this), 5000);
      }
      else {
        this.testScoreArr = JSON.parse(JSON.stringify(this.testScoreArr));
        this.testScoreArr.push({ "createdTime": new Date().getTime(), "TestName": this.testSc.TestName, "Score": this.testSc.Score });
        // console.log(" this.testScoreArr befor reverse---->"+ JSON.stringify(this.testScoreArr));
        this.testScoreArr.sort(function (a, b) {
          return parseFloat(b.createdTime) - parseFloat(a.createdTime);
        });
        // console.log("this.testScoreArr---->"+JSON.stringify(this.testScoreArr));
        this.testScoreArrMob = JSON.parse(JSON.stringify(this.testScoreArrMob));
        this.testScoreArrMob.push({ "createdTime": new Date().getTime(), "TestNameMob": this.testSc.TestName, "ScoreMob": this.testSc.Score });
        this.testScoreArrMob.sort(function (a, b) {
          return parseFloat(b.createdTime) - parseFloat(a.createdTime);
        });
      }
      // console.log("this.testScoreArr---->"+JSON.stringify(this.testScoreArrMob));
      this.testValidations();
      if (this.testScoreArr.length == 6) {
        this.findTable = "true";
        // this.isClassVisible = true;
        this.te.nativeElement.value = "";
        this.sc.nativeElement.value = "";
      }
      else {
        this.findTable = "";
        // this.isClassVisible = false;
      }
    }
  }

  remove(inx) {
    indexVal = inx;
    this.utils.callAlertSure(inx, this.testScoreArr, this.testScoreArrMob);
    this.findTable = "";
    //this.popUpDialog.show(this);
  }


  editClicked = -1;
  editTest(inx) {
    let element;
    var CheckBlock;
    try {
      CheckBlock = this.browserDom.getStyle(document.querySelector('.SaveBtn' + this.editClicked), "display");
    }
    catch (e) {
      console.log("visibility error-->" + e.message);
    }
    if (CheckBlock == "block") {
      this.SaveChanges = "true";
      this.isDisable = true;
    }

    else {
      if (this.editClicked != -1) {
        for (let i = 0; i < 2; i++) {
          this.browserDom.setStyle(document.querySelectorAll('.ScoreDesk' + this.editClicked)[i], "display", "block");
          this.browserDom.setStyle(document.querySelectorAll('.TestDesk' + this.editClicked)[i], "display", "block");
          this.renderer.setElementClass(document.querySelectorAll(".ScoreDesk" + this.editClicked)[i], 'testScoreSave', true);
          this.renderer.setElementClass(document.querySelectorAll(".ScoreDesk" + this.editClicked)[i], 'form-control', false);
          this.renderer.setElementClass(document.querySelectorAll(".TestDesk" + this.editClicked)[i], 'testScoreSave', true);
          this.renderer.setElementClass(document.querySelectorAll(".TestDesk" + this.editClicked)[i], 'form-control', false);
          this.browserDom.setStyle(document.querySelectorAll('.ScoreDesk' + this.editClicked)[i], "cursor", "not-allowed");
          this.browserDom.setStyle(document.querySelectorAll('.TestDesk' + this.editClicked)[i], "cursor", "not-allowed");
        }
        this.isClassVisible = 'true';
        for (let i = 0; i < 2; i++) {
          this.browserDom.setStyle(document.querySelectorAll('.testNameDesk' + this.editClicked)[i], "display", "none");
          this.browserDom.setStyle(document.querySelectorAll('.scoreNameDesk' + this.editClicked)[i], "display", "none");
          this.browserDom.setStyle(document.querySelectorAll('.cancelBtn' + this.editClicked)[i], "display", "none");
          this.browserDom.setStyle(document.querySelectorAll('.edtBtn' + this.editClicked)[i], "display", "block");
        }
      }
      for (let i = 0; i < 2; i++) {
        this.browserDom.setStyle(document.querySelectorAll('.ScoreDesk' + inx)[i], "display", "block");
        this.browserDom.setStyle(document.querySelectorAll('.TestDesk' + inx)[i], "display", "block");
        this.renderer.setElementClass(document.querySelectorAll(".ScoreDesk" + inx)[i], 'testScoreSave', false);
        this.renderer.setElementClass(document.querySelectorAll(".ScoreDesk" + inx)[i], 'form-control', true);
        this.renderer.setElementClass(document.querySelectorAll(".TestDesk" + inx)[i], 'testScoreSave', false);
        this.renderer.setElementClass(document.querySelectorAll(".TestDesk" + inx)[i], 'form-control', true);
        this.browserDom.setStyle(document.querySelectorAll('.testNameDesk' + inx)[i], "display", "none");
        this.browserDom.setStyle(document.querySelectorAll('.scoreNameDesk' + inx)[i], "display", "none");
        this.browserDom.setStyle(document.querySelectorAll('.TestDesk' + inx)[i], "cursor", "auto");
        this.browserDom.setStyle(document.querySelectorAll('.ScoreDesk' + inx)[i], "cursor", "auto");
        this.browserDom.setStyle(document.querySelectorAll('.edtBtn' + inx)[i], "display", "none");
        this.browserDom.setStyle(document.querySelectorAll('.cancelBtn' + inx)[i], "display", "block");
      }
      this.isClassVisible = 'true';
      this.editClicked = inx;
      this.callChangeFun(this, this.editClicked);
    }
  }

  callChangeFun(ref, index) {
    window.onkeyup = (function () {
      for (let i = 0; i < 2; i++) {
        ref.browserDom.setStyle(document.querySelectorAll('.SaveBtn' + index)[i], "display", "block");
        ref.browserDom.setStyle(document.querySelectorAll('.edtBtn' + index)[i], "display", "none");
        ref.browserDom.setStyle(document.querySelectorAll('.cancelBtn' + index)[i], "display", "none");
      }
    });
  }

  CancelTest(inx) {
    for (let i = 0; i < 2; i++) {
      this.browserDom.setStyle(document.querySelectorAll('.cancelBtn' + inx)[i], "display", "none");
      this.browserDom.setStyle(document.querySelectorAll('.edtBtn' + inx)[i], "display", "block");
      this.browserDom.setStyle(document.querySelectorAll('.ScoreDesk' + inx)[i], "display", "none");
      this.browserDom.setStyle(document.querySelectorAll('.TestDesk' + inx)[i], "display", "none");
      this.renderer.setElementClass(document.querySelectorAll(".ScoreDesk" + inx)[i], 'testScoreSave', true);
      this.renderer.setElementClass(document.querySelectorAll(".ScoreDesk" + inx)[i], 'form-control', false);
      this.renderer.setElementClass(document.querySelectorAll(".TestDesk" + inx)[i], 'testScoreSave', true);
      this.renderer.setElementClass(document.querySelectorAll(".TestDesk" + inx)[i], 'form-control', false);
      this.browserDom.setStyle(document.querySelectorAll('.ScoreDesk' + inx)[i], "cursor", "not-allowed'");
    }
    document.querySelectorAll(this.browserDom.query('.ScoreDesk' + inx).removeAttribute('readonly', true));
    document.querySelectorAll(this.browserDom.query('.TestDesk' + inx).removeAttribute('readonly', true));
    for (let i = 0; i < 2; i++) {
      this.browserDom.setStyle(document.querySelectorAll('.TestDesk' + inx)[i], "cursor", "not-allowed'");
      this.browserDom.setStyle(document.querySelectorAll('.testNameDesk' + inx)[i], "display", "block");
      this.browserDom.setStyle(document.querySelectorAll('.scoreNameDesk' + inx)[i], "display", "block");
    }

  }

  reset() {
    this.te.nativeElement.value = "";
    this.sc.nativeElement.value = "";
    for (var name in this.testScoresForm.controls) {
      this.testScoresForm.controls[name].setErrors(null);
    }
  }
  saveTest(inx) {
    window.onkeyup = null;
    this.isDisable = false;
    for (let i = 0; i < 2; i++) {
      this.browserDom.setStyle(document.querySelectorAll('.ScoreDesk' + inx)[i], "display", "none");
      this.browserDom.setStyle(document.querySelectorAll('.TestDesk' + inx)[i], "display", "none");
      this.browserDom.setStyle(document.querySelectorAll('.testNameDesk' + inx)[i], "display", "block");
      this.browserDom.setStyle(document.querySelectorAll('.scoreNameDesk' + inx)[i], "display", "block");
      this.renderer.setElementClass(document.querySelectorAll(".ScoreDesk" + inx)[i], 'testScoreSave', true);
      this.renderer.setElementClass(document.querySelectorAll(".ScoreDesk" + inx)[i], 'form-control', false);
      this.renderer.setElementClass(document.querySelectorAll(".TestDesk" + inx)[i], 'testScoreSave', true);
      this.renderer.setElementClass(document.querySelectorAll(".TestDesk" + inx)[i], 'form-control', false);
      this.browserDom.setStyle(document.querySelectorAll('.ScoreDesk' + inx)[i], "cursor", "not-allowed");
      this.browserDom.setStyle(document.querySelectorAll('.TestDesk' + inx)[i], "cursor", "not-allowed");
    }
    document.querySelectorAll(this.browserDom.query('.ScoreDesk' + inx).removeAttribute('readonly', true));
    document.querySelectorAll(this.browserDom.query('.TestDesk' + inx).removeAttribute('readonly', true));
    for (let i = 0; i < 2; i++) {
      this.browserDom.setStyle(document.querySelectorAll('.edtBtn' + inx)[i], "display", "block");
      this.browserDom.setStyle(document.querySelectorAll('.SaveBtn' + inx)[i], "display", "none");
    }
    for (let i = 0; i < 2; i++) {
      $(".testNameDesk" + inx).text($('.TestDesk' + inx).val());
      $(".scoreNameDesk" + inx).text($('.ScoreDesk' + inx).val());
    }
  }

  SaveTestScores() {
    let element;
    let cnt = 0;
    for (var i = 0; i < this.testScoreArr.length; i++) {
      let CheckDisplay = this.browserDom.getStyle(document.querySelector('.SaveBtn' + i), "display");
      if (CheckDisplay == "true") {
        cnt++;
      }
    }
    if (cnt > 0) {
      this.SaveChanges = "true";
      this.isDisable = true;
    }
    else {
      this.CallSaveTestScores();
    }
  }
  //below method is used to post the data to the server
  CallSaveTestScores() {
    let postTestArr = [];
    this.utils.showLoading();
    let urlObj = this.plpShared.getUrlObject(this.section);
    this.apiJson.endUrl = urlObj.endUrl;
    this.apiJson.method = "POST";
    this.apiJson.sessionID = this.utils.getAuthKey();
    if (this.testScoreArr.length != 0 && this.testScoreArr.length != null) {
      this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Filled");
    }
    else {
      this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Empty");
    }
    postTestArr = JSON.parse(JSON.stringify(this.testScoreArr));
    if (postTestArr.length <= 6) {
      for (var i = 0; i = (6 - postTestArr.length); i++) {
        postTestArr.push({ "TestName": "", "Score": "" });
      }
    }
    this.testScoresPostReq = {
      "AccountID": this.utils.getAccountId(),
      "TestScores": postTestArr
    };
    let user = JSON.stringify(this.testScoresPostReq);
    this.apiJson.data = user;
    // console.log("user in post call---->" + user);
    this.serverApi.callApi([this.apiJson]).subscribe((response) => {
      if (response.Result + "" == "true") {
        this.storageService.sessionStorageSet("testArr", JSON.stringify(this.testScoreArr));
        this.utils.hideLoading();
        let successMsg = this.plpShared.getSuccessMessage(this.section);
        this.successLabel = successMsg.update;
        //alert(this.successLabel);
        for (var i = 0; i < this.testScoreArr.length; i++) {
          for (let j = 0; j < 2; j++) {
            this.renderer.setElementClass(document.querySelectorAll(".ScoreDesk" + i)[j], 'testScoreSave', true);
            this.renderer.setElementClass(document.querySelectorAll(".ScoreDesk" + i)[j], 'form-control', false);
            this.renderer.setElementClass(document.querySelectorAll(".TestDesk" + i)[j], 'testScoreSave', true);
            this.renderer.setElementClass(document.querySelectorAll(".TestDesk" + i)[j], 'form-control', false);
            this.browserDom.setStyle(document.querySelectorAll('.ScoreDesk' + i)[j], "display", "none");
            this.browserDom.setStyle(document.querySelectorAll('.TestDesk' + i)[j], "display", "none");
            this.browserDom.setStyle(document.querySelectorAll('.testNameDesk' + i)[j], "display", "block");
            this.browserDom.setStyle(document.querySelectorAll('.scoreNameDesk' + i)[j], "display", "block");
            this.browserDom.setStyle(document.querySelectorAll('.edtBtn' + i)[j], "display", "block");
            this.browserDom.setStyle(document.querySelectorAll('.SaveBtn' + i)[j], "display", "none");
            this.browserDom.setStyle(document.querySelectorAll('.cancelBtn' + i)[j], "display", "none");
          }
        }
        this.edited = true;
        //wait 3 Seconds and hide
        setTimeout(function () {
          this.edited = false;
        }.bind(this), 5000);
      }
      else {
        this.utils.hideLoading();
        let successMsg = this.plpShared.getSuccessMessage(this.section);
        this.successLabel = successMsg.error;
        this.errorVal = true;
        setTimeout(function () {
          this.errorVal = false;
        }.bind(this), 5000);
      }
    }, error => this.logError(error));
  }

  changeView(evnt) {
    this.changeInrView.emit(evnt);
  }

  savedDataAssigning() {
    for (var name in this.testScoresForm.controls) {
      this.testScoresForm.controls[name].setErrors(null);
      this.isDisable = false;
    }
    this.testScoreArr = JSON.parse(this.storageService.sessionStorageGet("testArr"));
  }

  changesMade() {
    let changed = false;

    if (this.te.nativeElement.value != "" && this.te.nativeElement.value != null) {
      changed = true;
    } else if (this.sc.nativeElement.value != "" && this.sc.nativeElement.value != null) {
      changed = true;
    } else if (this.plpShared.isJsonChanged(this.storageService.sessionStorageGet("testArr"), JSON.stringify(this.testScoreArr))) {
      changed = true;
    } else {
      changed = false;
    }

    if (changed == false) {
      for (var i = 0; i < this.testScoreArr.length; i++) {
        for (let j = 0; j < 2; j++) {
          this.renderer.setElementClass(document.querySelectorAll(".ScoreDesk" + i)[j], 'testScoreSave', true);
          this.renderer.setElementClass(document.querySelectorAll(".ScoreDesk" + i)[j], 'form-control', false);
          this.renderer.setElementClass(document.querySelectorAll(".TestDesk" + i)[j], 'testScoreSave', true);
          this.renderer.setElementClass(document.querySelectorAll(".TestDesk" + i)[j], 'form-control', false);
          this.browserDom.setStyle(document.querySelectorAll('.testNameDesk' + i)[j], "display", "block");
          this.browserDom.setStyle(document.querySelectorAll('.scoreNameDesk' + i)[j], "display", "block");
          this.browserDom.setStyle(document.querySelectorAll('.ScoreDesk' + i)[j], "display", "none");
          this.browserDom.setStyle(document.querySelectorAll('.TestDesk' + i)[j], "display", "none");
          this.browserDom.setStyle(document.querySelectorAll('.edtBtn' + i)[j], "display", "block");
          this.browserDom.setStyle(document.querySelectorAll('.SaveBtn' + i)[j], "display", "none");
          this.browserDom.setStyle(document.querySelectorAll('.cancelBtn' + i)[j], "display", "none");
        }
      }
    }
    return changed;
  }

  logError(error: any) {
    //alert("error"+error);
    this.utils.hideLoading();
    let successMsg = this.plpShared.getSuccessMessage(this.section);
    this.successLabel = successMsg.error;
    this.errorVal = true;
    //wait 3 Seconds and hide
    setTimeout(function () {
      this.errorVal = false;
      // console.log(this.edited);
    }.bind(this), 5000);
  }
  saveChanges() {

    let changed = false;

    if (this.te.nativeElement.value != "" && this.te.nativeElement.value != null) {
      changed = true;
    } else if (this.sc.nativeElement.value != "" && this.sc.nativeElement.value != null) {
      changed = true;
    } else if (this.plpShared.isJsonChanged(this.storageService.sessionStorageGet("testArr"), JSON.stringify(this.testScoreArr))) {
      changed = true;
    } else {
      changed = false;
    }

    if (changed == false) {
      for (var i = 0; i < this.testScoreArr.length; i++) {
        for (let j = 0; j < 2; j++) {
          this.renderer.setElementClass(document.querySelectorAll(".ScoreDesk" + i)[j], 'testScoreSave', true);
          this.renderer.setElementClass(document.querySelectorAll(".ScoreDesk" + i)[j], 'form-control', false);
          this.renderer.setElementClass(document.querySelectorAll(".TestDesk" + i)[j], 'testScoreSave', true);
          this.renderer.setElementClass(document.querySelectorAll(".TestDesk" + i)[j], 'form-control', false);
          this.browserDom.setStyle(document.querySelectorAll('.testNameDesk' + i)[j], "display", "block");
          this.browserDom.setStyle(document.querySelectorAll('.scoreNameDesk' + i)[j], "display", "block");
          this.browserDom.setStyle(document.querySelectorAll('.ScoreDesk' + i)[j], "display", "none");
          this.browserDom.setStyle(document.querySelectorAll('.TestDesk' + i)[j], "display", "none");
          this.browserDom.setStyle(document.querySelectorAll('.edtBtn' + i)[j], "display", "block");
          this.browserDom.setStyle(document.querySelectorAll('.SaveBtn' + i)[j], "display", "none");
          this.browserDom.setStyle(document.querySelectorAll('.cancelBtn' + i)[j], "display", "none");
        }
      }
    }
    return changed;
    // return true;
  }
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander($event: any) {

    let change = this.saveChanges();
    if (change) {
      $event.returnValue = 'Your data will be lost!';
    }
  }
}

