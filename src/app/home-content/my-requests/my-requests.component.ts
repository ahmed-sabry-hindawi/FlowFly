import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from 'src/app/Services/Services.Service';
import { RequestsService } from 'src/app/Services/request.Service';
import { FFRequestInfo } from 'src/app/models/FFRequestInfo.model';
import { SearchRequestsDTO } from 'src/app/models/SearchRequestsDTO.model';

@Component({
  selector: 'app-my-requests',
  templateUrl: './my-requests.component.html',
  styleUrls: ['../../app.component.css']
})
export class MyRequestsComponent implements OnInit {


  isLoading = true;

  itemsCount1 = 0;
  pageSize1 = 10;
  pageIndex1 = 0;

  itemsCount2 = 0;
  pageSize2 = 10;
  pageIndex2 = 0;

  myRuningRequests: FFRequestInfo[] = [];
  myCompletedRequests: FFRequestInfo[] = [];
  hidePageSize = false;
  showPageSizeOptions = false;
  showFirstLastButtons = true;
  disabled = false;
  pageEvent1: PageEvent;
  pageEvent2: PageEvent;


  constructor(
    private requestService: RequestsService,
    private serviceService: ServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {

  }

  handlePageEvent1(e: PageEvent) {
    this.pageEvent1 = e;


    let dto: SearchRequestsDTO = new SearchRequestsDTO();
    dto.PageIndex = e.pageIndex + 1;
    dto.PageSize = 10;
    this.requestService.GetRunningRequests(dto).subscribe(res => {
      this.myRuningRequests = res.data;
      this.itemsCount1 = res.count;

      this.isLoading = false;


    });

  }


  handlePageEvent2(e: PageEvent) {
    this.pageEvent1 = e;


    let dto: SearchRequestsDTO = new SearchRequestsDTO();
    dto.PageIndex = e.pageIndex + 1;
    dto.PageSize = 10;
    this.requestService.GetCompletedRequestsByUserID(dto).subscribe(res => {
      this.myCompletedRequests = res.data;
      this.itemsCount2 = res.count;
      this.isLoading = false;

    });

  }



  ngOnInit(): void {


    let dto: SearchRequestsDTO = new SearchRequestsDTO();
    dto.PageIndex = 1;
    dto.PageSize = 10;
    this.requestService.GetRunningRequests(dto).subscribe(res => {
      this.myRuningRequests = res.data;
      this.itemsCount1 = res.count;


      setTimeout(() => {
        this.isLoading = false;
      }, 10);



    });
  }


  onTabChanged($event: any) {
    let clickedIndex = $event.index;
    if (clickedIndex == 1) {

      let dto: SearchRequestsDTO = new SearchRequestsDTO();
      dto.PageIndex = 1;
      dto.PageSize = 10;
      this.requestService.GetCompletedRequestsByUserID(dto).subscribe(res => {
        this.myCompletedRequests = res.data;
        this.itemsCount2 = res.count;
        this.isLoading = false;

      });
    }
  }


  redirectToRequestDetails(request: FFRequestInfo) {


    this.requestService.selectedRequest = request;
    //this.serviceService.selectedService = this.serviceService.getSelectedServiceByID(request.serviceId);

    this.serviceService.getSelectedServiceByID(request.serviceId).subscribe(res => {
      this.serviceService.selectedService = res.data;
      this.router.navigate(['../request-details'], { relativeTo: this.route });
    });



  }


}
