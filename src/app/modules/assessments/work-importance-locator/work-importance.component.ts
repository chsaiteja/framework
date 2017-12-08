/** Angualr2 Libaries **/
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'wil-start-component',
	template: `
				<assessment-header></assessment-header>`,
})
export class WILStartComponent implements OnInit {
	asmnt_object;
	constructor() {
	}

	ngOnInit() {

	}
}
