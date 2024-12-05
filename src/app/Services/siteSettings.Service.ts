import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { AuthService } from "./auth.Service";
import { ServiceInfo } from "../models/ServiceInfo.model";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { ActionResult } from "../models/ActionResult.model";
import { Router } from "@angular/router";
import { SiteSettingInfo } from "../models/SiteSettingInfo.model";
import { ChangeSiteSettingValueDTO } from "../models/ChangeSiteSettingValueDTO.model";

@Injectable()
export class SiteSettingsService {

    token: string = '';
 
    SettingsChanged = new Subject<SiteSettingInfo[]>();
   
        
    constructor(
        private http: HttpClient, 
        private router: Router,
         private authService: AuthService) {
  
    }



    getSettingByKey(key: string): Observable<ActionResult> {

        
        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {

            return this.http.get<ActionResult>('api/SiteSettings/GetBySettingKey/' + key,
                {
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
                })

        }
        return null as any;
    }



    ChangeSettingValue(newsettings: ChangeSiteSettingValueDTO) {

        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {
            return this.http.post<ActionResult>('api/SiteSettings/ChangeSettingValue', JSON.stringify(newsettings),
                {
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token },

                })
                .pipe(
                    catchError(resultError => {
                        {
                            //resultError;
                            if (resultError.status == "401") {
                                this.router.navigate(['/login']);
                            }
                            return this.HandleError(resultError);
                        }
                    }
                    ),
                    tap(
                        resultData => {
                            this.SettingsChanged.next();
                            return resultData;

                        }
                    )
                );
        }
        return null as any;
    }


    GetAllSiteSettings(): Observable<ActionResult> {

        
        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {



            return this.http.get<ActionResult>('api/SiteSettings/GetAllSiteSettings',
                {
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
                })
        }
        return null as any;


    }

    private HandleError(resultError: HttpErrorResponse) {

        if (!resultError.error.resultMessage) return throwError('unknown error ');


        return throwError(resultError.error);
    }

   

}