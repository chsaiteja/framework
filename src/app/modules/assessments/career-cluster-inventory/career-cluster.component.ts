import { Component, OnInit, HostListener } from '@angular/core';

@Component({
	selector: 'cci-jr',
	template: `
				<assessment-header ></assessment-header>`,
})

export class CCIJrComponent implements OnInit {
	asmnt_object;
	constructor() {
		document.title = 'CCI Jr';
	}

	ngOnInit() {
		this.asmnt_object = {
			'title': 'CCI Jr',
			'btn_class': 'green-btn-plp2'
		}
	}
	
}
