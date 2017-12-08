import { Component, OnInit, OnDestroy, ViewChild, Output, Input } from '@angular/core';
import { RouterModule, Router, ActivatedRoute, NavigationEnd, NavigationStart, NavigationExtras } from '@angular/router';
import { PLPSharedService } from '../shared/shared/PLP-shared.service';
// import { ReportComponent } from '../report/report.component';
import { ApiCallClass } from '../../../shared/modal/apicall.modal';
import { StorageService } from '../../../shared/outer-services/storage.service';
import { Utilities } from '../../../shared/outer-services/utilities.service';
import { ServerApi } from '../../../shared/outer-services/app.apicall.service';
import { PersonalInfoModel } from '../shared/personal-info/personal-info.model';
import { Directive, EventEmitter, HostListener } from '@angular/core';
import { PersonalInfoComponent } from '../shared/personal-info/personal-info.component';
import { EducationPlansComponent } from '../shared/education-plans/education-plans.component';
import { CareerGoalsComponent } from '../shared/career-goals/career-goals.component';
import { ActionPlanComponent } from '../shared/action-plan-for-year/action-plan.component';
import { CareerAssessmentsComponent } from '../shared/career-assessments/career-assessments.component';
import { CareerClusterComponent } from '../shared/career-cluster/career-cluster.component';
import { CommentsAndSignatureComponent } from '../shared/comments-and-signature/comments-and-signature.component';
import { CoursePlanComponent } from '../shared/course-plan/course-plan.component';
import { EmploymentHistoryComponent } from '../shared/employment-history/employment-history.component';
import { ExperientialLearningComponent } from '../shared/experiential-learning/experiential-learning.component';
import { ExtraActivitiesComponent } from '../shared/extra-activities/extra-activities.component';
import { GraduationRequirementsComponent } from '../shared/graduation-requirements/graduation-requirements.component';
import { OccAndClusterComponent } from '../shared/occ-and-cluster/occ-and-cluster.component';
import { SchoolsOfInterestComponent } from '../shared/schools-of-interest/schools-of-interest.component';
import { StudyOfInterestComponent } from '../shared/study-of-interest/study-of-interest.component';
import { SupportNetworkComponent } from '../shared/support-network/support-network.component';
import { TestScoresComponent } from '../shared/test-scores/test-scores.component';
import { VolunteerCommunityServiceComponent } from '../shared/volunteer-community-service/volunteer-community-service.component';
import { Subscription } from "rxjs/Subscription";
import { EventDispatchService } from '../../../shared/outer-services/event-dispatch.service';

import { WidgetDynamicComponent } from '../../framework/layouts/widget.component';
import { ListDynamicComponent } from '../../framework/layouts/list.component';


let formFillIndexVal = 0;


@Component({
  selector: 'plp-set',
  templateUrl: './PLP-sections.layout.html',
})

export class PlpComponent implements OnInit, OnDestroy {
  prevObjname;
  sectionsList;
  menuState = false;
  viewMode;
  oldViewMode;
  report;
  username;
  compleSectionsList = [];
  mouseup = new EventEmitter();
  mousedown = new EventEmitter();
  mousemove = new EventEmitter();
  @Input('report-status') reportState = "";

  subscription = new Subscription();
  componentType;
  sectionObject;
  itemsList = {};
  tileView = false;
  defaultPage = '';
  footerval;
  footervalip;
  footerPostion = 0;
  viewValue = 0;

