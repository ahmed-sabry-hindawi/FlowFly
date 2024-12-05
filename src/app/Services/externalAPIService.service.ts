import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { AuthService } from "./auth.Service";
import { Observable, Subject, throwError } from "rxjs";
import { ActionResult } from "../models/ActionResult.model";
import { Router } from "@angular/router";

@Injectable()
export class ExternalAPIService {

    token: string = '';
 
  
   
        
    constructor(
        private http: HttpClient, 
        private router: Router,
         private authService: AuthService) {
  
    }



    async getValueFromExternalService(api: string): Promise<Observable<ActionResult>> {

        
        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {

            this.http.head
            return await this.http.get<ActionResult>(api,
                {
                    
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
                })

        }
        return null as any;
    }


    async getListFromExternalService(api: string): Promise<Observable<ActionResult>> {

        
        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {

            this.http.head
            return await this.http.get<ActionResult>(api,
                {
                    
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
                })

        }
        return null as any;
    }


}