import { Component, OnInit, Output } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { FFRequestInfo } from 'src/app/models/FFRequestInfo.model';
import { ReportInfo, SummaryItem } from 'src/app/models/ReportInfo.model';
import { ReportRequestInfo } from 'src/app/models/ReportRequestInfo.model';
import { SearchRequestsDTO } from 'src/app/models/SearchRequestsDTO.model';
import { ServiceCategoryInfo } from 'src/app/models/ServiceCategoryInfo.model';
import { RequestsService } from 'src/app/Services/request.Service';
import { ServiceService } from 'src/app/Services/Services.Service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-services-report',
  templateUrl: './services-report.component.html',
  styleUrls: ['../../app.component.css']
})
export class ServicesReportComponent implements OnInit {

  allServices: ServiceCategoryInfo[] = [];
  report: ReportInfo = new ReportInfo();
  pageRequests!: ReportRequestInfo[];


  ServiceRequests: FFRequestInfo[] = [];
  itemsCount: number = 0;


  isLoading: boolean = true;
  errorMessage: string = '';
  successMessage: string = '';
  selectedService: string = '-1';
  selectedServiceName!: string;
  selectedServiceDescription!: string;
  requestsCount: number = 0;
  pageIndex: number = 1;
  pageSize: number = 10;

  @Output() requestDetails: FFRequestInfo = new FFRequestInfo();


  pageEvent1: PageEvent;


  constructor(
    private serviceService: ServiceService,
    private requestService: RequestsService,
    private router: Router,
    private route: ActivatedRoute
  ) {

  }


  ngOnInit(): void {

    this.loadServices();
    this.isLoading = false;

  }


  loadServices() {
    this.serviceService.GetAllServices().subscribe(res => {
      this.allServices = res.data;

      //if (this.allServices.length > 0 && this.allServices[0].services.length > 0) {

      //this.selectedService=this.allServices[0].services[0].id.toString();
      //this.selectedServiceName=this.allServices[0].services[0].name.toString();
      //this.loadReport(this.allServices[0].services[0].id);

      // let dto: SearchRequestsDTO = new SearchRequestsDTO();
      // dto.PageIndex = 1;
      // dto.PageSize = this.pageSize;
      // this.requestService.SearchRequestsByServiceID(dto).subscribe(res => {
      //   this.ServiceRequests = res.data;
      //   this.itemsCount = res.count;

      //   this.isLoading = false;


      // });
      //this.SearchRequests();
      //}

    });

  }


  SearchRequests() {

    this.report=new ReportInfo();
    if (+this.selectedService != -1) {

      this.getServiceName(+this.selectedService);

      let dto: SearchRequestsDTO = new SearchRequestsDTO();
      dto.PageIndex = 1;
      dto.PageSize = 10;
      dto.ServiceID = +this.selectedService;
      this.requestService.SearchRequestsByServiceID(dto).subscribe(res => {
        this.ServiceRequests = res.data;
        this.itemsCount = res.count;

        this.isLoading = false;
        this.pageIndex = 0;

      });
    }
  }




  loadReport() {

    this.getServiceName(+this.selectedService);

    if (+this.selectedService != -1) {
      this.serviceService.getServiceReport(+this.selectedService).subscribe(res2 => {
        this.report = res2.data;


        if (this.report.sums) {
          this.report.reportSummary = [];
          let summaryItem: SummaryItem = new SummaryItem();
          for (let item in this.report.sums) {
            summaryItem = new SummaryItem();
            summaryItem.ElementID = item;
            summaryItem.ElementName = this.report.serviceForm.formElements.find(x => x.id.toString() == item)!.title;
            summaryItem.ElementTypeID = this.report.serviceForm.formElements.find(x => x.id.toString() == item)!.elementTypeID;
            summaryItem.ElementSum = this.report.sums[item];
            this.report.reportSummary.push(summaryItem);

          }


          for (let item in this.report.averages) {

            this.report.reportSummary.find(x => x.ElementID == item)!.ElementAverage = this.report.averages[item];
          }
        }

        this.requestsCount = this.report.requests.length;

        this.pageRequests = this.report.requests.slice(0, this.pageSize).map(i => {
          return i
        });
        this.pageIndex = 0;

      });
    }

  }




  handlePageEvent(e: PageEvent) {
    this.pageEvent1 = e;


    let dto: SearchRequestsDTO = new SearchRequestsDTO();
    dto.PageIndex = e.pageIndex + 1;
    dto.PageSize = 10;
    dto.ServiceID = +this.selectedService;
    this.requestService.SearchRequestsByServiceID(dto).subscribe(res => {
      this.ServiceRequests = res.data;
      this.itemsCount = res.count;

      this.isLoading = false;


    });

  }



  // redirectToRequestDetails(requestId: number) {


  //   //this.serviceService.selectedService = this.serviceService.getSelectedServiceByID(request.serviceId);


  //     //this.serviceService.selectedService = this.selectedService;



  //     this.requestDetails.requestId=requestId;
  //     this.requestService.selectedRequest = this.requestDetails;
  //     this.router.navigate(['/home/request-details'], { relativeTo: this.route });



  // }



  redirectToRequestDetails(request: FFRequestInfo) {


    this.requestService.selectedRequest = request;
    //this.serviceService.selectedService = this.serviceService.getSelectedServiceByID(request.serviceId);

    this.serviceService.getSelectedServiceByID(request.serviceId).subscribe(res => {
      this.serviceService.selectedService = res.data;
      this.router.navigate(['../request-details'], { relativeTo: this.route });
    });



  }


  getServiceName(serviceID: number) {
    for (let i = 0; i < this.allServices.length; i++) {



      if (this.allServices[i].services != undefined && this.allServices[i].services.length > 0) {
        for (let j = 0; j < this.allServices[i].services.length; j++) {
          if (this.allServices[i].services[j].id == serviceID) {
            this.selectedServiceName = this.allServices[i].services[j].name;
            this.selectedServiceDescription = this.allServices[i].services[j].description;
          }
        }
      }


    }
  }


  async sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  exportexcel(): void {


    this.getServiceName(+this.selectedService);

    if (+this.selectedService != -1) {
      this.serviceService.getServiceReport(+this.selectedService).subscribe(async res2 => {
        this.report = res2.data;

        await this.sleep(1000);



        /* pass here the table id */
        let element = document.getElementById("excel-table");
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, this.selectedServiceName + '.xlsx');

        if (this.report.sums) {
          this.report.reportSummary = [];
          let summaryItem: SummaryItem = new SummaryItem();
          for (let item in this.report.sums) {
            summaryItem = new SummaryItem();
            summaryItem.ElementID = item;
            summaryItem.ElementName = this.report.serviceForm.formElements.find(x => x.id.toString() == item)!.title;
            summaryItem.ElementTypeID = this.report.serviceForm.formElements.find(x => x.id.toString() == item)!.elementTypeID;
            summaryItem.ElementSum = this.report.sums[item];
            this.report.reportSummary.push(summaryItem);

          }


          for (let item in this.report.averages) {

            this.report.reportSummary.find(x => x.ElementID == item)!.ElementAverage = this.report.averages[item];
          }
        }



        this.pageRequests = this.report.requests.slice(0, this.pageSize).map(i => {
          return i
        });


      });
    }


  }

 
}
