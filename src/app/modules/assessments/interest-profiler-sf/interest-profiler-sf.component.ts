/**Angular imports */
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

@Component({
	selector: 'interest-profiler-sh',
	template: `<assessment-header></assessment-header>`,
})
export class InterestProfilerShComponent implements OnInit {
	asmnt_object;
	constructor(private router: Router) {
		document.title = 'Interest Profiler';
	}

	ngOnInit() {
		this.asmnt_object = {
			'title': 'Interest Profiler',
			'btn_class': 'menu-not-filled'
		}
	}
}
