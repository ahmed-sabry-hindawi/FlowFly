import { ViewportScroller } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService } from 'src/app/Services/Services.Service';
import { DataSourcesService } from 'src/app/Services/dataSources.Service';
import { DepartmentsService } from 'src/app/Services/departments.Service';
import { EndPointsService } from 'src/app/Services/endPoints.service';
import { ExternalAPIService } from 'src/app/Services/externalAPIService.service';
import { GroupsService } from 'src/app/Services/groups.service';
import { LookupsService } from 'src/app/Services/lookUps.service';
import { RequestsService } from 'src/app/Services/request.Service';
import { UsersService } from 'src/app/Services/users.service';
import { ApprovalTypeInfo } from 'src/app/models/ApprovalTypeInfo.model';
import { DataSourceInfo } from 'src/app/models/DataSourceInfo.model';
import { DecisionsTypeInfo } from 'src/app/models/DecisionsTypeInfo.model';
import { DepartmentInfo } from 'src/app/models/DepartmentInfo.model';
import { ElementsTypeInfo } from 'src/app/models/ElementsTypeInfo.model';
import { EndPointInfo } from 'src/app/models/EndPointInfo.model';
import { FFRequestInfo } from 'src/app/models/FFRequestInfo.model';
import { GroupInfo } from 'src/app/models/GroupInfo.model';
import { ItemInfo } from 'src/app/models/ItemInfo.model';
import { SearchUsersDTO } from 'src/app/models/SearchUsersDTO.model';
import { ServiceInfo } from 'src/app/models/ServiceInfo.model';
import { UserInfo } from 'src/app/models/UserInfo.model';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  // styleUrls: ['./request-details.component.css']
  styleUrls: ['../../app.component.css']
})
export class RequestDetailsComponent implements OnInit {

  @Input() serviceDetails: ServiceInfo = new ServiceInfo();
  @Input() requestDetails: FFRequestInfo = new FFRequestInfo();
  // formDetails: FormInfo = new FormInfo();
  RequestFormGroup!: FormGroup;
  allDecisionsTypes: DecisionsTypeInfo[] = [];
  allApprovalTypes: ApprovalTypeInfo[] = [];
  allElementsTypes: ElementsTypeInfo[] = [];
  allGroups: GroupInfo[] = [];
  allOSDepartments: DepartmentInfo[] = [];
  allDataSources: DataSourceInfo[] = [];
  isDataLoaded: boolean = false;
  defaultselected: number = -1;
  srcResult: string = "";
  fileName: string = "";
  usersSearchDTO: SearchUsersDTO = new SearchUsersDTO();
  usersFiltered: UserInfo[] = [];
  isLoading!: boolean;
  errorMessage: string = '';
  successMessage: string = '';
  thereIsDoneTasksToShow: boolean = false;
  externalDatasourceListsDictionary = new Map<number, ItemInfo[]>();
  externalDataSources_GetValue: EndPointInfo[] = [];
  externalDataSources_GetList: EndPointInfo[] = [];


  constructor(
    private requestsService: RequestsService,
    @Inject('BASE_Files_URL') private baseFilesUrl: string,
    private viewportScroller: ViewportScroller,
    private router: Router,
    private externalAPIService: ExternalAPIService,
    private endPointService: EndPointsService,
    private usersService: UsersService,
    private serviceService: ServiceService,
    private DataSourceservice: DataSourcesService,
    private groupservice: GroupsService,
    private departmentsService: DepartmentsService,
    private lookupsService: LookupsService,
    private _formBuilder: FormBuilder) {

    this.serviceDetails = this.serviceService.selectedService;

  }


  async ngOnInit() {

    await (this.DataSourceservice.GetAllDataSources().subscribe(res => {

      this.allDataSources = res.data;
    }));



    this.serviceDetails = this.serviceService.selectedService;

    await this.lookupsService.GetAllApprovalsTypes().subscribe(res => {

      this.allApprovalTypes = res.data;
    });

    await this.groupservice.GetAllGroups().subscribe(res => {

      this.allGroups = res.data;
    });

    this.departmentsService.GetAllOSDepartments().subscribe(res => {

      this.allOSDepartments = res.data;
    });


    this.endPointService.GetAllEndPoints().subscribe(res => {

      this.externalDataSources_GetValue = res.data.filter(function (obj: { typeId: number; }) {
        return obj.typeId == 2;
      });

      this.externalDataSources_GetList = res.data.filter(function (obj: { typeId: number; }) {
        return obj.typeId == 3;
      });
    });

    this.requestDetails = this.requestsService.selectedRequest;
    this.serviceDetails = this.serviceService.selectedService;


    await this.requestsService.getRequestByID(this.requestDetails.requestId).subscribe(async res => {
      this.requestDetails = res.data;

      let emptyFormGroup: FormGroup[] = [];
      let emptyFormGroup2: FormGroup[] = [];
      this.RequestFormGroup = this._formBuilder.group({

        name: [this.requestDetails.form.name],
        RequestControls: this._formBuilder.array(emptyFormGroup),
        Phases: this._formBuilder.array(emptyFormGroup2),

      });



      this.loadDecisionsTypes();

      this.BindFormDataToFormGroup()

      // await (new Promise(resolve => {
      //   setTimeout(() =>
      //   , 1000)
      // }));          


    });

  }


