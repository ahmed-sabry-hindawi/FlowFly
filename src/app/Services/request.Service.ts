import { Inject, Injectable } from "@angular/core";
import { Observable, Subject, throwError } from "rxjs";
import { ActionResult } from "../models/ActionResult.model";
import { AuthService } from "./auth.Service";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { FFRequestInfo } from "../models/FFRequestInfo.model";
import { UserInfo } from "../models/UserInfo.model";
import { SearchRequestsDTO } from "../models/SearchRequestsDTO.model";
import { Router } from "@angular/router";

@Injectable()
export class RequestsService {

    token: string = '';
    RequestsChanged = new Subject<FFRequestInfo[]>();
    selectedRequest: FFRequestInfo = new FFRequestInfo();
    resultReturned = new Subject<ActionResult>();

    constructor(private http: HttpClient, private authService: AuthService, private router: Router) {

    }


    AddRequest(serviceRequest: FFRequestInfo) {

        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {
            return this.http.post<ActionResult>('api/Requests/AddRequest', JSON.stringify(serviceRequest),
                {
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token },

                })
                .pipe(
                    catchError(resultError => {
                        {
                            //resultError;
                            if (resultError.error == "401") {
                                this.router.navigate(['/login']);
                            }
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

    // GetRequestByID(requestID:number):Observable<ActionResult>{


    //     if (this.authService.isLoggedIn()) {
    //         this.token = this.authService.getToken();
    //     }

    //     if (this.token != null) {



    //         return this.http.get<ActionResult>('api/Requests/GetRequestByID/'+requestID,
    //         {
    //             headers: {'Content-Type':'application/json','Authorization':'Bearer '+this.token}
    //          })

    //     }
    //     return null as any;


    // }



    GetRunningRequests(dto: SearchRequestsDTO): Observable<ActionResult> {


        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {



            return this.http.post<ActionResult>('api/Requests/GetRunningRequestsByUserID', dto,
                {
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
                }).pipe(
                    catchError(resultError => {
                        {
                            if (resultError.status == "401") {
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



    GetRunningRequestsCount(): Observable<ActionResult> {


        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {

            return this.http.get<ActionResult>('api/Requests/GetRunningRequestsCount',
                {
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
                })

        }
        return null as any;

    }



    GetCompletedRequestsByUserID(dto: SearchRequestsDTO): Observable<ActionResult> {


        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {



            return this.http.post<ActionResult>('api/Requests/GetCompletedRequestsByUserID', dto,
                {
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
                }).pipe(
                    catchError(resultError => {
                        {
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






    SearchRequestsByServiceID(dto: SearchRequestsDTO): Observable<ActionResult> {


        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {



            return this.http.post<ActionResult>('api/Requests/SearchRequests', dto,
                {
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
                }).pipe(
                    catchError(resultError => {
                        {
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


    getRequestByID(id: number): Observable<ActionResult> {


        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {

            return this.http.get<ActionResult>('api/Requests/GetRequestByID/' + id,
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