import { DatePipe, ViewportScroller } from '@angular/common';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ServiceService } from 'src/app/Services/Services.Service';
import { DataSourcesService } from 'src/app/Services/dataSources.Service';
import { DepartmentsService } from 'src/app/Services/departments.Service';
import { EndPointsService } from 'src/app/Services/endPoints.service';
import { ExternalAPIService } from 'src/app/Services/externalAPIService.service';
import { FormsService } from 'src/app/Services/form.service';
import { GroupsService } from 'src/app/Services/groups.service';
import { LookupsService } from 'src/app/Services/lookUps.service';
import { RequestsService } from 'src/app/Services/request.Service';
import { UsersService } from 'src/app/Services/users.service';
import { ActionResult } from 'src/app/models/ActionResult.model';
import { ApprovalTypeInfo } from 'src/app/models/ApprovalTypeInfo.model';
import { AttachmentInfo } from 'src/app/models/Attachment.model';
import { DataSourceInfo } from 'src/app/models/DataSourceInfo.model';
import { DecisionsTypeInfo } from 'src/app/models/DecisionsTypeInfo.model';
import { DepartmentInfo } from 'src/app/models/DepartmentInfo.model';
import { ElementsTypeInfo } from 'src/app/models/ElementsTypeInfo.model';
import { EndPointInfo } from 'src/app/models/EndPointInfo.model';
import { FFRequestInfo } from 'src/app/models/FFRequestInfo.model';
import { FormInfo } from 'src/app/models/FormInfo.model';
import { GroupInfo } from 'src/app/models/GroupInfo.model';
import { ItemInfo } from 'src/app/models/ItemInfo.model';
import { RequestElementInfo } from 'src/app/models/RequestElementInfo.model';
import { SearchUsersDTO } from 'src/app/models/SearchUsersDTO.model';
import { ServiceInfo } from 'src/app/models/ServiceInfo.model';
import { UserInfo } from 'src/app/models/UserInfo.model';


export class checkboxSelection {
  FormElementID!: number;
  selectedValueID!: number;
}

export class ExternalCheckboxSelection {
  FormElementID!: number;
  name!: string;
}

@Component({
  selector: 'app-apply-request',
  templateUrl: './apply-request.component.html',
  // styleUrls: ['./apply-request.component.css']
  styleUrls: ['../../app.component.css']
})
export class ApplyRequestComponent implements OnInit {

  @Input() serviceDetails: ServiceInfo = new ServiceInfo();
  formDetails: FormInfo = new FormInfo();
  RequestFormGroup!: FormGroup;
  allDecisionsTypes: DecisionsTypeInfo[] = [];
  allApprovalTypes: ApprovalTypeInfo[] = [];
  allElementsTypes: ElementsTypeInfo[] = [];
  allGroups: GroupInfo[] = [];
  allOSDepartments: DepartmentInfo[] = [];
  allDataSources: DataSourceInfo[] = [];
  isDataLoaded: boolean = false;
  defaultselected: number = -1;
  requestAttachments: AttachmentInfo[] = [];
  srcResultsDic: Map<string, any> = new Map<string, any>;
  filesNamesDic: Map<string, string> = new Map<string, string>;
  usersSearchDTO: SearchUsersDTO = new SearchUsersDTO();
  usersFiltered: UserInfo[] = [];
  isLoading!: boolean;
  errorMessage: string = '';
  successMessage: string = '';

  CheckBoxesSelectedValues: checkboxSelection[] = [];
  ExternalCheckBoxesSelectedValues: ExternalCheckboxSelection[] = [];

  externalDataSources_GetValue: EndPointInfo[] = [];
  externalDataSources_GetList: EndPointInfo[] = [];



  externalDatasourceValuesDictionary = new Map<number, string>();
  externalDatasourceListsDictionary = new Map<number, ItemInfo[]>();



  callnumber: number = 0;

  constructor(
    private requestsService: RequestsService,
    private elementRef: ElementRef,
    private viewportScroller: ViewportScroller,
    private externalAPIService: ExternalAPIService,
    private endPointService: EndPointsService,
    private router: Router,
    private datePipe: DatePipe,
    private usersService: UsersService,
    private serviceService: ServiceService,
    private formService: FormsService,
    private DataSourceservice: DataSourcesService,
    private groupservice: GroupsService,
    private departmentsService: DepartmentsService,
    private lookupsService: LookupsService,
    private _formBuilder: FormBuilder) {


    this.serviceDetails = this.serviceService.selectedService;



  }


