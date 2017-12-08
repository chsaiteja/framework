import { Injectable } from '@angular/core';
import { Subscription } from "rxjs/Subscription";

import { sectionsArr } from '../../../../shared/constants/app.constants';
import { questionsArr } from '../../../../shared/constants/app.constants';
import { EndUrlArr } from '../../../../shared/constants/app.constants';
import { returnUrl } from '../../../../shared/constants/app.constants';
import { tableNoData } from '../../../../shared/constants/app.constants';
import { successMessageArr } from '../../../../shared/constants/app.constants';
import { Utilities } from '../../../../shared/outer-services/utilities.service';


import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../../../shared/modal/shared-modal-component';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
@Injectable()
export class PLPSharedService {
  sectionsList;
  questionsList;
  endUrlObj;
  returnUrl;
  noDataList;
  messages;
  successMessageList;
  subscription = new Subscription;
  /*This constructor initializes values*/
  constructor(private modalService: NgbModal, private eventService: EventDispatchService) {
    this.sectionsList = sectionsArr;
    this.questionsList = questionsArr;
    this.endUrlObj = EndUrlArr;
    this.returnUrl = returnUrl;
    this.noDataList = tableNoData;
    // this.messages = messages;
    this.successMessageList = successMessageArr;
    /** Below code block listens broadcasted event and 
				 * calls respective functionality for this assessment */
    /* this.subscription = eventService.listen().subscribe((e) => {
 
      
     });*/
  }

  ngOnDestroy() {
    //window.location.href.replace(location.hash, "");
    this.subscription.unsubscribe();
  }

  open(text) {
    //console.log('open text plp')
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = 'World';
    modalRef.componentInstance.transVal = text;
  }

  /*This method is used to show the loading*/

  /*This function returns the list of all section objects 
   */
  getServiceList() {
    return this.sectionsList;
  }

  /*This function returns the list of specific section objects 
   */
  getSectionObject(section) {
    try {

      this.sectionsList = sectionsArr;
      let sectionObject;

      if (this.sectionsList.length > 0) {

        this.sectionsList.forEach((obj, key) => {
          // alert(obj.section + "<---obj.section" + section + "<--section" + obj.routerLink + "<----obj.routerLink")
          if ((obj.section + "" == section + "") || (obj.routerLink == section + "")) {

            obj.totalCount = this.sectionsList.length;
            obj.currentCount = key + 1;


            if (key != 0) {
              obj.previousSec = this.sectionsList[key - 1].section;
              obj.previousSecLink = this.sectionsList[key - 1].routerLink;
            }

            if (key != this.sectionsList.length - 1) {
              obj.nextSec = this.sectionsList[key + 1].section;
              obj.nextSecLink = this.sectionsList[key + 1].routerLink;
            }
            sectionObject = obj;
          }
        })

      }
      // console.log('outer shared.service sectionObject:' + JSON.stringify(sectionObject));
      return sectionObject;

    }
    catch (e) {
      alert("exception in getSectionObject function" + e.message);
    }
  }

  /*This function returns the list of specific section objects 
  */
  getQuestion(section) {
    let questionObject;
    if (this.questionsList.length > 0) {
      this.questionsList.forEach((obj, key) => {
        if (obj.section + "" == section + "") {
          questionObject = obj;
        }
      })

    }

    return questionObject;
  }

  // This function returns entire endUrlObj based on section name.
  getUrlObject(section) {
    let urlObj;
    if (this.endUrlObj.length > 0) {
      this.endUrlObj.forEach((obj, key) => {

        if (obj.section + "" == section + "") {
          urlObj = obj;
        }

      })
      // alert("urlObj-->"+urlObj.endUrl);
    }
    return urlObj;
  }

  //This function is used to show the no data information in the tables
  getTableNoData(section) {
    let noData;
    if (this.noDataList.length > 0) {
      this.noDataList.forEach((objF, key) => {
        objF.section.forEach((obj, key) => {
          if (obj + "" == section + "") {
            noData = objF.text;
          }
        })
      })

    }

    return noData;
  }

  //the below function is to display the success data success message
  getSuccessMessage(section) {
    let message;
    if (this.successMessageList.length > 0) {
      this.successMessageList.forEach((objF, key) => {
        objF.section.forEach((obj, key) => {
          if (obj + "" == section + "") {
            message = objF;
          }
        })
      })

    }
    return message;
  }





  isJsonChanged(previous, latest) {
    //console.log("pre=>"+JSON.stringify(previous));
    // console.log("lat=>"+JSON.stringify(latest));
    if (JSON.stringify(previous) === JSON.stringify(latest)) {
      return false;
    } else {
      return true;
    }
  }
}



