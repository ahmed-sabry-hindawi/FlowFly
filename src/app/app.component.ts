import { Component, OnDestroy, OnInit } from '@angular/core';
import { ResolveEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  isAuthenticationPage: boolean = false;
  title = 'FlowFly';
  activateNarrowNavBar: boolean = false;
  activateWideNavBar: boolean = false;
  NoNavBar: boolean = true;
  subscription!: Subscription;
  thisYear = (new Date()).getFullYear();
  constructor(private router: Router) {

  }

  ngOnInit() {

    this.subscription = this.router.events.subscribe((routerData) => {
      if (routerData instanceof ResolveEnd) {
        this.isAuthenticationPage = routerData.url.indexOf('login') >= 0 || routerData.url.indexOf('registration') >= 0;

        if (window.innerWidth < 820) {
          this.activateNarrowNavBar = false;
          this.activateWideNavBar = false;
          this.NoNavBar = true;
        }
        else if (this.isAuthenticationPage) {
          this.activateNarrowNavBar = false;
          this.activateWideNavBar = false;
          this.NoNavBar = true;
        }
        // else if (routerData.url.indexOf('services-report') > 0) {
        //   this.activateNarrowNavBar = true;
        //   this.activateWideNavBar = false;
        //   this.NoNavBar = false;
        // }
        else {
          this.activateWideNavBar = true;
          this.activateNarrowNavBar = false;
          this.NoNavBar = false;
        }


      }
    })
  }



  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