  async ngOnInit() {


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


    this.lookupsService.GetAllElementsTypes().subscribe(res => {
      this.allElementsTypes = res.data;
    });


    this.endPointService.GetAllEndPoints().subscribe(res => {

      this.externalDataSources_GetValue = res.data.filter(function (obj: { typeId: number; }) {
        return obj.typeId == 2;
      });

      this.externalDataSources_GetList = res.data.filter(function (obj: { typeId: number; }) {
        return obj.typeId == 3;
      });
    });


    if (this.externalDataSources_GetList == undefined || this.externalDataSources_GetList.length == 0) {
      await this.delay(1000);
    }

    this.formService.GetFormByID(this.serviceDetails.formID).subscribe(res => {

      this.formDetails = res.data;
      let emptyFormGroup: FormGroup[] = [];
      let emptyFormGroup2: FormGroup[] = [];
      this.RequestFormGroup = this._formBuilder.group({

        name: [this.formDetails.name,
        Validators.compose([
          Validators.required,
          Validators.maxLength(200),

        ])],

        RequestControls: this._formBuilder.array(emptyFormGroup),
        Phases: this._formBuilder.array(emptyFormGroup2),

      });

      

      this.BindFormDataToFormGroup();

      this.isDataLoaded = true;

    });



  }



  async BindFormDataToFormGroup() {


    const arr = this.RequestFormGroup.get('RequestControls') as FormArray;

    let fromDateToDate: FormGroup = new FormGroup({
      start: new FormControl<Date>(new Date()),
      end: new FormControl<Date>(new Date())
    });



    for (let i = 0; i < this.formDetails.formElements.length; i++) {
      let isRequired: boolean = this.formDetails.formElements[i].isMandatory;

      if (this.formDetails.formElements[i].elementTypeID == 10) {

        fromDateToDate = new FormGroup({
          start: new FormControl<Date>(new Date()),
          end: new FormControl<Date>(new Date())
        },
          isRequired ? Validators.required : null
        );
      }
      let dataSourceTemp1 = null;
      let hasSource = false;

      if (this.formDetails.formElements[i].elementTypeID == 2 || this.formDetails.formElements[i].elementTypeID == 3 || this.formDetails.formElements[i].elementTypeID == 4) {

        dataSourceTemp1 = this.allDataSources.find(x => x.id == this.formDetails.formElements[i].sourceID);
        hasSource = true;
      }


      if (this.formDetails.formElements[i].elementTypeID == 14) {

        await this.getValueFromExternalApi(this.formDetails.formElements[i].externalSourceID, 14);

      }

      if (this.formDetails.formElements[i].elementTypeID >= 15 && this.formDetails.formElements[i].elementTypeID <= 17) {
console.log(this.externalDataSources_GetList);
        await this.getListFromExternalApi(this.formDetails.formElements[i].externalSourceID, 15);

      }
      let newFormGroup = this._formBuilder.group({
        'fromDateToDateControlData': [fromDateToDate],
        'controlData': (isRequired && this.formDetails.formElements[i].elementTypeID != 10) ? new FormControl('', Validators.required) : new FormControl(''),
        'title': new FormControl(this.formDetails.formElements[i].title),
        'elementTypeID': new FormControl(this.formDetails.formElements[i].elementTypeID),
        'formElementID': new FormControl(this.formDetails.formElements[i].id),
        'name': new FormControl('group'+this.formDetails.formElements[i].id),
        'isMandatory': new FormControl(this.formDetails.formElements[i].isMandatory),
        'dataSourceID': new FormControl(this.formDetails.formElements[i].sourceID),
        'externalSourceID': new FormControl(this.formDetails.formElements[i].externalSourceID),
        'dataSource': hasSource ? dataSourceTemp1 : [],
        'CheckBoxSelectedValues': new FormControl('')
      });


      if (this.formDetails.approvalsPhases.length > 0) {
        for (let i = 0; i < this.formDetails.approvalsPhases.length; i++) {

          if (this.formDetails.approvalsPhases[i].approvalTypeID == 1) {
            this.formDetails.approvalsPhases[i].styleClass = 'request-flow-task-orange';

          }
          else if (this.formDetails.approvalsPhases[i].approvalTypeID == 2) {

            this.formDetails.approvalsPhases[i].styleClass = 'request-flow-task-blue';
          }
          else if (this.formDetails.approvalsPhases[i].approvalTypeID == 3) {
            this.formDetails.approvalsPhases[i].styleClass = 'request-flow-task-purple';
          }
          else if (this.formDetails.approvalsPhases[i].approvalTypeID == 4) {
            this.formDetails.approvalsPhases[i].styleClass = 'request-flow-task-Yellow';
          }
          else if (this.formDetails.approvalsPhases[i].approvalTypeID == 5) {
            this.formDetails.approvalsPhases[i].styleClass = 'request-flow-task-red';
          }
          else if (this.formDetails.approvalsPhases[i].approvalTypeID == 7) {
            this.formDetails.approvalsPhases[i].styleClass = 'request-flow-task-aqua';
          }
          else if (this.formDetails.approvalsPhases[i].approvalTypeID == 8) {
            this.formDetails.approvalsPhases[i].styleClass = 'request-flow-task-red';
          }


        }
      }

      arr.push(newFormGroup);
    }

  }



