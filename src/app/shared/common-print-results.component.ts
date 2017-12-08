/** Angular imports */
import { Component, Input, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { EventDispatchService } from './outer-services/event-dispatch.service';
import { Subscription } from "rxjs/Subscription";
// import '../../assets/scss/modules/modules-common.scss';
// import '../../assets/scss/modules/assessment-results.scss';

// import '../../assets/scss/custom-variables.scss';

@Component({
    selector: 'common-print-layout',
    template: '<div id="printpage"></div>',
    //    styles: [require('../../styles.scss').toString()]
    //    styleUrls:['../../sass/styles.scss']
})
export class PrintResultComponent implements OnInit, OnDestroy {
    //  @Input()
    printconent: string;
    subscription = new Subscription;
    constructor(private eventService: EventDispatchService) {
        this.subscription = eventService.listen().subscribe((e) => {

            if (e.type == 'PrintFuncionCalled') {
                this.printingData();
            }
        });

    }
    ngOnInit() {


        //  if (this.printconent && this.printconent != undefined && this.printconent != '') {

        //}
    }
    /*ngOnDestroy method is used for unsubscribe the event */
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    // fetchStylesheets() {
    //     var output: string = '';
    //     for (var i = 0; i < document.styleSheets.length; i++) {
    //         output = output + ' <link rel="stylesheet" type="text/css" href="' +
    //             window.document.styleSheets[i].href + '" /> ';
    //         console.log("style sheet-->" + output);
    //     }
    //     return output;
    // }

    printingData() {


        this.printconent = document.getElementById("eq-result-print").innerHTML;
        if (window) {
            if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
                var popup = window.open('', '_blank',
                    'width=600,scrollbars=yes,menubar=no,toolbar=no,'
                    + 'location=no,status=no,titlebar=no');

                popup.window.focus();
                popup.document.write('<html><head>  ' +
                    '<link type="text/css" rel="stylesheet" href="node_modules/bootstrap/scss/bootstrap.min.css" media="screen,print"/>' +
                    ' <style lang="scss" >@import "../../styles.scss" </style>' +

                    + '</head><body onload="window.print()"><div class="reward-body">'
                    + this.printconent + '</div></html>');
                popup.onbeforeunload = function (event) {
                    popup.close();
                    return '.\n';
                };
                popup.onabort = function (event) {
                    popup.document.close();
                    popup.close();
                }
            } else {
                var popup = window.open('', '_blank', 'width=800,menubar=no,toolbar=no,'
                    + 'location=no,status=no,titlebar=no');
                popup.document.open();
                popup.document.write('<html><head>' +
                    '<link type="text/css" rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css" media="all"/>' +
                    ' <style lang="scss" >@import "../../styles.scss" </style>' +
                    + '</head><body onload="window.print()">' + this.printconent + '</html>');
                popup.document.close();
            }

            popup.document.close();
        }
        // console.log("printconent---->" + this.printconent);


    }

}