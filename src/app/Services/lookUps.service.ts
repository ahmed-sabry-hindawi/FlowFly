import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { AuthService } from "./auth.Service";
import { DecisionsTypeInfo } from "../models/DecisionsTypeInfo.model";
import { Observable, Subject } from "rxjs";
import { ElementsTypeInfo } from "../models/ElementsTypeInfo.model";
import { ActionResult } from "../models/ActionResult.model";
import { ApprovalTypeInfo } from "../models/ApprovalTypeInfo.model";
import { RequestsCountTypeInfo } from "../models/RequestsCountTypeInfo.model";
import { ShowingRequestHistoryTypeInfo } from "../models/ShowingRequestHistoryTypeInfo.model";




@Injectable()
export class LookupsService {

    token: string = '';

    DecisionsTypesChanged = new Subject<DecisionsTypeInfo[]>();


    ApprovalPhasesChanged = new Subject<ApprovalTypeInfo[]>();


    ElementsTypesChanged = new Subject<ElementsTypeInfo[]>();

    RequestsCountTypesChanged = new Subject<RequestsCountTypeInfo[]>();

    ShowingRequestHistoryTypesChanged = new Subject<ShowingRequestHistoryTypeInfo[]>();



    constructor(private http: HttpClient, private authService: AuthService) {
        
    }


    GetAllDecisionsTypes(): Observable<ActionResult> {


        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {

            return this.http.get<ActionResult>('api/Lookups/GetDecisionsTypes',
                {
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
                })
        }
        return null as any;


    }




    GetAllApprovalsTypes(): Observable<ActionResult> {


        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {



            return this.http.get<ActionResult>('api/Lookups/GetApprovalTypes',
                {
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
                })
        }
        return null as any;


    }


    GetAllElementsTypes(): Observable<ActionResult> {


        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {



            return this.http.get<ActionResult>('api/Lookups/GetElementsTypes',
                {
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
                })
        }
        return null as any;


    }






    GetAllRequestsCountTypes(): Observable<ActionResult> {


        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {

            return this.http.get<ActionResult>('api/Lookups/GetRequestsCountTypes',
                {
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
                })
        }
        return null as any;


    }



    GetAllShowingRequestHistoryTypes(): Observable<ActionResult> {


        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {

            return this.http.get<ActionResult>('api/Lookups/GetShowingRequestHistoryTypes',
                {
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
                })
        }
        return null as any;


    }


}
