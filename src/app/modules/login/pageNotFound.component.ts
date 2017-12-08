import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';


@Component({
    selector: 'page-not-found',
    template: '<div>{{message}}</div>',
})
export class PageNotFoundComponent implements OnInit {
    message = "Loading...";

    constructor(private router: Router, ) {

    }

    ngOnInit() {
        /*let sessId = this.shared.getAuthKey();

        //alert("pagenotfound screen :" + sessId);
        if (sessId == null) {
            try {
                this.message = "Redirecting to login...";
                this.router.navigateByUrl('/login');
                // this.router.navigateByUrl("./plpcontent");
            }
            catch (e) {
                //alert("exception:"+e.message);
            }
        }
        else {
            this.router.navigateByUrl('/login');
        }
        */

    }


}

