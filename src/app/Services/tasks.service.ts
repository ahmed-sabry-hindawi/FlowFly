import { Router } from "@angular/router";
import { AuthService } from "./auth.Service";
import { ActionResult } from "../models/ActionResult.model";
import { TaskInfo } from "../models/TaskInfo.model";
import { Observable, Subject, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { Inject, Injectable } from "@angular/core";
import { SearchTasksDTO } from "../models/SearchTasksDTO.model";
import { UpdateTaskDTO } from "../models/UpdateTaskDTO.model";

@Injectable()
export class TasksService {

    token: string = '';
    TasksChanged = new Subject<TaskInfo[]>();
    selectedTask: TaskInfo = new TaskInfo();
    resultReturned = new Subject<ActionResult>();


    constructor(private http: HttpClient, private authService: AuthService, private router: Router) {

    }


    GetTaskByID(taskId: string): Observable<ActionResult> {


        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {



            return this.http.get<ActionResult>('api/Tasks/GetTaskByID/' + taskId,
                {
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
                })

        }
        return null as any;


    }



    GetUserTasks(dto: SearchTasksDTO): Observable<ActionResult> {


        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {


            return this.http.post<ActionResult>('api/Tasks/GetUserTasks', dto,
                {
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
                }).pipe(
                    catchError(resultError => {
                        {
                            if (resultError.status == "401") {
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




    GetAwaitingTasksCount(): Observable<ActionResult> {


        if (this.authService.isLoggedIn()) {
            this.token = this.authService.getToken();
        }

        if (this.token != null) {

            return this.http.get<ActionResult>('api/Tasks/GetAwaitingTasksCount',
                {
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
                })

        }
        return null as any;

    }


    UpdateTask(dto: UpdateTaskDTO) {

        dto.executedByUserID = -1;
        return this.http.post<ActionResult>('api/Tasks/UpdateTask', JSON.stringify(dto),
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
                        this.TasksChanged.next();
                        return resultData;

                    }
                )
            );
    }




    private HandleError(resultError: HttpErrorResponse) {

        if (!resultError.error.resultMessage) return throwError('unknown error ');


        return throwError(resultError.error);
    }

}