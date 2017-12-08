import { Component } from '@angular/core';

@Component({
  selector: 'static-header',
  template: `<nav class="navbar w-100 header-bg-plp-2 navbar-fixed-top" style=" margin-bottom: 0px; position: fixed; height: 70px; z-index:9;">
              <div class="container">
                <div class="navbar-header">
                 
                  <a class="navbar-brand-plp-2 navbar-brand" ><img class="logo-image-plp-2" src="/assets/images/logo-plp-2.jpg" /></a> </div>
              </div>
            </nav>`,

})
export class StaticHeaderComponent {
  constructor() { }
}