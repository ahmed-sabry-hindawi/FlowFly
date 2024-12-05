import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { AuthService } from "./auth.Service";
import { Observable, Subject } from "rxjs";
import { ActionResult } from "../models/ActionResult.model";
import { SearchUsersDTO } from "../models/SearchUsersDTO.model";
import { UserInfo } from "../models/UserInfo.model";
import { map } from "rxjs/internal/operators/map";


@Injectable()
export class UsersService {

    token: string = '';
    allUsers: UserInfo[] = [];
    UsersChanged = new Subject<ActionResult>();


    constructor(private http: HttpClient,  private authService: AuthService) {
        
    }


    



    GetAllUsers(dto: SearchUsersDTO): Observable<HttpResponse<ActionResult>> {

        //let allGroups: GroupInfo[] = [];
        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {



            return this.http.post<HttpResponse<ActionResult>>('api/User/SearchUsers', JSON.stringify(dto),
                {
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token },
                    observe: 'response'
                }).pipe(
                    map((response: any) => {
                        //this.toastr.success(response.message);
                        return response;
                    }),
                );


        }
        return null as any;


    }




    GetAllNationalities(): Observable<HttpResponse<ActionResult>> {

        
        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {



            return this.http.get<HttpResponse<ActionResult>>('api/User/GetAllNationalities',
                {
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token },
                    observe: 'response'
                }).pipe(
                    map((response: any) => {
                   
                        return response;
                    }),
                );


        }
        return null as any;


    }





    GetByUserID(userId:number): Observable<ActionResult> {

        
        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {



            return this.http.get<ActionResult>('api/User/GetByUserID/'+userId,
                {
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
                })
        }
        return null as any;


    }


}