import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'customText' })
export class TextIteratorPipe implements PipeTransform {
  transform(text: string): string {
    // alert("text---> " + text);
    if (text.indexOf('http') >= 0) {

      text = this.constructText(text);

    }



    return text;
  }

  constructText(hreftext) {
    let textaray = [];
    let finalString = "";
    //het hyper text
    try {
      let hypertxt1 = [] = hreftext.split("[");


      let hypertxt2 = [] = hypertxt1[1].split("]");
      let text1 = hypertxt1[0] + hypertxt2[1]
      //alert("text 1--->" + text1);





      textaray = text1.split("(");

      // alert("o-th --->" + textaray[0] + "  1-st---->" + textaray[1]);
      let sendarry = [] = textaray[1].split(")");
      // alert("href---->" + sendarry[0]);

      finalString = textaray[0] + " <a class='anchorclass' target='_blank' href='" + sendarry[0] + "'><u>" + hypertxt2[0] + "</u></a>" + sendarry[1];

    }
    catch (e) {
      console.log("text custom pipe exception---->" + e.message);
    }
    return finalString;

  }





}