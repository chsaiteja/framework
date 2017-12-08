import { Component, Input } from '@angular/core';
@Component({
  selector: 'static-occ-footer',
  template: `<footer id="fhid" class="common-footer w-100">
              <section class="copyright">
                <div class="container w-100">
                  <div class="row">
                    <div class="col-sm-12 text-center">
                  <div class="footer-text-desktop">
                   <p class="desktop-design-display">© 1971-2016 University of Oregon. All rights reserved. Created by intoCareers, a unit of the University of Oregon.</p>
                   </div>     
                  <div class="mobile-design-display">
                  <p>
                   <span>© 1971-2016 University of Oregon. All rights reserved.</span>                           
                             <span class="tooltip-footer">
                     <span class="footer-mobile-text" >Read more...</span>
                      <span class="tooltiptext"> © 1971-2016 University of Oregon. All rights reserved. Created by intoCareers, a unit of the University of Oregon.
                      </span>
                   </span>
                   </p>
                 </div>
                  </div> 
                </div>
                </div>
              </section>
              <section class="footer-bottom"> </section>
            </footer>`,

})
export class StaticOccFooterComponent {


  constructor() {

  }
  ngOnInit() {

  }

}
