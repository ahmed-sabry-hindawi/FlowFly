import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SiteSettingsService } from 'src/app/Services/siteSettings.Service';
import { ActionResult } from 'src/app/models/ActionResult.model';

@Component({
  selector: 'app-site-settings',
  templateUrl: './site-settings.component.html',
  styleUrls: ['./site-settings.component.css']
})
export class SiteSettingsComponent implements OnInit{

  isDataLoaded: boolean=true;
  errorMessage: string = '';
  successMessage: string = '';
  mainTitle: string = '';
  subTitle: string = '';
  emailExtension:string='';
  SystemLogoDirectory:string='';
  AllowedEmailExtension='';
  PortalIconDirectory='';


  constructor(private settingService:SiteSettingsService)
  {

  }

  ngOnInit(): void {

    this.settingService.getSettingByKey('SiteMainTitle').subscribe(res => {
      this.mainTitle= res.data.settingValue;
    });

    this.settingService.getSettingByKey('SiteSubTitle').subscribe(res => {
      this.subTitle= res.data.settingValue;
    });

    this.settingService.getSettingByKey('AllowedUsersEmailDomain').subscribe(res => {
      this.emailExtension= res.data.settingValue;
    });

    this.settingService.getSettingByKey('IconDirectory').subscribe(res => {
      this.SystemLogoDirectory= res.data.settingValue;
    });
  }



}
