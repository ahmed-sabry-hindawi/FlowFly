import { Inject, Injectable } from "@angular/core";
import { DepartmentInfo } from "../models/DepartmentInfo.model";
import { Observable, Subject, throwError } from "rxjs";
import { ActionResult } from "../models/ActionResult.model";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { AuthService } from "./auth.Service";
import { catchError, tap } from "rxjs/operators";
import { Router } from "@angular/router";


@Injectable()
export class DepartmentsService {

    token: string = '';
    
    DepartmentsChanged = new Subject<DepartmentInfo[]>();
    resultReturned = new Subject<ActionResult>();
  

    constructor(private http: HttpClient,private router: Router, private authService: AuthService) {
      
    }


    AddDepartment(department: DepartmentInfo) {




        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {
            return this.http.post<ActionResult>('api/Departments/AddDepartment', JSON.stringify(department),
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
                            this.DepartmentsChanged.next();
                            return resultData;

                        }
                    )
                );
        }
        return null as any;
    }


    UpdateDepartment(department: DepartmentInfo) {




        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {
            return this.http.post<ActionResult>('api/Departments/UpdateDepartment', JSON.stringify(department),
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
                            this.DepartmentsChanged.next();
                            return resultData;

                        }
                    )
                );
        }
        return null as any;
    }

    

    DeleteDepartment(departmentID: number) {
       
        var dto = {
         
            'departmentID': departmentID
        };

        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {
            return this.http.post<ActionResult>('api/Departments/DeleteDepartment', dto,
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
                            this.DepartmentsChanged.next();
                            return resultData;

                        }
                    )
                );
        }
        return null as any;
    }


    AddEmployeeToDepartment(userID: number, departmentID: number) {


        var dto = {
            'UserId': userID,
            'DepartmentID': departmentID
        };

        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {
            return this.http.post<ActionResult>('api/User/ChangeEmployeeDepartment', JSON.stringify(dto),
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
                            this.DepartmentsChanged.next();
                            return resultData;

                        }
                    )
                );
        }
        return null as any;
    }


    GetAllOSDepartments(): Observable<ActionResult> {

        
        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {



            return this.http.get<ActionResult>('api/Departments/GetOSDepartments',
                {
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
                })
        }
        return null as any;


    }



    GetDepartmentsTree(): Observable<ActionResult> {

        
        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {



            return this.http.get<ActionResult>('api/Departments/GetDepartmentTreeAsJson/1',
                {
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
                })
        }
        return null as any;


    }


    

    GetDepartmentByID(departmentID:number): Observable<ActionResult> {

        
        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {



            return this.http.get<ActionResult>('api/Departments/GetDepartmentByID/'+departmentID,
                {
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
                })
        }
        return null as any;


    }

    

    GetAllDepartmentsTypes(): Observable<ActionResult> {

        
        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {



            return this.http.get<ActionResult>('api/Departments/GetAllDepartmentsTypes',
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