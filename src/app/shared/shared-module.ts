
/** Angular imports */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomDate, pagesFilter } from './pipes/customPipes';
import { HttpModule } from '@angular/http';
@NgModule({
  imports: [CommonModule],
  declarations: [CustomDate, pagesFilter],
  exports: [CustomDate, pagesFilter,
    CommonModule, FormsModule, HttpModule]
})
export class SharedModule { }