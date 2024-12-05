import { ViewportScroller } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ServiceService } from 'src/app/Services/Services.Service';
import { DataSourcesService } from 'src/app/Services/dataSources.Service';
import { DepartmentsService } from 'src/app/Services/departments.Service';
import { ExternalAPIService } from 'src/app/Services/externalAPIService.service';
import { FormsService } from 'src/app/Services/form.service';
import { GroupsService } from 'src/app/Services/groups.service';
import { LookupsService } from 'src/app/Services/lookUps.service';
import { RequestsService } from 'src/app/Services/request.Service';
import { TasksService } from 'src/app/Services/tasks.service';
import { UsersService } from 'src/app/Services/users.service';
import { ActionResult } from 'src/app/models/ActionResult.model';
import { ApprovalTypeInfo } from 'src/app/models/ApprovalTypeInfo.model';
import { DataSourceInfo } from 'src/app/models/DataSourceInfo.model';
import { DecisionsTypeInfo } from 'src/app/models/DecisionsTypeInfo.model';
import { DepartmentInfo } from 'src/app/models/DepartmentInfo.model';
import { ElementsTypeInfo } from 'src/app/models/ElementsTypeInfo.model';
import { EndPointInfo } from 'src/app/models/EndPointInfo.model';
import { FFRequestInfo } from 'src/app/models/FFRequestInfo.model';
import { FormInfo } from 'src/app/models/FormInfo.model';
import { GroupInfo } from 'src/app/models/GroupInfo.model';
import { ItemInfo } from 'src/app/models/ItemInfo.model';
import { SearchUsersDTO } from 'src/app/models/SearchUsersDTO.model';
import { ServiceInfo } from 'src/app/models/ServiceInfo.model';
import { TaskInfo } from 'src/app/models/TaskInfo.model';
import { UpdateTaskDTO } from 'src/app/models/UpdateTaskDTO.model';
import { UserInfo } from 'src/app/models/UserInfo.model';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  // styleUrls: ['./task-details.component.css']
  styleUrls: ['../../app.component.css']
})
export class TaskDetailsComponent implements OnInit {

  @Input() serviceDetails: ServiceInfo = new ServiceInfo();
  @Input() requestDetails: FFRequestInfo = new FFRequestInfo();
  @Input() taskDetails: TaskInfo = new TaskInfo();

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
  phaseName: string = '';
  showApproveButton: boolean = false;
  showRejectButton: boolean = false;
  showCancelButton: boolean = false;
  showReturnButton: boolean = false;
  thereIsDoneTasksToShow: boolean = false;
  externalDatasourceListsDictionary = new Map<number, ItemInfo[]>();
  externalDataSources_GetValue: EndPointInfo[] = [];
  externalDataSources_GetList: EndPointInfo[] = [];

  notes: string = '';
  constructor(
    private tasksService: TasksService,
    @Inject('BASE_Files_URL') private baseFilesUrl: string,
    private requestsService: RequestsService,
    private viewportScroller: ViewportScroller,
    private externalAPIService: ExternalAPIService,
    private router: Router,
    private usersService: UsersService,
    private serviceService: ServiceService,
    private DataSourceservice: DataSourcesService,
    private groupservice: GroupsService,
    private departmentsService: DepartmentsService,
    private lookupsService: LookupsService,
    private _formBuilder: FormBuilder) {

    this.serviceDetails = this.serviceService.selectedService;
    this.taskDetails = this.tasksService.selectedTask;

  }


