
export class GraduationRequirementsModel {
    ReqItemsClass = {
        Subject: String,
        Credit1: String,
        Credit2: String,
        Credit3: String,
    }
    Titles = {
        CustomTitle1: String,
        ReqColTitle1: String,
        CustomTitle2: String,
        ReqColTitle2: String,
        CustomTitle3: String,
        ReqColTitle3: String,
    };
    ReqItems = [this.ReqItemsClass];
    Totals = TotalsClass;
}
class TitlesClass {

    constructor() {

    }

}

var TotalsClass = {

    Credit1: "",
    Credit2: "",
    Credit3: "",
    Note: ""

}