/**import angular core packages */
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'lss-start-component',
	template: `<assessment-header ></assessment-header>`,
})

export class LssStartComponent implements OnInit {
	asmnt_object;
	constructor() {
	}

	ngOnInit() {

	}

}