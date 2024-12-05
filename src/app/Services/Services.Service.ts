import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { AuthService } from "./auth.Service";
import { ServiceInfo } from "../models/ServiceInfo.model";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { ActionResult } from "../models/ActionResult.model";
import { ServiceCategoryInfo } from "../models/ServiceCategoryInfo.model";
import { Router } from "@angular/router";
import { ServiceRequestsCountInfo } from "../models/ServiceRequestsCountInfo.model";

@Injectable()
export class ServiceService {

    token: string = '';
    myServices: ServiceCategoryInfo[] = [];
    ServicesChanged = new Subject<ServiceCategoryInfo[]>();
    selectedService: ServiceInfo = new ServiceInfo();
        
    constructor(
        private http: HttpClient, 
        private router: Router,
         private authService: AuthService) {
  
    }


    GetAllServices(): Observable<ActionResult> {

        let myServices: ServiceCategoryInfo[] = [];
        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }
        else{
            this.router.navigate(['/login']);
        }

        if (this.token != null) {

            return this.http.get<ActionResult>('api/Services/GetServices',
                {
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
                }).pipe(
                    catchError(resultError => {
                        {
                            if(resultError.status=="401")
                            {
                               this.router.navigate(['/login']);
                            }
                             //resultError;
                            return this.HandleError(resultError);
                        }
                    }    
                    ),
                    tap(
                        resultData => {
                            
                            return resultData;
                           
                        }
                    )
                );     
        }
        return null as any;
    }




    GetUserServices(): Observable<ActionResult> {

        let myServices: ServiceCategoryInfo[] = [];
        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }
        else{
            this.router.navigate(['/login']);
        }

        if (this.token != null) {

            return this.http.get<ActionResult>('api/Services/GetUserServices',
                {
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
                }).pipe(
                    catchError(resultError => {
                        {
                            if(resultError.status=="401")
                            {
                               this.router.navigate(['/login']);
                            }
                             //resultError;
                            return this.HandleError(resultError);
                        }
                    }    
                    ),
                    tap(
                        resultData => {
                            
                            return resultData;
                           
                        }
                    )
                );     
        }
        return null as any;
    }





    
    GetAllStageDependentServices(): Observable<ActionResult> {

        
        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }
        else{
            this.router.navigate(['/login']);
        }

        if (this.token != null) {

            return this.http.get<ActionResult>('api/Services/GetAllStageDependentServices',
                {
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
                }).pipe(
                    catchError(resultError => {
                        {
                            if(resultError.status=="401")
                            {
                               this.router.navigate(['/login']);
                            }
                             //resultError;
                            return this.HandleError(resultError);
                        }
                    }    
                    ),
                    tap(
                        resultData => {
                            
                            return resultData;
                           
                        }
                    )
                );     
        }
        return null as any;


    }

    getSelectedServiceByID(id: number): Observable<ActionResult> {

        let myServices: ServiceInfo[] = [];
        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {



            return this.http.get<ActionResult>('api/Services/GetServiceByID/' + id,
                {
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
                })

        }
        return null as any;
    }



    ChangeServiceStatus(service: ServiceInfo) {

        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {
            return this.http.post<ActionResult>('api/Services/ChangeServiceStatus', JSON.stringify(service),
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
                            this.ServicesChanged.next();
                            return resultData;

                        }
                    )
                );
        }
        return null as any;
    }



    AddServiceCategory(serviceCategory: ServiceCategoryInfo) {


        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {
            return this.http.post<ActionResult>('api/Services/AddServiceCategory', JSON.stringify(serviceCategory),
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
                            this.ServicesChanged.next();
                            return resultData;

                        }
                    )
                );
        }
        return null as any;
    }

    UpdateServiceCategory(serviceCategory: ServiceCategoryInfo) {



        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {
            return this.http.post<ActionResult>('api/Services/UpdateServiceCategory', JSON.stringify(serviceCategory),
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
                            this.ServicesChanged.next();
                            return resultData;

                        }
                    )
                );
        }
        return null as any;
    }



    AddService(service: ServiceInfo) {



        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {
            return this.http.post<ActionResult>('api/Services/AddService', JSON.stringify(service),
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
                            this.ServicesChanged.next();
                            return resultData;

                        }
                    )
                );
        }
        return null as any;
    }



    UpdateService(service: ServiceInfo) {


        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {
            return this.http.post<ActionResult>('api/Services/UpdateService', JSON.stringify(service),
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
                            this.ServicesChanged.next();
                            return resultData;

                        }
                    )
                );
        }
        return null as any;
    }


    GetServicesRequestsCount(): Observable<ActionResult> {

        
        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {

            return this.http.get<ActionResult>('api/Services/RequestsCountByServices/1',
                {
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
                })
        }
        return null as any;


    }


    getServiceReport(id: number): Observable<ActionResult> {

       
        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {



            return this.http.get<ActionResult>('api/Services/GetServiceRequestReport/' + id,
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