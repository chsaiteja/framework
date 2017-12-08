
import { Component } from '@angular/core';
import { StorageService } from './shared/outer-services/storage.service';
import { routeConstants } from './shared/constants/app.constants';
import { Router } from '@angular/router';

import { getRouteConfig } from './route.config';
import { StoreSharedService } from '../app/shared/outer-services/store-shared.service'
@Component({
  selector: 'PLP-app',
  template: `
  <ngbd-modal-snackbar></ngbd-modal-snackbar>
  <template ngbModalContainer ></template>
  <ngbd-modal-loader></ngbd-modal-loader>
  <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  constructor(private router: Router, private storageService: StorageService, private pugser: StoreSharedService) {
    setTimeout(function () {
      this.setFavicon(window.location.origin + "/assets/images/cis-icon.ico");
    }.bind(this), 500);
    try {

      /** Route configuration creation based on framework JSON loaded on last Login  */
      let frameConfig = this.storageService.sessionStorageGet('loginFrameworkConfiguration');
      if (frameConfig !== undefined && frameConfig !== null && frameConfig !== '') {
        const newtemproute = getRouteConfig(JSON.parse(frameConfig)['config']);
        this.router.resetConfig(newtemproute);
      }

      /** LTI Login related functionality */
      let LTILogin = this.storageService.docCookiesGetItem("LTILogin2");
      if (LTILogin + "" !== "undefined" && LTILogin + '' !== 'null') {
        let LTIjson = JSON.parse(LTILogin);
        let accId = LTIjson.acctId;
        let authkey = LTIjson.auth_key;
        let module = LTIjson.module;
        let Logouturl = LTIjson.Logouturl;
        this.storageService.sessionStorageSet("LogoutURL", Logouturl);
        this.storageService.eraseCookieFromAllPaths("LTILogin2");
        this.storageService.sessionStorageRemove("module");
        let modArr = this.storageService.sessionStorageGet("module");
        if (modArr + "" == "undefined" || modArr + "" == "null") {
          let tmp = { "moduleslist": [module] };
          this.storageService.sessionStorageSet("module", JSON.stringify(tmp));
        }
        else {
          let tmp1 = JSON.parse(modArr);
          tmp1.moduleslist.push(module);
          tmp1.moduleslist = tmp1.moduleslist.filter(function (item, pos) {
            return tmp1.moduleslist.indexOf(item) == pos;
          });
          //[new Set(tmp1.moduleslist)];//$.unique(tmp1.moduleslist);

          this.storageService.sessionStorageSet("module", JSON.stringify(tmp1));
        }
        this.storageService.sessionStorageSet("accountID", accId);
        this.storageService.sessionStorageSet("auth_key", authkey);
        let rtArr = [];
        routeConstants.forEach(function (val, inx) {
          if (module == val.module.toLowerCase())
            rtArr.push(val);
        })
        console.log("rtArr is:" + JSON.stringify(rtArr) + "  module:" + module);
        if (rtArr.length >= 0)
          this.pugser.pugLogin(JSON.parse(LTILogin));

      }
      else if (this.storageService.sessionStorageGet("auth_key") + "" == "null" || this.storageService.sessionStorageGet("auth_key") + "" == "undefined") {
        window.location.href = 'login/newlogin';

      }

    } catch (e) {
      console.log("app component exception:" + e.message);
    }


  }

  // public toasterconfig: ToasterConfig =
  // new ToasterConfig({
  //   limit: 1,
  //   showCloseButton: true,
  //   tapToDismiss: false,
  //   timeout: 5000,
  //   positionClass: "toast-bottom-right"
  // });
  // Chrome allows you to simply tweak the HREF of the LINK tag.
  // Firefox appears to require that you remove it and readd it.
  setFavicon(url) {
    this.removeFavicon();
    var link = document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'icon';
    link.href = url;
    document.getElementsByTagName('head')[0].appendChild(link);
    // if (window.console) console.log("Set FavIcon URL to " + this.getFavicon().href);
  }

  getFavicon() {
    var links = document.getElementsByTagName('link');
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute('rel') === 'icon') {
        return links[i];
      }
    }
    return undefined;
  }
  removeFavicon() {
    var links = document.getElementsByTagName('link');
    var head = document.getElementsByTagName('head')[0];
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute('rel') === 'icon') {
        head.removeChild(links[i])
      }
    }
  }
}