  ngOnInit() {

    this.DataSourceservice.GetAllDataSources().subscribe(res => {

      this.allDataSources = res.data;
    });

    this.serviceDetails = this.serviceService.selectedService;

    this.lookupsService.GetAllApprovalsTypes().subscribe(res => {

      this.allApprovalTypes = res.data;
    });

    this.groupservice.GetAllGroups().subscribe(res => {

      this.allGroups = res.data;
    });

    this.departmentsService.GetAllOSDepartments().subscribe(res => {

      this.allOSDepartments = res.data;
    });

    this.requestDetails = this.requestsService.selectedRequest;
    this.serviceDetails = this.serviceService.selectedService;


    this.requestsService.getRequestByID(this.requestDetails.requestId).subscribe(res => {
      this.requestDetails = res.data;

      let emptyFormGroup: FormGroup[] = [];
      let emptyFormGroup2: FormGroup[] = [];
      this.RequestFormGroup = this._formBuilder.group({

        name: [this.requestDetails.form.name],
        RequestControls: this._formBuilder.array(emptyFormGroup),
        Phases: this._formBuilder.array(emptyFormGroup2),

      });

      console.log(this.requestDetails.form);

      this.BindFormDataToFormGroup();

      this.loadDecisionsTypes();

      this.isDataLoaded = true;
 

    });


    let taskObservable: Observable<ActionResult>;
    taskObservable = this.tasksService.GetTaskByID(this.tasksService.selectedTask.taskId);

    taskObservable.subscribe(
      responseDate => {

        this.taskDetails = responseDate.data;

        this.phaseName = this.taskDetails.phase.name;

        if (this.taskDetails.phase.phaseDecisions.find(x => x.decisionId == 1) != undefined) {
          this.showApproveButton = true;
        }
        if (this.taskDetails.phase.phaseDecisions.find(x => x.decisionId == 2) != undefined) {
          this.showRejectButton = true;

        }
        if (this.taskDetails.phase.phaseDecisions.find(x => x.decisionId == 3) != undefined) {
          this.showReturnButton = true;
        }
        if (this.taskDetails.phase.phaseDecisions.find(x => x.decisionId == 4) != undefined) {
          this.showCancelButton = true;
        }

      },
      resultError => {
        this.showMessage('حصل خطأ غير متوقع', 'error');

        this.isLoading = false;
      }
    );

  }

  sleep(ms:number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }



  async BindFormDataToFormGroup() {

    if(this.allDataSources.length==0)
    {
      await this.sleep(2000);
    }
    const arr = this.RequestFormGroup.get('RequestControls') as FormArray;

    for (let i = 0; i < this.requestDetails.form.formElements.length; i++) {
      let controlData = '';

      if (this.requestDetails.form.formElements[i].elementTypeID == 2) {
        this.requestDetails.requestElements[i].value =
          this.getDataSourceName(this.requestDetails.form.formElements[i].sourceID, this.requestDetails.requestElements[i].value);
      }
      let newFormGroup = new FormGroup({
        'controlData': new FormControl({value:this.requestDetails.requestElements[i].value, disabled: true}),
        'fileDirectory': new FormControl(this.baseFilesUrl+this.requestDetails.requestElements[i].value),
        'title': new FormControl(this.requestDetails.form.formElements[i].title),
        'elementTypeID': new FormControl(this.requestDetails.form.formElements[i].elementTypeID),
        'formElementID': new FormControl(this.requestDetails.form.formElements[i].id),
        'name': new FormControl('group'+this.requestDetails.form.formElements[i].id),
        'dataSourceID': new FormControl(this.requestDetails.form.formElements[i].sourceID)
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
      

      
      if (this.requestDetails.currentPhaseId > this.requestDetails.form.approvalsPhases[i].id) {
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
      }
      else if (this.requestDetails.currentPhaseId == this.requestDetails.form.approvalsPhases[i].id) {
        this.requestDetails.form.approvalsPhases[i].styleClass += ' wait-bg';

      }
      else {

      }
    }


  }



  getControls(): FormGroup[] {
    return ((this.RequestFormGroup.get('RequestControls') as FormArray).controls as FormGroup[]);
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
    return this.allOSDepartments.find(x => x.departmentId == id)?.departmentName;
  }

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


  ApproveRequest(decisionID: number) {
    let dto: UpdateTaskDTO = new UpdateTaskDTO();
    dto.taskID = this.taskDetails.taskId;
    dto.notes = this.notes;
    dto.decisionID = decisionID;


    let observable: Observable<ActionResult>;
    observable = this.tasksService.UpdateTask(dto);

    observable.subscribe(
      responseDate => {

        this.showMessage(responseDate.resultMessage, 'success');
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/home/my-tasks']);
        }, 2500);

      },
      resultError => {
        this.showMessage(resultError.resultMessage, 'error');

        this.isLoading = false;
      }
    );

  }
  redirectToMyTasks() {
    this.router.navigate(['/home/my-tasks']);
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





}
