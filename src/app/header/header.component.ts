import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.Service';
import { Observable, Subscription } from 'rxjs';
import { ResolveEnd, Router } from '@angular/router';
import { User } from '../accounts/auth/user.model';
import { SiteSettingsService } from '../Services/siteSettings.Service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  subscription!: Subscription;

  isAuthenticatedPage: boolean = false;
  employeeName: string = '';
  showIcons!: boolean;


  mainTitle: string = '';
  subTitle: string = '';
  emailExtension:string='';
  SystemLogoDirectory:string='';








  constructor(private authService: AuthService,private settingService:SiteSettingsService, private router: Router) {

    let token = this.authService.getToken();
    if (token != '') {
      this.employeeName = this.authService.getUserFullname();    

    }

    this.settingService.getSettingByKey('SiteMainTitle').subscribe(res => {
      this.mainTitle= res.data.settingValue;
    });

    this.settingService.getSettingByKey('SiteSubTitle').subscribe(res => {
      this.subTitle= res.data.settingValue;
    });

  

    this.settingService.getSettingByKey('IconDirectory').subscribe(res => {
      this.SystemLogoDirectory= res.data.settingValue;
    });
  }




  ngOnInit(): void {

    this.subscription = this.router.events.subscribe((routerData) => {
      if (routerData instanceof ResolveEnd) {
        this.showIcons = false;
        this.isAuthenticatedPage = routerData.url.indexOf('login') >= 0 || routerData.url.indexOf('registration') >= 0;

        if (this.isAuthenticatedPage) {
          this.showIcons = true;

        }
        else {

          this.showIcons = false;
        }

      }
    });


  


  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  redirectToHome() {

    this.router.navigate(['/home/my-services']);
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  format(num: number) {
    return (num + '').length === 1 ? '0' + num : num + '';
  }

}
