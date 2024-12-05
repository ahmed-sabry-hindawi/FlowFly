import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { UsersService } from 'src/app/Services/users.service';
import { SubmitStageInfo } from 'src/app/models/SubmitStageInfo.model';
import { SubmitStagesService } from 'src/app/Services/submitStages.service';
import { ItemInfo } from 'src/app/models/ItemInfo.model';
import { ActionResult } from 'src/app/models/ActionResult.model';
import { DatePipe, ViewportScroller } from '@angular/common';
import { ServiceInfo } from 'src/app/models/ServiceInfo.model';
import { ServiceService } from 'src/app/Services/Services.Service';

@Component({
  selector: 'app-manage-submit-stages',
  templateUrl: './manage-submit-stages.component.html',
  styleUrls: ['./manage-submit-stages.component.css']
})
export class ManageSubmitStagesComponent implements OnInit, OnDestroy  {

  //@ViewChild('addSubmitStageForm', { static: false }) addSubmitStageForm!: NgForm;
  addSubmitStageForm!: FormGroup;
  updateSubmitStagesForm!: FormGroup;



  selectSubmitStageID!: number;

  selectedSubmitStageName!: string;
  searchText!: string;
  subscription: Subscription;

  allSubmitStages: SubmitStageInfo[] = [];
  allSubmitStagesBackUp: SubmitStageInfo[] = [];
  services: ServiceInfo[] = [];
  errorMessage: string = "";
  successMessage: string = "";
  isLoading: boolean = false;
  minDate!: Date;
  maxDate!: Date;

  SubmitStage: SubmitStageInfo = new SubmitStageInfo();
  SubmitStageItem: ItemInfo = new ItemInfo()


  constructor(
    private serviceservice: ServiceService,
    private SubmitStagesService: SubmitStagesService,
    private viewportScroller: ViewportScroller,
    private router: Router,
    private datePipe: DatePipe, 
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute) {

    this.subscription = new Subscription(); 
  


  }


  ngOnInit(): void {

    this.loadSubmitStages();

    this.loadStageDependentServices();


    this.subscription = this.SubmitStagesService.SubmitStagesChanged.subscribe(
      {
        next: (response =>

          this.loadSubmitStages()
        ),
        error: (
          error => { }
        ),
        complete: () => { }
      }
    );



  let fromDateToDate1: FormGroup = new FormGroup({
    start: new FormControl<Date>(new Date()),
    end: new FormControl<Date>(new Date())
  });

  this.addSubmitStageForm = this._formBuilder.group({

    name: [''],
    serviceId: ['-1'],
    fromDateToDate:[fromDateToDate1]  

  });




  let fromDateToDate2: FormGroup = new FormGroup({
    start: new FormControl<Date>(new Date()),
    end: new FormControl<Date>(new Date())
  });

  this.updateSubmitStagesForm = this._formBuilder.group({
id:[''],
    name: [''],
    serviceId: ['-1'],
    fromDateToDate:[fromDateToDate2]  

  });


      

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    this.minDate = new Date();
    this.maxDate = new Date(currentYear+1,currentMonth,1);

  }

  loadSubmitStages() {
    this.SubmitStagesService.GetAllSubmitStages().subscribe(res => {
      this.allSubmitStages = res.data;
      this.allSubmitStagesBackUp = this.allSubmitStages.map(obj => ({ ...obj }));


    });
  }

  loadStageDependentServices() {
    this.serviceservice.GetAllStageDependentServices().subscribe(res => {

      this.services = res.data;

    });
  }

  onChangeSubmitStageStatus(SubmitStage: SubmitStageInfo) {


    let observable: Observable<ActionResult>;
    observable = this.SubmitStagesService.ChangeSubmitStageStatus(SubmitStage);
    this.HandleResponse(observable);
    this.loadSubmitStages();
  }


  onAddSubmitStage(addSubmitStageForm: FormGroup) {

    this.SubmitStage=new  SubmitStageInfo();
    this.SubmitStage.name = addSubmitStageForm.value.name;
    this.SubmitStage.serviceId=addSubmitStageForm.value.serviceId;
    this.SubmitStage.fromDate =this.datePipe.transform(addSubmitStageForm.value.fromDateToDate.controls.start.value, 'yyyy-MM-dd')!;
    this.SubmitStage.toDate =this.datePipe.transform(addSubmitStageForm.value.fromDateToDate.controls.end.value, 'yyyy-MM-dd')!;
    this.SubmitStage.isActive = false;
    let observable: Observable<ActionResult>;
    observable = this.SubmitStagesService.AddSubmitStage(this.SubmitStage);
    this.HandleResponse(observable);

    this.loadSubmitStages();
    this.closeAddSubmitStageModal()
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  openAddSubmitStageDialog(): void {
    var modal = document.getElementById("model_AddSubmitStage")!;

   
    modal.style.display = 'block';
  }

  closeAddSubmitStageModal(): void {
    var modal = document.getElementById("model_AddSubmitStage")!;
    modal.style.display = 'none';
  }


  openUpdateSubmitStageDialog(submitStageId: number): void {
    var modal = document.getElementById("model_UpdateSubmitStage")!;


    let selectedSubmitStage = this.allSubmitStages.find(x => x.id == submitStageId)!;


    modal.style.display = 'block';    


    let fromDateToDate1: FormGroup = new FormGroup({
      start: new FormControl(selectedSubmitStage.fromDate),
      end: new FormControl(selectedSubmitStage.toDate)
    });
  
    this.updateSubmitStagesForm = this._formBuilder.group({
      id: selectedSubmitStage.id,
      name: selectedSubmitStage.name,
      serviceId: selectedSubmitStage.serviceId,
      fromDateToDate:[fromDateToDate1]    
  
    });



  }

  onUpdateSubmitStages(updateForm: FormGroup) {


    let selectedSubmitStage = this.allSubmitStages.find(x => x.id == updateForm.value.id)!;

    // this.SubmitStage.id = updateForm.value.id;
    // this.SubmitStage.name = updateForm.value.name;
    // this.SubmitStage.fromDate = updateForm.value.fromDate;
    // this.SubmitStage.toDate = updateForm.value.toDate;

    this.SubmitStage.id = updateForm.value.id;
    this.SubmitStage.name = updateForm.value.name;
    this.SubmitStage.serviceId=updateForm.value.serviceId;
    this.SubmitStage.fromDate =this.datePipe.transform(updateForm.value.fromDateToDate.controls.start.value, 'yyyy-MM-dd')!;
    this.SubmitStage.toDate =this.datePipe.transform(updateForm.value.fromDateToDate.controls.end.value, 'yyyy-MM-dd')!;

    let observable: Observable<ActionResult>;
    observable = this.SubmitStagesService.UpdateSubmitStage(this.SubmitStage);
    this.HandleResponse(observable);

    this.loadSubmitStages();
    this.closeUpdateSubmitStagesModal();
  }

  closeUpdateSubmitStagesModal(): void {
    var modal = document.getElementById("model_UpdateSubmitStage")!;
    modal.style.display = 'none';
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

  onSearch() {


    this.allSubmitStages = [];

    this.allSubmitStages = this.allSubmitStagesBackUp.map(obj => ({ ...obj }));

    if (this.searchText.length > 1) {
      let searchValue = this.searchText;

      for (let i = 0; i < this.allSubmitStages.length; i++) {

        if (this.searchText != '') {
          this.allSubmitStages = this.allSubmitStages.filter(srv => srv.name.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0);
        }
      }
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




}
