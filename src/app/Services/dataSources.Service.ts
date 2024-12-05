import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { AuthService } from "./auth.Service";
import { Observable, Subject, throwError } from "rxjs";
import { ActionResult } from "../models/ActionResult.model";
import { DataSourceInfo } from "../models/DataSourceInfo.model";
import { ItemInfo } from "../models/ItemInfo.model";
import { catchError, tap } from "rxjs/operators";
import { Router } from "@angular/router";



@Injectable()
export class DataSourcesService {

    token: string = '';
    allDataSources: DataSourceInfo[] = [];
    DataSourcesChanged = new Subject<DataSourceInfo[]>();
    resultReturned = new Subject<ActionResult>();

    constructor(
        private http: HttpClient,       
        private router: Router,
        private authService: AuthService) {
        }


    GetAllDataSources(): Observable<ActionResult> {

        let allDataSources: DataSourceInfo[] = [];
        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {



            return this.http.get<ActionResult>('api/DataSources/GetAllDataSources',
                {
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
                })
        }
        return null as any;


    }


    GetDataSources(ids:number[]): Observable<ActionResult> {

        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {
            return this.http.post<ActionResult>('api/DataSources/GetDataSources', JSON.stringify(ids),
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
                            this.DataSourcesChanged.next();
                            return resultData;

                        }
                    )
                );
        }
        return null as any;


    }



    ChangeDataSourceStatus(DataSource: DataSourceInfo) {


        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {
            return this.http.post<ActionResult>('api/DataSources/ChangeDataSourceStatus', JSON.stringify(DataSource),
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
                            this.DataSourcesChanged.next();
                            return resultData;

                        }
                    )
                );
        }
        return null as any;
    }






    AddDataSource(DataSource: DataSourceInfo) {


        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {
            return this.http.post<ActionResult>('api/DataSources/AddDataSource', JSON.stringify(DataSource),
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
                            this.DataSourcesChanged.next();
                            return resultData;

                        }
                    )
                );
        }
        return null as any;
    }

    UpdateDataSource(DataSource: DataSourceInfo) {


        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {
            return this.http.post<ActionResult>('api/DataSources/UpdateDataSource', JSON.stringify(DataSource),
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
                            this.DataSourcesChanged.next();
                            return resultData;

                        }
                    )
                );
        }
        return null as any;
    }

    AddItemToDataSource(item: ItemInfo) {

        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {
            return this.http.post<ActionResult>('api/DataSources/AddItemToDataSource', JSON.stringify(item),
                {
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token },

                }).pipe(
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
                            this.DataSourcesChanged.next();
                            return resultData;

                        }
                    )
                );
        }
        return null as any;
    }



    DeleteItemFromDataSource(item: ItemInfo) {


        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {
            return this.http.post<ActionResult>('api/DataSources/DeleteItemFromDataSource', JSON.stringify(item),
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
                            this.DataSourcesChanged.next();
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