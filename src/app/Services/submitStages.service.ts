import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { AuthService } from "./auth.Service";
import { Observable, Subject, throwError } from "rxjs";
import { ActionResult } from "../models/ActionResult.model";
import { SubmitStageInfo } from "../models/SubmitStageInfo.model";
import { catchError, tap } from "rxjs/operators";
import { Router } from "@angular/router";



@Injectable()
export class SubmitStagesService {

    token: string = '';
    allSubmitStages: SubmitStageInfo[] = [];
    SubmitStagesChanged = new Subject<SubmitStageInfo[]>();
    resultReturned = new Subject<ActionResult>();
 

    constructor(
        private http: HttpClient,
        private router: Router,
        private authService: AuthService) {
    }


    GetAllSubmitStages(): Observable<ActionResult> {

        let allSubmitStages: SubmitStageInfo[] = [];
        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {



            return this.http.get<ActionResult>('api/SubmitStages/GetAllSubmitStages',
                {
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
                })
        }
        return null as any;


    }



    ChangeSubmitStageStatus(SubmitStage: SubmitStageInfo) {


        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {
            return this.http.post<ActionResult>('api/SubmitStages/ChangeSubmitStageStatus', JSON.stringify(SubmitStage),
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
                            this.SubmitStagesChanged.next();
                            return resultData;

                        }
                    )
                );
        }
        return null as any;
    }






    AddSubmitStage(SubmitStage: SubmitStageInfo) {


        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {
            return this.http.post<ActionResult>('api/SubmitStages/AddSubmitStage', JSON.stringify(SubmitStage),
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
                            this.SubmitStagesChanged.next();
                            return resultData;

                        }
                    )
                );
        }
        return null as any;
    }

    UpdateSubmitStage(SubmitStage: SubmitStageInfo) {


        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {
            return this.http.post<ActionResult>('api/SubmitStages/UpdateSubmitStage', JSON.stringify(SubmitStage),
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
                            this.SubmitStagesChanged.next();
                            return resultData;

                        }
                    )
                );
        }
        return null as any;
    }

 
    private handleData(resultData: ActionResult) {

        this.resultReturned.next(resultData)
    }

    
    private HandleError(resultError: HttpErrorResponse) {

        if (!resultError.error.resultMessage) return throwError('unknown error ');


        return throwError(resultError.error);
    }






}