  getControls(): FormGroup[] {
    return ((this.RequestFormGroup.get('RequestControls') as FormArray).controls as FormGroup[]);
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


  getDataSource(sourceID: number): ItemInfo[] {

    console.log('getDataSource');

    if (sourceID == null) return [];
    let items: ItemInfo[];
    items = this.allDataSources.find(x => x.id == sourceID)?.dataSourceItems as ItemInfo[];
    return items;
  }

  onFileSelected(event: any, id: string) {

    console.log('onFileSelected');
    const inputNode: any = document.querySelector('#' + id);

    if (id.startsWith('file') &&
      inputNode.files[0].name.split('.')[1] != 'pdf' &&
      inputNode.files[0].name.split('.')[1] != 'docx' &&
      inputNode.files[0].name.split('.')[1] != 'doc' &&
      inputNode.files[0].name.split('.')[1] != 'xlsx' &&
      inputNode.files[0].name.split('.')[1] != 'xls') {
      this.showMessage("نوع الملف المرفق غير صحيح اختر ملف آخر", "error");
      return;
    }


    if (id.startsWith('img_') &&
      inputNode.files[0].name.split('.')[1] != 'jpg' &&
      inputNode.files[0].name.split('.')[1] != 'jpeg' &&
      inputNode.files[0].name.split('.')[1] != 'png') {
      this.showMessage("نوع الصورة المرفقة غير صحيح اختر صورة من نوع png أو jpg", "error");
      return;
    }


    if (inputNode.files[0].size > 1048576) {
      this.showMessage("حجم الملف المرفق أكبر من 1 ميجا , اختر ملف مختلف", "error");
      return;
    }

    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();

      var attachment: AttachmentInfo = new AttachmentInfo();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e: any) => {

        this.srcResultsDic.set(id, e.target.result);
        attachment = {
          FileName: '',
          ElementID: id.substring(4),
          FileContent: reader.result!.toString().replace(/^data:(.*,)?/, ''),
          FileExtension: inputNode.files[0].name.split('.')[1]
        }

        this.requestAttachments.push(attachment);
      };
      // reader.readAsText(inputNode.files[0]);



      this.filesNamesDic.set(id, inputNode.files[0].name);




      if (id.startsWith('file')) {


      }
      else if (id.startsWith('img')) {

      }


    }
  }

  readFileContent(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (!file) {
        resolve('');
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        const text = reader.result!.toString();
        resolve(text);

      };

      reader.readAsText(file);

      return file
    });
  }


  getFileName(id: string) {
    var nm = this.filesNamesDic.get(id);
    if (nm != '') return nm;
    return '';
  }


  onTypeUserName(event: KeyboardEvent) {

    var input = <HTMLInputElement>event.srcElement;
    if (input.value.length >= 1) {
      this.usersSearchDTO.name = input.value;
      this.usersService.GetAllUsers(this.usersSearchDTO).subscribe(res => {

        this.usersFiltered = res.body!.data;
      });
    }

  }





  sendRequest(requestFormGroup: FormGroup) {
    this.isDataLoaded = true;
    if (!requestFormGroup.valid) {
      this.validateForm();
    }
    else {
      console.log(requestFormGroup);
      let requestDetails: FFRequestInfo = new FFRequestInfo();
      requestDetails.serviceId = this.serviceDetails.id;
      requestDetails.createdOn = new Date();
      requestDetails.createdBy = '';
      requestDetails.updatedOn = new Date();
      requestDetails.updatedBy = '';
      requestDetails.requestElements = [];
      if (this.formDetails.approvalsPhases.length > 0) {
        requestDetails.currentPhaseId = this.formDetails.approvalsPhases[0].id;
      }



      let newRequestElement: RequestElementInfo;
      for (let i = 0; i < requestFormGroup.value.RequestControls.length; i++) {
        newRequestElement = new RequestElementInfo();
        newRequestElement.requestId = 0;
        const selectedCheckBoxes: checkboxSelection[] = [];
        if (requestFormGroup.value.RequestControls[i].elementTypeID == 4) {

          
          let selectedCheckBoxes = this.CheckBoxesSelectedValues.filter((cbx, index) => {
            return cbx.FormElementID == requestFormGroup.value.RequestControls[i].formElementID;
          });

          for (let j = 0; j < selectedCheckBoxes.length; j++) {
            if (newRequestElement.value == undefined) {
              newRequestElement.value = selectedCheckBoxes[j].selectedValueID.toString();
            }
            else {
              newRequestElement.value = newRequestElement.value + ',' + selectedCheckBoxes[j].selectedValueID;
            }
          }
        }
        else if (requestFormGroup.value.RequestControls[i].elementTypeID == 7) {
          newRequestElement.value = this.datePipe.transform(requestFormGroup.value.RequestControls[i].controlData, 'yyyy-MM-dd')!;
        }
        else if (requestFormGroup.value.RequestControls[i].elementTypeID == 10) {
          newRequestElement.value = this.datePipe.transform(requestFormGroup.value.RequestControls[i].fromDateToDateControlData.controls.start.value, 'yyyy-MM-dd')
            + ' - ' + this.datePipe.transform(requestFormGroup.value.RequestControls[i].fromDateToDateControlData.controls.end.value, 'yyyy-MM-dd');

        }
        else if (requestFormGroup.value.RequestControls[i].elementTypeID == 5 || requestFormGroup.value.RequestControls[i].elementTypeID == 11) {
          newRequestElement.fileContent = this.requestAttachments.find(x => x.ElementID == requestFormGroup.value.RequestControls[i].formElementID)?.FileContent;
          newRequestElement.value = '';
          newRequestElement.fileExtension = this.requestAttachments.find(x => x.ElementID == requestFormGroup.value.RequestControls[i].formElementID)?.FileExtension!;
        }
        else if(requestFormGroup.value.RequestControls[i].elementTypeID == 14)
        {
          newRequestElement.value = this.externalDatasourceValuesDictionary.get(requestFormGroup.value.RequestControls[i].externalSourceID)+'';
        }   
        else  if (requestFormGroup.value.RequestControls[i].elementTypeID == 17) {

         
          let selectedCheckBoxes = this.ExternalCheckBoxesSelectedValues.filter((cbx, index) => {
            return cbx.FormElementID == requestFormGroup.value.RequestControls[i].formElementID;
          });

          for (let j = 0; j < selectedCheckBoxes.length; j++) {
            if (newRequestElement.value == undefined) {
              newRequestElement.value = selectedCheckBoxes[j].name.toString();
            }
            else {
              newRequestElement.value = newRequestElement.value + ',' + selectedCheckBoxes[j].name;
            }
          }
        }
        else {
          newRequestElement.value = requestFormGroup.value.RequestControls[i].controlData.toString();
        }


        if(newRequestElement.value ==null)newRequestElement.value='';
        newRequestElement.formElementId = this.formDetails.formElements[i].id;

        requestDetails.requestElements.push(newRequestElement);
      }



      let formObservable: Observable<ActionResult>;
      formObservable = this.requestsService.AddRequest(requestDetails);

      formObservable.subscribe(
        responseDate => {

          this.showMessage(responseDate.resultMessage, 'success');
          this.isLoading = false;
          setTimeout(() => {
            this.router.navigate(['/home/my-requests']);
          }, 2500);

        },
        resultError => {
          this.showMessage(resultError.resultMessage, 'error');

          this.isLoading = false;
        }
      );



    }

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



  public validateForm() {
    this.viewportScroller.scrollToAnchor('pageContainer');

    const dom: HTMLElement = this.elementRef.nativeElement;
    const elements = dom.querySelectorAll('.xyz');

    let invalid = this.findInvalidControls();


    for (let i = 0; i < elements.length; i++) {

      if (invalid.includes(i.toString())) {
        elements[i].className = elements[i].className.replace('red-border', '');
        elements[i].className = elements[i].className + ' red-border';
      }
      else {
        elements[i].className = elements[i].className.replace('red-border', '');
      }


    }
  }



  public findInvalidControls() {
    const invalid = [];
    const controls = this.RequestFormGroup.value.RequestControls;


    for (const cid in controls) {

      if (this.RequestFormGroup.value.RequestControls[cid].elementTypeID == 10) {
        if (this.RequestFormGroup.value.RequestControls[cid].isMandatory &&
          (this.RequestFormGroup.value.RequestControls[cid].fromDateToDateControlData.start == '' || this.RequestFormGroup.value.RequestControls[cid].fromDateToDateControlData.end == '')) {
          invalid.push(cid);
        }
      }
      else if (this.RequestFormGroup.value.RequestControls[cid].isMandatory && this.RequestFormGroup.value.RequestControls[cid].controlData == '') {
        invalid.push(cid);
      }
    }
    return invalid;
  }


  onCheckChange(event: any, requestControl: FormGroup) {

    let formElementId: number = +requestControl.controls.formElementID.value;
    let sourceItemID: number = +event.source.value;

    if (event.checked) {


      let element: checkboxSelection = new checkboxSelection();
      element.FormElementID = formElementId;
      element.selectedValueID = sourceItemID;

      this.CheckBoxesSelectedValues.push(element);
    }
    else {

      this.CheckBoxesSelectedValues.splice(
        this.CheckBoxesSelectedValues.findIndex(item => item.FormElementID == formElementId && item.selectedValueID == sourceItemID)
        , 1)

    }

  }



  onExternalCheckChange(event: any, requestControl: FormGroup) {

    let formElementId: number = +requestControl.controls.formElementID.value;
    let name: string = event.source.value;

    if (event.checked) {


      let element: ExternalCheckboxSelection = new ExternalCheckboxSelection();
      element.FormElementID = formElementId;
      element.name =name ;

      this.ExternalCheckBoxesSelectedValues.push(element);
    }
    else {

      this.ExternalCheckBoxesSelectedValues.splice(
        this.ExternalCheckBoxesSelectedValues.findIndex(item => item.FormElementID == formElementId && item.name == name)
        , 1)

    }

  }

  async getValueFromExternalApi(externalSourceID: number, typeID: number) {

    console.log(externalSourceID);
    this.externalDatasourceValuesDictionary.set(externalSourceID, "loading...");
    (await this.externalAPIService.getValueFromExternalService(this.externalDataSources_GetValue.find(x => x.id == externalSourceID)?.directory! + '123')).subscribe(res => {
console.log('list '+res.data);
      this.externalDatasourceValuesDictionary.set(externalSourceID, res.data)
      return res.data;


    });
  }


  
  async getListFromExternalApi(externalSourceID: number, typeID: number) {


    console.log(externalSourceID);
    (await this.externalAPIService.getListFromExternalService(this.externalDataSources_GetList.find(x => x.id == externalSourceID)?.directory! + '123')).subscribe(res => {

      this.externalDatasourceListsDictionary.set(externalSourceID, res.data);
      console.log(res.data);
      return res.data;


    });
  }




  







  redirectToMyServices() {
    this.router.navigate(['/home/my-services']);
  }

  async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


}
