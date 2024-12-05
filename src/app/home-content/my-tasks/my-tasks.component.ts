import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from 'src/app/Services/Services.Service';
import { RequestsService } from 'src/app/Services/request.Service';
import { TasksService } from 'src/app/Services/tasks.service';
import { SearchTasksDTO } from 'src/app/models/SearchTasksDTO.model';
import { TaskInfo } from 'src/app/models/TaskInfo.model';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['../../app.component.css']
})
export class MyTasksComponent implements OnInit {


  isLoading = true;

  tasksCount = 0;
  pageSize1 = 10;
  pageIndex1 = 0;

  completedTasksCount = 0;
  pageSize2 = 10;
  pageIndex2 = 0;

  myTasks: TaskInfo[] = [];
  myCompletedTasks: TaskInfo[] = [];
  hidePageSize = false;
  showPageSizeOptions = false;
  showFirstLastButtons = true;
  disabled = false;
  pageEvent1: PageEvent;
  pageEvent2: PageEvent;


  constructor(
    private requestService: RequestsService,
    private tasksService: TasksService,
    private serviceService: ServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {

  }

  handlePageEvent1(e: PageEvent) {
    this.pageEvent1 = e;


    let dto: SearchTasksDTO = new SearchTasksDTO();
    dto.PageIndex = e.pageIndex + 1;
    dto.IsDone = false;
    this.tasksService.GetUserTasks(dto).subscribe(res => {
      this.myTasks = res.data;
      this.tasksCount = res.count;
      this.isLoading = false;
    });

  }


  handlePageEvent2(e: PageEvent) {
    this.pageEvent1 = e;


    let dto: SearchTasksDTO = new SearchTasksDTO();
    dto.IsDone = true;
    dto.PageIndex = e.pageIndex + 1;
    dto.IsDone = true;
    this.tasksService.GetUserTasks(dto).subscribe(res => {
      this.myCompletedTasks = res.data;
      this.completedTasksCount = res.count;
      this.isLoading = false;

    });

  }



  ngOnInit(): void {


    let dto: SearchTasksDTO = new SearchTasksDTO();
    dto.IsDone = false;
    dto.PageIndex = 1;

    this.tasksService.GetUserTasks(dto).subscribe(res => {
      this.myTasks = res.data;
      this.tasksCount = res.count;


      setTimeout(() => {
        this.isLoading = false;
      }, 10);



    });
  }


  onTabChanged($event: any) {
    let clickedIndex = $event.index;
    if (clickedIndex == 1) {

      let dto: SearchTasksDTO = new SearchTasksDTO();

      dto.PageIndex = 1;
      dto.IsDone = true;
      this.tasksService.GetUserTasks(dto).subscribe(res => {
        this.myCompletedTasks = res.data;
        this.completedTasksCount = res.count;
        this.isLoading = false;

      });
    }
  }


  redirectToTaskDetails(task: TaskInfo) {


    this.tasksService.selectedTask = task;
    this.requestService.selectedRequest = task.request;
    // this.serviceService.selectedService = this.serviceService.getSelectedServiceByID(task.request.serviceId);

    this.serviceService.getSelectedServiceByID(task.request.serviceId).subscribe(res => {
      this.serviceService.selectedService = res.data;
      this.router.navigate(['../task-details'], { relativeTo: this.route });
    });

  }



  redirectToRequestDetails(requestId: number) {


    this.requestService.getRequestByID(requestId).subscribe(res => {
      this.requestService.selectedRequest = res.data;
     
      this.serviceService.getSelectedServiceByID(this.requestService.selectedRequest.serviceId).subscribe(res => {
        this.serviceService.selectedService = res.data;
        this.router.navigate(['../request-details'], { relativeTo: this.route });
      });

    });


  }


}
