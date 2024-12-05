import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { AuthService } from "./auth.Service";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { ActionResult } from "../models/ActionResult.model";
import { FormInfo } from "../models/FormInfo.model";
import { Router } from "@angular/router";




@Injectable()
export class FormsService {

    token: string = '';
    FormsChanged = new Subject<FormInfo[]>();
    resultReturned = new Subject<ActionResult>();


    constructor(
        private http: HttpClient,
        private authService: AuthService,
        private router: Router) {

    }


    AddForm(serviceForm: FormInfo) {

        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }
        if (this.token != null) {

            return this.http.post<ActionResult>('api/Forms/AddForm', JSON.stringify(serviceForm),
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

    GetFormByID(formID: number): Observable<ActionResult> {


        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {



            return this.http.get<ActionResult>('api/forms/GetFormByID/' + formID,
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