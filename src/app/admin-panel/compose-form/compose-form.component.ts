
import { StepperOrientation, StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ServiceService } from 'src/app/Services/Services.Service';
import { DataSourcesService } from 'src/app/Services/dataSources.Service';
import { DepartmentsService } from 'src/app/Services/departments.Service';
import { FormsService } from 'src/app/Services/form.service';
import { GroupsService } from 'src/app/Services/groups.service';
import { LookupsService } from 'src/app/Services/lookUps.service';
import { ActionResult } from 'src/app/models/ActionResult.model';
import { ApprovalTypeInfo } from 'src/app/models/ApprovalTypeInfo.model';
import { ApprovalsPhaseInfo } from 'src/app/models/ApprovalsPhaseInfo.model';
import { DataSourceInfo } from 'src/app/models/DataSourceInfo.model';
import { DecisionsTypeInfo } from 'src/app/models/DecisionsTypeInfo.model';
import { DepartmentInfo } from 'src/app/models/DepartmentInfo.model';
import { ElementsTypeInfo } from 'src/app/models/ElementsTypeInfo.model';
import { FormElementInfo } from 'src/app/models/FormElementInfo.model';
import { FormInfo } from 'src/app/models/FormInfo.model';
import { GroupInfo } from 'src/app/models/GroupInfo.model';
import { ServiceInfo } from 'src/app/models/ServiceInfo.model';
import { ChangeDetectorRef } from '@angular/core';
import { ItemInfo } from 'src/app/models/ItemInfo.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { PhaseDecisionInfo } from 'src/app/models/PhaseDecisionInfo.model';
import { ViewportScroller } from '@angular/common';
import { MatStepper } from '@angular/material/stepper';
import { EndPointsService } from 'src/app/Services/endPoints.service';
import { EndPointInfo } from 'src/app/models/EndPointInfo.model';
import { ExternalAPIService } from 'src/app/Services/externalAPIService.service';



