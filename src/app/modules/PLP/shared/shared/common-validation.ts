import { FormControl } from '@angular/forms';
export class CustomValidations {
    static cannotContainSpace(control: FormControl) {
        if (control.value != null && control.value == "")
            return {
                "cannotContainSpace": true
            };
        return null;
    }
    static maxlengthCheck(control: FormControl) {
        if (control.value != null && control.value.length > 7500)
            return {
                "maxlengthCheck": true
            };
        return null;
    }

    static maxlengthCheckForComment(control: FormControl) {
        if (control.value != null && control.value.length > 500)
            return {
                "maxlengthCheckForComment": true
            };
        return null;
    }

    static maxlengthCheckForTest(control: FormControl) {
        if (control.value != null && control.value.length > 100)
            return {
                "maxlengthCheckForTest": true
            };
        return null;
    }
    static mailFormat(control: FormControl) {
        var EMAIL_REGEXP = /^(([^<>()[\]\\.,%;:\s@\"]+(\.[^<>()[\]\\.,%;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm;

        if (control.value + "" != "null" && control.value != "" && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
            return { "incorrectMailFormat": true };
        }

        return null;
    }

    static containOnlyNumerals(control: FormControl) {
        var Numerals_REGEXP = /^\d{4}$/;
        if (control.value != null && control.value) {
            if (!Numerals_REGEXP.test(control.value)) {
                //  alert("true");   
                return {
                    "onlyNumerals": true
                };
            }
            return null;
        }
    }

    static containOnlyNumbers(control: FormControl) {
        var Numbers_REGEXP = /^[0-9]{1,3}$$/;
        if (control.value != null && control.value) {
            if (!Numbers_REGEXP.test(control.value)) {
                //  alert("true");   
                return {
                    "onlyNumbers": true
                };
            }
            return null;
        }
    }

    static nameValid(control: FormControl) {
        var NAME_REGEXP = /^[a-zA-Z'-\s]*$/;
        if (control.value != null && control.value) {
            if (!NAME_REGEXP.test(control.value)) {
                return {
                    'invalidChar': true
                };
            }
            return null;
        }


    }

    static noScript(control: FormControl) {
        //var No_SCRIPT = /^[a-z0-9A-Z/'!;:@.,*\s+]*$/i;
        if (control.value != null && control.value) {
            //alert("coming in if--->"+control.value);
            if (control.value.match(/[`~^\[\]\|{}=]/)) {
                //  alert("coming"); 
                return { 'invalidText': true };
            }
            return null;
        }

    }

    static passwordStrength(control: FormControl) {
        var strongRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\S+$).{8,}$/;
        if (control.value != null && control.value) {
            //alert("coming in if--->"+control.value);
            if (!strongRegex.test(control.value)) {
                // alert("coming"); 
                return { 'invalidPassword': true };
            }
            return null;
        }
    }
}

// interface  ValidationResult {
//      [key: string]: boolean;
// }