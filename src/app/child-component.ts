import { Component,Input } from '@angular/core';

@Component({
  template: `<div>
  <p>Student name : {{name}}</p>
  <p>Student Fee : {{fee}}</p>
    </div>`,
})
export class ChildComponent {
  @Input() name;
  @Input() fee;
  
  
}