@Component({
  selector: 'app-compose-form',
  templateUrl: './compose-form.component.html',
  styleUrls: ['../../app.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComposeFormComponent implements OnInit {




  drop(event: CdkDragDrop<string[]>) {

    moveItemInArray(this.addedPhases, event.previousIndex, event.currentIndex);

    this.addedPhases[0].phaseDecisions

    this.RemoveDecisionOption(3, this.addedPhases[0].name);


  }



  selectedApprovalType!: number;

  @Input() serviceDetails: ServiceInfo = new ServiceInfo();


  id: number = -1;
  isLoading!: boolean;
  orientation: StepperOrientation = 'vertical';
  FormCompleted: boolean = true;
  controlsToDraw!: FormGroup[];
  disabled = true;

  allDecisionsTypes: DecisionsTypeInfo[] = [];
  allApprovalTypes: ApprovalTypeInfo[] = [];
  allElementsTypes: ElementsTypeInfo[] = [];
  allGroups: GroupInfo[] = [];
  allOSDepartments: DepartmentInfo[] = [];
  allDataSources: DataSourceInfo[] = [];


  externalDataSources_Post: EndPointInfo[] = [];
  externalDataSources_GetValue: EndPointInfo[] = [];
  externalDataSources_GetList: EndPointInfo[] = [];

  addedPhases: ApprovalsPhaseInfo[] = [];
  addedFormElements: FormElementInfo[] = [];


  errorMessage: string = "";
  successMessage: string = "";

  starRating = 0;

  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  approvalPhaseForm!: FormGroup;
  firstFormGroup!: FormGroup;



  constructor(
    //private cdRef: ChangeDetectorRef,
    private DataSourceservice: DataSourcesService,
    // private externalAPIService: ExternalAPIService,
    private endPointsService: EndPointsService,
    private groupservice: GroupsService,
    private departmentsService: DepartmentsService,
    private serviceService: ServiceService,
    private lookupsService: LookupsService,
    private formService: FormsService,
    private route: ActivatedRoute, private router: Router,
    private viewportScroller: ViewportScroller,
    private _formBuilder: FormBuilder) {



  }




  ngOnInit() {




    let emptyFormGroup: FormGroup[] = [];
    this.firstFormGroup = this._formBuilder.group({

      name: [this.serviceService.selectedService.name + ' ' + this.getTodayAsString() + ' ' + this.makeid(3),
      Validators.compose([
        Validators.required,
        Validators.maxLength(200),
        // Validators.minLength(4),
      ])],
      addedControls: this._formBuilder.array(emptyFormGroup)

    });




    this.DataSourceservice.GetAllDataSources().subscribe(res => {

      this.allDataSources = res.data;
    });

    this.endPointsService.GetAllEndPoints().subscribe(res => {

      this.externalDataSources_Post = res.data.filter(function (obj: { typeId: number; }) {
        return obj.typeId == 1;
      });

      this.externalDataSources_GetValue = res.data.filter(function (obj: { typeId: number; }) {
        return obj.typeId == 2;
      });

      this.externalDataSources_GetList = res.data.filter(function (obj: { typeId: number; }) {
        return obj.typeId == 3;
      });
    });

    this.serviceDetails = this.serviceService.selectedService;

    if (this.serviceDetails.name === '' || this.serviceDetails.name === undefined) {
      this.isLoading = true;
      setTimeout(() => {
        this.router.navigate(['/admin-panel/manage-services']);
      }, 200);

    }

    this.lookupsService.GetAllApprovalsTypes().subscribe(res => {

      this.allApprovalTypes = res.data;
    });

    this.groupservice.GetAllGroups().subscribe(res => {

      this.allGroups = res.data;
    });

    this.loadDecisionsTypes();


    this.approvalPhaseForm = this._formBuilder.group({
      name: [''],
      ApprovalTypeID: [''],
      groupID: [''],
      departmentID: [''],
      endPointID: ['']
    });




    this.departmentsService.GetAllOSDepartments().subscribe(res => {

      this.allOSDepartments = res.data;
    });


    this.lookupsService.GetAllElementsTypes().subscribe(res => {
      this.allElementsTypes = res.data;
    });




    let element: FormElementInfo = new FormElementInfo();
    element.elementTypeID = 1;
    element.elementTypeName = '';
    element.sourceID = 1;
    element.isMandatory = false;




    // this.subscription = this.formService.FormsChanged.subscribe(
    //   {
    //     next: (response =>


    //     ),
    //     error: (
    //       error => { 

    //       }
    //     ),
    //     complete: () => { }


    //   }


    // );

  }

  showFormReview(event: StepperSelectionEvent) {


    //if (this.addedPhases.length > 0) {


    this.controlsToDraw = this.getControls();

    // }
    // else {

    // }

    // if (event.previouslySelectedIndex == 2) {
    //   this.FormCompleted = false;
    // }

  }






  // stepChanged(event, stepper){
  //   stepper.selected.interacted = false;
  // }


  ChangeStepperMode() {
    if (this.orientation == 'vertical') {
      this.orientation = 'horizontal';
    }
    else {
      this.orientation = 'vertical';
    }

  }

  openAddApprovalPhaseModal() {
    var modal = document.getElementById("model_AddApprovalPhase")!;
    modal.style.display = 'block';
  }

  closeAddApprovalPhaseModal(): void {
    var modal = document.getElementById("model_AddApprovalPhase")!;
    modal.style.display = 'none';
  }


  onAddApprovalPhase() {
    // this.cdRef.detectChanges();

    let newPhase = new ApprovalsPhaseInfo();

    newPhase.name = this.approvalPhaseForm.get("name")?.value;


    //check if there is added phase with same name
    if (this.addedPhases.find(x => x.name == newPhase.name)) {
      alert("مرحلة بنفس الاسم مضافة سابقا");
      return;
    }

    newPhase.approvalTypeID = this.approvalPhaseForm.get("ApprovalTypeID")?.value;


    if (this.approvalPhaseForm.get("name")?.value == '' || this.approvalPhaseForm.get("ApprovalTypeID")?.value === null) {

      return;
    }



    if (newPhase.approvalTypeID == 1) {
      if (this.approvalPhaseForm.get("groupID")!.value == '' || this.approvalPhaseForm.get("groupID")!.value === null) return;
      newPhase.groupID = this.approvalPhaseForm.get("groupID")!.value;
      newPhase.styleClass = 'request-flow-task-orange';
    }
    else if (newPhase.approvalTypeID == 2) {
      if (this.approvalPhaseForm.get("departmentID")!.value == '' || this.approvalPhaseForm.get("departmentID")!.value === null) return;
      newPhase.departmentID = this.approvalPhaseForm.get("departmentID")!.value;
      newPhase.styleClass = 'request-flow-task-blue';
    }
    else if (newPhase.approvalTypeID == 3) {
      newPhase.styleClass = 'request-flow-task-purple';
    }
    else if (newPhase.approvalTypeID == 4) {
      newPhase.styleClass = 'request-flow-task-Yellow';
    }
    else if (newPhase.approvalTypeID == 8) {
      if (this.approvalPhaseForm.get("endPointID")!.value == '' || this.approvalPhaseForm.get("endPointID")!.value === null) return;
      newPhase.endPointId = this.approvalPhaseForm.get("endPointID")!.value;
      newPhase.styleClass = 'request-flow-task-red';
    }

    let newPhaseDecision: PhaseDecisionInfo;


    newPhase.phaseDecisions = [];

    if (newPhase.approvalTypeID != 8) {
      for (let i = 0; i < this.allDecisionsTypes.length; i++) {

        if (this.addedPhases.length == 0 && this.allDecisionsTypes[i].name == 'Return') {
          continue;
        }

        newPhaseDecision = new PhaseDecisionInfo();
        newPhaseDecision.decisionId = this.allDecisionsTypes[i].id;
        newPhase.phaseDecisions.push(newPhaseDecision);
      }
    }

    this.addedPhases.push(newPhase);

    this.approvalPhaseForm.reset();
    //this.cdRef.detectChanges();
    this.closeAddApprovalPhaseModal();
  }

  deletePhase(phase: ApprovalsPhaseInfo) {
    this.addedPhases = this.addedPhases.filter(function (obj) {
      return obj.name !== phase.name;
    });
  }

  getPhaseName(id: number) {
    return this.allApprovalTypes.find(x => x.id === id)?.arName;
  }

  getDepartmentName(id: number) {
    return this.allOSDepartments.find(x => x.departmentId == id)?.departmentName;
  }

  getGroupName(id: number) {
    return this.allGroups.find(x => x.id == id)?.arName;
  }

  getEndPointName(id: number) {
    this.externalDataSources_Post.find(x => x.id = id)?.name;
  }


  loadDecisionsTypes() {
    this.lookupsService.GetAllDecisionsTypes().subscribe(res => {
      this.allDecisionsTypes = res.data;

    });
  }

  GetAllApprovalsTypes() {
    this.lookupsService.GetAllApprovalsTypes().subscribe(res => {
      this.allApprovalTypes = res.data;

    });
  }

  GetAllElementsTypes() {
    this.lookupsService.GetAllElementsTypes().subscribe(res => {
      this.allElementsTypes = res.data;

    });
  }


  AddElementType(elementTypeid: number) {

    let element: FormElementInfo = new FormElementInfo();
    element.elementTypeID = elementTypeid;
    element.elementTypeName = this.allElementsTypes.find(x => x.id == elementTypeid)!.arName;
    element.sourceID = 1;
    element.isMandatory = false;



    let newFormGroup = new FormGroup({
      'title': new FormControl(''),
      'elementTypeID': new FormControl(elementTypeid),
      'elementTypeName': new FormControl(element.elementTypeName),
      'isMandatory': new FormControl(false),
      'dataSourceID': new FormControl(null),
      'externalDataSourceID': new FormControl(null)
    });

    const arr = this.firstFormGroup.get('addedControls') as FormArray;

    arr.push(newFormGroup);


    // this.cdRef.detectChanges();

  }


  getControls(): FormGroup[] {
    return ((this.firstFormGroup.get('addedControls') as FormArray).controls as FormGroup[]);
  }


  getAssignedDataSource(sourceID: number): ItemInfo[] {


    if (sourceID == null) return [];
    let items: ItemInfo[];
    items = this.allDataSources.find(x => x.id == sourceID)?.dataSourceItems as ItemInfo[];
    return items;
  }

  getExternalDataSourceName_listSources(id: number) {
    return this.externalDataSources_GetList.find(x => x.id == id)?.name;
  }

  getExternalDataSourceName_ValueSources(id: number) {
    return this.externalDataSources_GetValue.find(x => x.id == id)?.name;
  }


  saveForm(stepper: MatStepper, goOnline: boolean) {

    //this.isLoading = true;

    let newform: FormInfo = new FormInfo();
    newform.name = this.firstFormGroup.value.name;
    newform.serviceID = this.serviceDetails.id;
    newform.isActive = false;
    newform.formElements = [];
    newform.approvalsPhases = [];
    newform.createdOn = new Date();
    newform.createdBy = '';
    newform.goLive = goOnline;


    let newFormElement: FormElementInfo;
    let newPhase: ApprovalsPhaseInfo;
    let newPhaseDecision: PhaseDecisionInfo;
    let formElements: FormGroup[] = this.getControls();

    for (let i = 0; i < formElements.length; i++) {
      newFormElement = new FormElementInfo();
      newFormElement.elementTypeID = formElements[i].controls['elementTypeID'].value;
      newFormElement.title = formElements[i].controls['title'].value;
      newFormElement.isMandatory = formElements[i].controls['isMandatory'].value;
      newFormElement.sourceID = formElements[i].controls['dataSourceID'].value;
      newFormElement.externalSourceID = formElements[i].controls['externalDataSourceID'].value;
      if (newFormElement.sourceID == 0) {
        newFormElement.sourceID = null!;
      }
      newform.formElements.push(newFormElement);
    }


    for (let i = 0; i < this.addedPhases.length; i++) {
      newPhase = new ApprovalsPhaseInfo();
      newPhase.approvalTypeID = this.addedPhases[i].approvalTypeID;
      newPhase.departmentID = this.addedPhases[i].departmentID;
      newPhase.groupID = this.addedPhases[i].groupID;
      newPhase.name = this.addedPhases[i].name;
      newPhase.PhaseTimingTypeId = 1;

      if (newPhase.approvalTypeID == 8) {
        newPhase.endPointId = this.addedPhases[i].endPointId;
      }
      if (!Number(newPhase.departmentID)) {
        newPhase.departmentID = null!;
      }

      if (!Number(newPhase.groupID)) {
        newPhase.groupID = null!;
      }

      newPhase.phaseDecisions = [];
      for (let j = 0; j < this.addedPhases[i].phaseDecisions.length; j++) {
        newPhaseDecision = new PhaseDecisionInfo();
        newPhaseDecision.decisionId = this.addedPhases[i].phaseDecisions[j].decisionId;
        newPhase.phaseDecisions.push(newPhaseDecision);
      }


      newform.approvalsPhases.push(newPhase);
    }





    let observable: Observable<ActionResult>;
    observable = this.formService.AddForm(newform);


    observable.subscribe(
      responseDate => {

        this.showMessage(responseDate.resultMessage, 'success');
        this.isLoading = false;
        setTimeout(() => {
          if(goOnline)
          {
            this.router.navigate(['/home/my-services']);
          }
          else{
          this.router.navigate(['/admin-panel/manage-services']);
          }
        }, 2500);

      },
      resultError => {
        this.showMessage(resultError.resultMessage, 'error');

        this.isLoading = false;
      }
    );



  }






  deleteElementType(index: number) {
    const arr = this.firstFormGroup.get('addedControls') as FormArray;

    arr.removeAt(index);
  }


  private HandleResponse(observable: Observable<ActionResult>) {
    observable.subscribe(
      responseDate => {

        this.showMessage(responseDate.resultMessage, 'success');
        this.isLoading = false;



      },
      resultError => {
        this.showMessage(resultError.resultMessage, 'error');

        this.isLoading = false;
      }
    );
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

  existInThePhase(dicisionTypeId: number, phaseName: string) {


    let phase: ApprovalsPhaseInfo = this.addedPhases.find(x => x.name == phaseName)!;
    if (phase.phaseDecisions == undefined || phase.phaseDecisions.length == 0) {
      return false;
    }
    for (let i = 0; i < phase.phaseDecisions.length; i++) {
      if (phase.phaseDecisions[i].decisionId == dicisionTypeId) {
        return true;
      }
    }
    return false;
  }


  RemoveDecisionOption(dicisionTypeId: number, phaseName: string) {
    let phase: ApprovalsPhaseInfo = this.addedPhases.find(x => x.name == phaseName)!;

    if (phase.phaseDecisions == undefined) {
      return false;
    }

    if (dicisionTypeId == 1) {

      // this.showMessage("لايمكنك حذف خاصية اعتماد من المرحلة", "error");

      return false;
    }

    phase.phaseDecisions = phase.phaseDecisions.filter(function (obj) {
      return obj.decisionId !== dicisionTypeId;
    });


    return true;

  }


  AddDecisionOption(dicisionTypeId: number, phaseName: string) {




    let phase: ApprovalsPhaseInfo = this.addedPhases.find(x => x.name == phaseName)!;

    if (phase.phaseDecisions == undefined) {
      return false;
    }

    if (this.addedPhases[0].name == phaseName && dicisionTypeId == 3) {

      this.showMessage("لايمكنك إضافة إرجاع في المهمة الأولى", "error");

      return false;
    }

    let newPhaseDecision = new PhaseDecisionInfo();
    newPhaseDecision.decisionId = dicisionTypeId;


    phase.phaseDecisions.push(newPhaseDecision);

    return true;

  }



  getTodayAsString() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1 + ''; // Months start at 0!
    let dd = today.getDate() + '';

    if (today.getDate() < 10) dd = '0' + dd;
    if (today.getMonth() < 10) mm = '0' + mm;

    return dd + '/' + mm + '/' + yyyy;
  }

  makeid(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

}