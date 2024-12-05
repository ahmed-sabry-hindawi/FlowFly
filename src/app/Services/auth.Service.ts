import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User } from "../accounts/auth/user.model";
import { ActivatedRoute, Router } from "@angular/router";
import { UserInfo } from "../models/UserInfo.model";
import { RegistrationDTO } from "../models/RegistrationDTO.model";
import { NationalityInfo } from "../models/NationalityInfo.model";
import { ActionResult } from "../models/ActionResult.model";


export interface AuthResponseData {
    data: any;
    token: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    kind: string;
    registered?: boolean;
}

@Injectable()
export class AuthService {

    UserChanged = new Subject<UserInfo>();
    user!: UserInfo;
    taken: string = '';



    constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {

    }



    signUp(dto: RegistrationDTO): Observable<ActionResult> {


        return this.http.post<ActionResult>('api/Account/Register', JSON.stringify(dto),
            {
                headers: { 'Content-Type': 'application/json' },

            }).pipe(
                catchError(resultError => {
                    {
                        return this.HandleError(resultError);

                    }
                }),
                tap(
                    resultData => {
                        return resultData;
                    }
                )
            );
    }


    signIn(email: string, password: string) {


        return this.http.post<AuthResponseData>('api/Account/Login', {
            'email': email,
            'password': password

        }, {
            headers: { 'Content-Type': 'application/json' },

        }).pipe(
            catchError(resultError => {
                {
                    return this.HandleError(resultError);
                }
            }

            ),
            tap(
                resultData => {

                    this.handleAuthentication(resultData);

                }
            )
        );
    }

    logout() {


        localStorage.removeItem('token');
        localStorage.removeItem('FlowFlyUserId');
        localStorage.removeItem('FlowFlyUserFullName');
        localStorage.removeItem('FlowFlyUserPersonalImage');
        localStorage.removeItem('FlowFlyUserEmail');
        localStorage.removeItem('FlowFlyUserName');
        localStorage.removeItem('FlowFlyUserGender');
        localStorage.removeItem('FlowFlyUserNationality');

        this.UserChanged.next(null as any);
    }

    getToken() {

        if (localStorage.getItem("token") == undefined) {
            if (
                this.router.url != '/registration' &&
                !this.router.url.includes('activation') &&
                 this.router.url != '/' && 
                 this.router.url != '/login') {
                this.router.navigate(['/login']);
            }
            return '';
        }
        return localStorage.getItem("token")!;

    }


    getUserFullname() {

        if (localStorage.getItem("FlowFlyUserFullName") == undefined) return '';
        return localStorage.getItem("FlowFlyUserFullName")!;

    }

    getUserPersonalImage() {

        if (localStorage.getItem("FlowFlyUserPersonalImage") == undefined) return '';
        return localStorage.getItem("FlowFlyUserPersonalImage")!;

    }

    getUserJobTitle() {

        if (localStorage.getItem("FlowFlyUserJobTitle") == undefined || localStorage.getItem("FlowFlyUserJobTitle") == 'null') return '';
        return localStorage.getItem("FlowFlyUserJobTitle")!;

    }

    getUserId() {

        if (localStorage.getItem("FlowFlyUserId") == undefined) return '';
        return localStorage.getItem("FlowFlyUserId")!;

    }


    isAdmin() {
        if (localStorage.getItem("FlowFlyUserIsAdmin") == undefined) return false;
        let isAdmin = (localStorage.getItem("FlowFlyUserIsAdmin") == 'true');
        return isAdmin;
    }

    

    IsAddedToOS() {
        if (localStorage.getItem("FlowFlyIsAddedToOS") == undefined) return false;
        let isAdmin = (localStorage.getItem("FlowFlyIsAddedToOS") == 'true');
        return isAdmin;
    }


    private HandleError(resultError: HttpErrorResponse) {

        if (!resultError.error) return throwError('unknown error ');


        return throwError(resultError.error.resultMessage);
    }

    private handleAuthentication(resultData: AuthResponseData) {





        let user = new UserInfo();

        user = resultData.data;
        //         user.userId = resultData.data.userId;
        //         user.userName = resultData.data.userName;
        //         user.email = resultData.data.email;
        //         user.fullName = resultData.data.fullName;
        //         user.createdBy = resultData.data.createdBy;
        //         user.createdOn = resultData.data.createdOn;
        //         user.isActive = resultData.data.isActive;
        //         user.gender = resultData.data.gender;
        //         user.dob = resultData.data.dbo;
        //         user.subDepartmentId = resultData.data.subDepartmentID;
        //         user.departmentId = resultData.data.departmentID;
        //         user.nationality = new NationalityInfo();
        //         user.nationality.id = resultData.data.nationality.id;
        //         user.nationality.name = resultData.data.nationality.name;
        // user.personalImage=



        this.taken = resultData.token;
        localStorage.setItem("token", resultData.token);
        localStorage.setItem("FlowFlyUserId", user.userId.toString());
        localStorage.setItem("FlowFlyUserIsAdmin", resultData.data.isAdmin.toString());
        localStorage.setItem("FlowFlyUserFullName", user.fullName);
        localStorage.setItem("FlowFlyUserPersonalImage", user.personalImage);
        localStorage.setItem("FlowFlyUserEmail", user.email);
        localStorage.setItem("FlowFlyUserName", user.userName);
        let genderString = (user.gender ? 'ذكر' : 'أنثى');
        localStorage.setItem("FlowFlyUserGender", genderString);
        localStorage.setItem("FlowFlyUserNationality", user.nationality.name);
        localStorage.setItem("FlowFlyUserJobTitle", resultData.data.jobTitle);
        this.user = user;
        this.UserChanged.next(this.user);

        //is Added To Organization Structure
        if (resultData.data.subDepartmentId != null) {
            localStorage.setItem("FlowFlyIsAddedToOS", true.toString());
        }
        else {
            localStorage.setItem("FlowFlyIsAddedToOS", false.toString());
        }

    }


    public isLoggedIn() {
        if (this.getToken() != undefined) {
            return true;
        }
        this.router.navigate(['/login']);
        return false;
    }







}