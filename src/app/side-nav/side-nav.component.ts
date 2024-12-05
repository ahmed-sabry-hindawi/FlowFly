import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.Service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { RequestsService } from '../Services/request.Service';
import { TasksService } from '../Services/tasks.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
})
export class SideNavComponent implements OnInit, OnDestroy {

  options = this._formBuilder.group({
    bottom: 0,
    fixed: false,
    top: 0,
  });

  isAuthenticated: boolean = true;
  employeeName: string = 'يرجى تسجيل الدخول';
  jobTitle: string = '';
  personalImageUrl: string = '';

  runningRequestsCount: number = 0;
  awaitingTasksCount: number = 0;

  isAdmin: boolean = false;

  constructor(
    private authService: AuthService,
    @Inject('BASE_Personal_Images_URL') private baseImagesUrl: string,
    private requestsService: RequestsService,
    private tasksService: TasksService,
    private _formBuilder: FormBuilder) {

  }


  ngOnInit(): void {

    if (this.authService.isLoggedIn()) {

      this.isAdmin = this.authService.isAdmin();
      this.employeeName = this.authService.getUserFullname();

      this.jobTitle = this.authService.getUserJobTitle();
      this.personalImageUrl = this.authService.getUserPersonalImage();
      if (this.personalImageUrl != '' && this.personalImageUrl != 'null' && this.personalImageUrl != undefined) {
        this.personalImageUrl = this.baseImagesUrl + this.personalImageUrl;
      }
      else {
        this.personalImageUrl = "/assets/images/anonumous.png";
      }

      this.GetRuningRequestsCount();

      this.GetAwaitingTasksCount();

      this.tasksService.TasksChanged.subscribe(res => {
        this.GetRuningRequestsCount();

        this.GetAwaitingTasksCount();
      }
      )


    }
    else {

    }


  }


  GetRuningRequestsCount() {
    this.requestsService.GetRunningRequestsCount().subscribe(res => {
      this.runningRequestsCount = res.data;
    });
  }


  GetAwaitingTasksCount() {
    this.tasksService.GetAwaitingTasksCount().subscribe(res => {
      this.awaitingTasksCount = res.data;
    });
  }

  ngOnDestroy(): void {
    //this.subscription1.unsubscribe();
  }


}