  constructor(private router: Router, private eventService: EventDispatchService, private apiJson: ApiCallClass,
    private utils: Utilities, private storageService: StorageService,
    private apicall: ServerApi, private plpShared: PLPSharedService, private activatedRoute: ActivatedRoute) {
    try {

      /* this.activatedRoute.queryParams.subscribe(params => {
         this.defaultPage = params["page"];
         if (this.defaultPage != '' && this.defaultPage != undefined) {
           this.router.navigate(['./' + this.defaultPage], { relativeTo: this.activatedRoute });
          }
       });*/


      // console.log('PLP-Sections constructor called');
      this.subscription = this.eventService.listen().subscribe((e) => {
        // let name = []
        try {
          let name = e.type;
          let plpname = name.split('&');
          if (plpname[1] == 'PLPSections')
            this.changeViewHeader(plpname[0]);


        } catch (e) {
          alert('PLP-section constructor inside exception:' + e.message);

        }
      });
    }
    catch (e) {
      alert('PLP-section constructor exception:' + e.message);
    }
    let urlArr;// = (this.router.url).split('/');
    // let url = urlArr[urlArr.length - 1];
    // alert("url------ urlArr in Constructor in PlpComponent--->" + urlArr);
    let ref = this, activeRouteUrl = '';
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        activeRouteUrl = event.url;
        urlArr = activeRouteUrl.split('/');

        if (urlArr[urlArr.length - 1] === 'tiles' || urlArr.length === 3) {
          this.tileView = true;
        } else {
          this.tileView = false;
        }
      }

      if (event instanceof NavigationStart) {
      }

    })

    this.footervalip = "";
    // if (obj.assessment == "entrepreneurQuiz") {
    this.footerval = "footer_eq";
    //   } else if (obj.assessment == "interestProfilerSf") {
    //     ref.footerval = "footer_ip";
    //     ref.viewValue = 1;
    //     ref.footervalip = "emp_training_footer";
    //   } else {
    //     ref.footerval = "footer_common";
    //   }

  }




  resultsArr = [];
  responseArr = [];
  setTitle($event) {

  }
  ngOnInit() {
    //this.router.navigateByUrl('./personalInfo');
    // this.componentType = this.utils.getFrameworkComponent('modPLP');//ListDynamicComponent;

    try {
      this.sectionObject = this.plpShared.getSectionObject("PersonalInfo");
    }
    catch (e) {
      alert("Exception in PlpComponent oninit" + e.message);
    }
    // alert('assessment-header items are:' + JSON.stringify(this.sectionObject));
    // alert(this.widgetVal.itemName);
    this.storageService.sessionStorageSet('itemsList', JSON.stringify(this.itemsList));




    let frame = this.utils.getFrameworkComponent('modPLP');//ListDynamicComponent;
    let items = this.utils.getItemsList(frame.compList, true);
    this.itemsList = items;

    this.componentType = frame.component;
    if (frame.layout == 'tiles') {

      this.router.navigate(['tiles'], { relativeTo: this.activatedRoute });
    }
    else {
      // this.router.navigate([this.itemsList[0].url], { relativeTo: this.activatedRoute });
    }
    let userdata = {
      accountID: this.utils.getAccountId()
    };
    this.apiJson.moduleName = "PLP";
    this.apiJson.method = "GET";
    this.apiJson.endUrl = "CompletionStatus";
    this.apiJson.sessionID = this.utils.getAuthKey();
    let user = JSON.stringify(userdata);
    this.apiJson.data = user;
    this.apicall.callApi([this.apiJson]).subscribe((response) => {

      this.responseArr = response[0].Result;
      let reference = this;
      let ref = this;
      ref.itemsList['menuItems'].forEach(function (obj, inx) {
        ref.responseArr.forEach(function (resObj, resInx) {

          if (obj.apiName == ref.responseArr[resInx].SectionCode) {

            obj['fillStatus'] = ref.responseArr[resInx].SectionComplete;
          }
        })
      });

      // console.log('menu items in itemsList' + ref.responseArr[0].SectionComplete);
    }, this.utils.handleError)

    this.utils.showLoading();
    // this.getPLPSectionsStatus();
    //  this.sectionsList = this.section.getServiceList();

    //alert("sectionList----->"+JSON.stringify(this.sectionsList));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  changeViewHeader(evnt) {
    try {
      let name = evnt;
      this.sectionObject = this.plpShared.getSectionObject(name);
    }
    catch (e) {
      alert("Exception in PlpComponent oninit" + e.message);
    }
  }
  menuToggle() {
    this.menuState = !this.menuState;
  }
  menuClose() {
    this.menuState = false;
  }

  navView(evnt) {
    //this.ItemClicked(evnt);
  }
  changeFilledStatus(section) {
    //alert("filled status---->"+section);
  }

}