  async BindFormDataToFormGroup() {

    if (this.allDataSources.length == 0) {
      await this.sleep(2000);
    }
    const arr = this.RequestFormGroup.get('RequestControls') as FormArray;

    for (let i = 0; i < this.requestDetails.form.formElements.length; i++) {
      let controlData = '';

      if (this.requestDetails.form.formElements[i].elementTypeID == 2) {
        this.requestDetails.requestElements[i].value =
          this.getDataSourceName(this.requestDetails.form.formElements[i].sourceID, this.requestDetails.requestElements[i].value);
      }

      if (this.requestDetails.form.formElements[i].elementTypeID >= 15 && this.requestDetails.form.formElements[i].elementTypeID <= 17) {
       
        await this.getListFromExternalApi(this.requestDetails.form.formElements[i].externalSourceID, this.requestDetails.form.formElements[i].elementTypeID);

      }


      if (this.externalDataSources_GetList == undefined || this.externalDataSources_GetList.length == 0) {
        await this.delay(3000);
      }
      let newFormGroup = new FormGroup({
        'controlData': new FormControl({value:this.requestDetails.requestElements[i].value, disabled: true}),
        'fileDirectory': new FormControl(this.baseFilesUrl + this.requestDetails.requestElements[i].value),
        'title': new FormControl(this.requestDetails.form.formElements[i].title),
        'elementTypeID': new FormControl(this.requestDetails.form.formElements[i].elementTypeID),
        'formElementID': new FormControl(this.requestDetails.form.formElements[i].id),
        'name': new FormControl('group'+this.requestDetails.form.formElements[i].id),
        'dataSourceID': new FormControl(this.requestDetails.form.formElements[i].sourceID),
        'externalSourceID': new FormControl(this.requestDetails.form.formElements[i].externalSourceID),
      });
      arr.push(newFormGroup);
    }


    if (this.requestDetails.assignedTasks != null && this.requestDetails.assignedTasks.find(x => x.isDone) != null) {
      this.thereIsDoneTasksToShow = true;
    }

    for (let i = 0; i < this.requestDetails.form.approvalsPhases.length; i++) {

      if (this.requestDetails.form.approvalsPhases[i].approvalTypeID == 1) {
        this.requestDetails.form.approvalsPhases[i].styleClass = 'request-flow-task-orange';

      }
      else if (this.requestDetails.form.approvalsPhases[i].approvalTypeID == 2) {

        this.requestDetails.form.approvalsPhases[i].styleClass = 'request-flow-task-blue';
      }
      else if (this.requestDetails.form.approvalsPhases[i].approvalTypeID == 3) {
        this.requestDetails.form.approvalsPhases[i].styleClass = 'request-flow-task-purple';
      }
      else if (this.requestDetails.form.approvalsPhases[i].approvalTypeID == 4) {
        this.requestDetails.form.approvalsPhases[i].styleClass = 'request-flow-task-Yellow';
      }
      else if (this.requestDetails.form.approvalsPhases[i].approvalTypeID == 5) {
        this.requestDetails.form.approvalsPhases[i].styleClass = 'request-flow-task-red';
      }
      else if (this.requestDetails.form.approvalsPhases[i].approvalTypeID == 7) {
        this.requestDetails.form.approvalsPhases[i].styleClass = 'request-flow-task-aqua';
      }
      else if (this.requestDetails.form.approvalsPhases[i].approvalTypeID == 8) {
        this.requestDetails.form.approvalsPhases[i].styleClass = 'request-flow-task-red';
      }

      if (this.requestDetails.currentPhaseId == 0) {
        let phaseDecision = this.requestDetails.assignedTasks.reverse().find(x => x.phaseId == this.requestDetails.form.approvalsPhases[i].id)?.decisionId;
        if (phaseDecision == 1) {
          this.requestDetails.form.approvalsPhases[i].styleClass += ' done-bg';
        }
        else if (phaseDecision == 2) {
          this.requestDetails.form.approvalsPhases[i].styleClass += ' rejected-bg';
        }
        else if (phaseDecision == 3) {
          this.requestDetails.form.approvalsPhases[i].styleClass += ' return-bg';
        }
        else if (phaseDecision == 4) {
          this.requestDetails.form.approvalsPhases[i].styleClass += ' cancel-bg';
        }


        if(this.requestDetails.form.approvalsPhases[i].approvalTypeID==8 && this.requestDetails.requestStatusId==2)
        {
          this.requestDetails.form.approvalsPhases[i].styleClass += ' done-bg';
        }

      }
      else if (this.requestDetails.currentPhaseId > this.requestDetails.form.approvalsPhases[i].id) {
        this.requestDetails.form.approvalsPhases[i].styleClass += ' done-bg';

      }
      else if (this.requestDetails.currentPhaseId == this.requestDetails.form.approvalsPhases[i].id) {
        this.requestDetails.form.approvalsPhases[i].styleClass += ' wait-bg';

      }
      else {
        //do nothing 
        // this.requestDetails.form.approvalsPhases[i].styleClass+=' wait-bg';

      }
    }

    this.isDataLoaded = true;

  }



