import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { AuthService } from "./auth.Service";
import { Observable, Subject, throwError } from "rxjs";
import { ActionResult } from "../models/ActionResult.model";
import { GroupInfo } from "../models/GroupInfo.model";
import { catchError, tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { UserGroupInfo } from "../models/UserGroupInfo.model";


@Injectable()
export class GroupsService {

    token: string = '';
    allGroups: GroupInfo[] = [];
    GroupsChanged = new Subject<GroupInfo[]>();


    constructor(
        private http: HttpClient,
        private router: Router,
        private authService: AuthService) {


    }


    GetAllGroups(): Observable<ActionResult> {

        let allGroups: GroupInfo[] = [];
        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {



            return this.http.get<ActionResult>('api/Groups/GetAllGroups',
                {
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
                })
        }
        return null as any;


    }






    ChangeGroupStatus(group: GroupInfo) {

        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {
            return this.http.post<ActionResult>('api/Groups/ChangeGroupStatus', JSON.stringify(group),
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
                        (resultData: any) => {
                            this.GroupsChanged.next();
                            return resultData;

                        }
                    )
                );
        }
        return null as any;
    }







    AddGroup(group: GroupInfo) {




        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {
            return this.http.post<ActionResult>('api/Groups/AddGroup', JSON.stringify(group),
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
                        (resultData: any) => {
                            this.GroupsChanged.next();
                            return resultData;

                        }
                    )
                );
        }
        return null as any;
    }


    UpdateGroup(group: GroupInfo) {




        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {
            return this.http.post<ActionResult>('api/Groups/UpdateGroup', JSON.stringify(group),
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
                        (resultData: any) => {
                            this.GroupsChanged.next();
                            return resultData;

                        }
                    )
                );
        }
        return null as any;
    }

    AddUserToGroup(userID: number, groupID: number) {


        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {

            let userGroup: UserGroupInfo = new UserGroupInfo();
            userGroup.userId = userID;
            userGroup.groupId = groupID;

            return this.http.post<ActionResult>('api/Groups/AddUserToGroup', JSON.stringify(userGroup),
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
                        (resultData: any) => {
                            this.GroupsChanged.next();
                            return resultData;

                        }
                    )
                );
        }
        return null as any;
    }


    DeleteUserFromGroup(userID: number, groupID: number) {




        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {

            let userGroup: UserGroupInfo = new UserGroupInfo();
            userGroup.userId = userID;
            userGroup.groupId = groupID;

            return this.http.post<ActionResult>('api/Groups/DeleteUserFromGroup', JSON.stringify(userGroup),
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
                        (resultData: any) => {
                            this.GroupsChanged.next();
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