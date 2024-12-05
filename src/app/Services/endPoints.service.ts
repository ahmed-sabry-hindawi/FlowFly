import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { AuthService } from "./auth.Service";
import { Observable, Subject, throwError } from "rxjs";
import { ActionResult } from "../models/ActionResult.model";
import { EndPointInfo } from "../models/EndPointInfo.model";
import { catchError, tap } from "rxjs/operators";
import { Router } from "@angular/router";



@Injectable()
export class EndPointsService {

    token: string = '';
    allEndPoints: EndPointInfo[] = [];
    EndPointsChanged = new Subject<EndPointInfo[]>();
    resultReturned = new Subject<ActionResult>();   

    constructor(
        private http: HttpClient,      
        private router: Router,
        private authService: AuthService) {

    }


    GetAllEndPoints(): Observable<ActionResult> {

        let allEndPoints: EndPointInfo[] = [];
        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {



            return this.http.get<ActionResult>('api/EndPoints/GetAllEndPoints',
                {
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
                })
        }
        return null as any;

    }



    GetAllEndPointTypes(): Observable<ActionResult> {
        
        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {



            return this.http.get<ActionResult>('api/EndPoints/GetAllEndPointTypes',
                {
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
                })
        }
        return null as any;

    }



    ChangeEndPointStatus(EndPoint: EndPointInfo) {


        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {
            return this.http.post<ActionResult>('api/EndPoints/ChangeEndPointStatus', JSON.stringify(EndPoint),
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
                            this.EndPointsChanged.next();
                            return resultData;

                        }
                    )
                );
        }
        return null as any;
    }






    AddEndPoint(EndPoint: EndPointInfo) {


        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {
            return this.http.post<ActionResult>('api/EndPoints/AddEndPoint', JSON.stringify(EndPoint),
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
                            this.EndPointsChanged.next();
                            return resultData;

                        }
                    )
                );
        }
        return null as any;
    }

    UpdateEndPoint(EndPoint: EndPointInfo) {


        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {
            return this.http.post<ActionResult>('api/EndPoints/UpdateEndPoint', JSON.stringify(EndPoint),
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
                            this.EndPointsChanged.next();
                            return resultData;

                        }
                    )
                );
        }
        return null as any;
    }

 
 
    private HandleError(resultError: HttpErrorResponse) {

        if (!resultError.error.resultMessage) return throwError('unknown error ');


        return throwError(resultError.error);
    }




}