  getControls(): FormGroup[] {
    return ((this.RequestFormGroup.get('RequestControls') as FormArray).controls as FormGroup[]);
  }




  getPhaseTypeName(id: number) {
    return this.allApprovalTypes.find(x => x.id === id)?.arName;
  }

  getPhaseName(id: number) {
    return this.requestDetails.form.approvalsPhases.find(x => x.id === id)?.name;
  }

  loadDecisionsTypes() {
    this.lookupsService.GetAllDecisionsTypes().subscribe(res => {
      this.allDecisionsTypes = res.data;

    });
  }


  getDecisionTypeName(id: number) {
    return this.allDecisionsTypes.find(x => x.id == id)?.arName;
  }

  getDepartmentName(id: number) {

    let depName = this.allOSDepartments.find(x => x.departmentId == id)?.departmentName;

    if (depName != '' && depName != undefined) {
      this.requestDetails.user.department = new DepartmentInfo();
      this.requestDetails.user.department.departmentName = depName;
      return depName;
    }
    return 'لايوجد';

  }


  // getDateRangeText(dateString:string)
  // {

  //   this.datePipe.transform(dateString.split(' ')[0], 'yyyy-MM-dd')+
  // }

  getGroupName(id: number) {
    return this.allGroups.find(x => x.id == id)?.arName;
  }





  getDataSourceName(sourceID: number, value: any): string {


    if (sourceID == null) return '';
    let items: ItemInfo[];
    items = this.allDataSources.find(x => x.id == sourceID)?.dataSourceItems as ItemInfo[];
    let name: any = items.find(x => x.id == value)?.arName;
    return name;
  }

  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getDataSource(sourceID: number): ItemInfo[] {


    if (sourceID == null) return [];
    let items: ItemInfo[];
    items = this.allDataSources.find(x => x.id == sourceID)?.dataSourceItems as ItemInfo[];
    return items;
  }




  onTypeUserName(event: KeyboardEvent) {

    var input = <HTMLInputElement>event.srcElement;
    if (input.value.length >= 3) {
      this.usersSearchDTO.name = input.value;
      this.usersService.GetAllUsers(this.usersSearchDTO).subscribe(res => {

        this.usersFiltered = res.body!.data;
      });
    }

  }




  showMessage(messageBody: string, messageType: string) {


    this.viewportScroller.scrollToAnchor('pageContainer');


    if (messageType == "success") {
      this.successMessage = messageBody;
      this.errorMessage = '';
    }
    else if (messageType == "error") {
      this.successMessage = '';
      this.errorMessage = messageBody;
    }
    else {
      this.successMessage = '';
      this.errorMessage = 'unknown error';
    }

    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 10000);
  }


  redirectToMyRequests() {
    this.router.navigate(['/home/my-requests']);
  }


  async getListFromExternalApi(externalSourceID: number, typeID: number) {


    console.log(externalSourceID);
    (await this.externalAPIService.getListFromExternalService(this.externalDataSources_GetList.find(x => x.id == externalSourceID)?.directory! + '123')).subscribe(res => {

      this.externalDatasourceListsDictionary.set(externalSourceID, res.data);
      console.log(res.data);
      return res.data;


    });
  }


  async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }




  // downloadFile(url: string, extension:string): Observable<Blob> {
  //   var result= this.httpClient.get(url, {responseType: 'blob' }).pipe(
  //     map(res => res),
  //     tap(blob => saveAs(blob, 'download.'+extension))
  //   )

  //   result.subscribe(res => {
  //     return this.download(res.arrayBuffer, 'image/jpg', 'download.' + extension);
  //   });

  //   return result;
  // }

  // downloadFile(url:string,extension:string) {

  //   this.getFile(url,extension).subscribe(
  //     (response: ArrayBuffer) => this.download(response, 'application/'+extension, 'download.'+extension)
  //   );

  // }


  // getFile(url:string,extension:string)
  // {
  //   return this.httpClient.get(url, {
  //     responseType: 'arraybuffer',
  //     headers: new HttpHeaders().append('Content-Type', 'application/'+extension),
  //   });
  // }

  // download(binaryData: ArrayBuffer, fileType: string, fileName: string): void {
  //   const file: Blob = new Blob([binaryData], {type: fileType});
  //   const url: string = window.URL.createObjectURL(file);
  //   const anchorElement: HTMLAnchorElement = document.createElement('a');
  //   anchorElement.download = fileName;
  //   anchorElement.href = url;
  //   anchorElement.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));
  // }





}
