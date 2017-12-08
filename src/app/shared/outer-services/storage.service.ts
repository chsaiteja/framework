
import { Injectable } from '@angular/core';
import { Router, Routes } from '@angular/router';

/* dialog is reference of loading model template.*/

@Injectable()
export class StorageService {

    /** This function is for logging out of the modules. */
    constructor(private router: Router) {
    }


    sessionStorageRemove(pKey) {
        try {
            if (this.sessionStorageSupported()) {
                try {
                    window.sessionStorage.removeItem(pKey);
                    return true;
                }
                catch (e) {
                    return this.docCookiesRemoveItem('sessionstorage.' + pKey, '', '');
                }

            } else {
                return this.docCookiesRemoveItem('sessionstorage.' + pKey, '', '');
            }
        }
        catch (e) {
            return true;
            //alert("sessionStorageGet exception:"+e.message);
        }
        //return true;
    }

    // localStorageGet(pKey) {
    //     // alert("localStorageGet key:"+pKey);
    //     try {
    //         if (this.localStorageSupported()) {
    //             try {
    //                 return window.localStorage.getItem(pKey);
    //             }
    //             catch (e) {
    //                 return this.docCookiesGetItem('localstorage.' + pKey);
    //             }
    //         } else {
    //             return this.docCookiesGetItem('localstorage.' + pKey);
    //         }
    //     }
    //     catch (e) {
    //         //alert("localStorageGet exception:"+e.message);
    //     }
    // }



    // localStorageSet(pKey, pValue) {
    //     //alert("localStorageSet key:"+pKey+" pValue:"+pValue);
    //     try {
    //         if (this.localStorageSupported()) {
    //             try {
    //                 window.localStorage.setItem(pKey, pValue);
    //             }
    //             catch (e) {
    //                 this.docCookiesSetItem('localstorage.' + pKey, pValue, "", "", "", "");
    //             }
    //         } else {
    //             this.docCookiesSetItem('localstorage.' + pKey, pValue, "", "", "", "");
    //         }
    //     }
    //     catch (e) {

    //         //  alert("localStorageSet exception:"+e.message);
    //     }
    // }

    // localStorageSupported() {
    //     // global to cache value
    //     //var gStorageSupported = undefined;
    //     let testKey = 'test', storage = window.localStorage;
    //     if (this.gStorageSupported === undefined) {
    //         try {
    //             storage.setItem("testKey", "1");

    //             this.gStorageSupported = true;
    //         } catch (error) {
    //             //alert("localstorage exception is:"+error.message);
    //             this.gStorageSupported = false;
    //         }
    //     }
    //     // alert("Localstorage support is:"+gStorageSupported);
    //     return this.gStorageSupported;
    // }

    sessionStorageSet(pKey, pValue) {
        //alert("localStorageSet key:"+pKey+" pValue:"+pValue);
        try {

            if (this.sessionStorageSupported()) {
                try {
                    window.sessionStorage.setItem(pKey, pValue);
                }
                catch (e) {
                    this.docCookiesSetItem('sessionstorage.' + pKey, pValue, "", "", "", "");
                }
            } else {
                this.docCookiesSetItem('sessionstorage.' + pKey, pValue, '', '', '', '');
            }
        }
        catch (e) {

            //alert("sessionStorageSet exception:"+e.message);
        }
    }

    // localStorageRemove(pKey) {
    //     try {
    //         if (this.localStorageSupported()) {
    //             try {
    //                 window.localStorage.removeItem(pKey);
    //             }
    //             catch (e) {
    //                 this.docCookiesRemoveItem('localstorage.' + pKey, '', '');
    //             }
    //         } else {
    //             this.docCookiesRemoveItem('localstorage.' + pKey, '', '');
    //         }
    //     }
    //     catch (e) {     //  alert("localStorageSet exception:"+e.message);

    //     }
    // }
    eraseCookieFromAllPaths(name) {
        // This function will attempt to remove a cookie from all paths.
        let pathBits = location.pathname.split('/');
        let pathCurrent = ' path=';

        // do a simple pathless delete first.
        document.cookie = name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;';

        for (let i = 0; i < pathBits.length; i++) {
            pathCurrent += ((pathCurrent.substr(-1) !== '/') ? '/' : '') + pathBits[i];
            document.cookie = name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;' + pathCurrent + ';';
        }
    }
    sessionStorageGet(pKey) {
        //alert("sessionStorageGet key:"+pKey);
        try {
            if (this.sessionStorageSupported()) {
                try {
                    return window.sessionStorage.getItem(pKey);
                }
                catch (e) {
                    return this.docCookiesGetItem('sessionstorage.' + pKey);
                }
            } else {
                return this.docCookiesGetItem('sessionstorage.' + pKey);
            }
        }
        catch (e) {
            //alert("sessionStorageGet exception:"+e.message);
        }
    }

    docCookiesGetItem(sKey) {
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    }
    docCookiesSetItem(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
        let sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
            }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true;
    }
    docCookiesRemoveItem(sKey, sPath, sDomain) {
        if (!sKey || !this.docCookiesHasItem(sKey)) { return false; }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true;
    }
    docCookiesHasItem(sKey) {
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    }
    /* optional method: you can safely remove it! */
    docCookiesKeys() {
        let aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (let nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
        return aKeys;
    }

    gStorageSupported = undefined;
    sessionStorageSupported() {
        // global to cache value

        let testKey = 'test', storage = window.sessionStorage;
        if (this.gStorageSupported === undefined) {
            try {
                storage.setItem('testKey', '1');


                this.gStorageSupported = true;
            } catch (error) {
                //alert("localstorage exception is:"+error.message);
                this.gStorageSupported = false;
            }
        }
        // alert("Localstorage support is:"+gStorageSupported);
        return this.gStorageSupported;
    }
    mainLogOut() {
        this.exitApp('loggedout');
    }

    exitApp(option) {
        try {
            window.sessionStorage.clear();
            // window.localStorage.clear();
            this.eraseCookieFromAllPaths("LTILogin2");
            let logoutURL = this.sessionStorageGet("LogoutURL");
            // let tmpRt: Routes;
            //tmpRt = (loginRoutes);//[{ path: '', redirectTo: 'login', pathMatch: 'full' }, loginRoute, { path: '**', redirectTo: 'login', pathMatch: 'full' }]
            // this.router.resetConfig(loginRoutes);
            //alert("inside exitapp" + logoutURL);
            if (logoutURL !== "" && logoutURL !== null && logoutURL !== undefined) {
                this.router.navigateByUrl(logoutURL);
            } else {
                window.location.href = 'login/newlogin';
            }
        }
        catch (e) {
            alert('exitApp exception:' + e.message);
        }
    }

}



