import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ServiceService } from 'src/app/Services/Services.Service';
import { ServiceCategoryInfo } from 'src/app/models/ServiceCategoryInfo.model';
import { ServiceInfo } from 'src/app/models/ServiceInfo.model';
import { Form, FormGroup, NgForm } from '@angular/forms';
import { ActionResult } from 'src/app/models/ActionResult.model';
import { ViewportScroller } from '@angular/common';
import { GroupInfo } from 'src/app/models/GroupInfo.model';
import { GroupsService } from 'src/app/Services/groups.service';
import { LookupsService } from 'src/app/Services/lookUps.service';
import { ShowingRequestHistoryTypeInfo } from 'src/app/models/ShowingRequestHistoryTypeInfo.model';
import { RequestsCountTypeInfo } from 'src/app/models/RequestsCountTypeInfo.model';


@Component({
  selector: 'app-manage-services',
  templateUrl: './manage-services.component.html',
  styleUrls: ['../../app.component.css'],
})
export class ManageServicesComponent implements OnInit, OnDestroy {
  [x: string]: any;
  @ViewChild('updateServiceCategoryForm', { static: false }) updateServiceCategoryForm!: NgForm;
  @ViewChild('updateServiceForm', { static: false }) updateServiceForm!: NgForm;
  @ViewChild('serviceForm', { static: false }) serviceForm!: NgForm;

  subscription: Subscription;
  searchText!: string;
  servicesCategories: ServiceCategoryInfo[] = [];
  servicesCategoriesBackUp: ServiceCategoryInfo[] = [];
  errorMessage: string = "";
  successMessage: string = "";
  isLoading: boolean = false;
  serviceCategory: ServiceCategoryInfo = new ServiceCategoryInfo(0, "", []);
  service: ServiceInfo = new ServiceInfo();
  servicesCount: number = 0;
  servicesCategoriesCount: number = 0;
  allGroups: GroupInfo[] = [];
  allShowingRequestHistoryTypes: ShowingRequestHistoryTypeInfo[] = [];
  allRequestsCountTypes: RequestsCountTypeInfo[] = [];
  defaultValue: number = -1;
  defaultBooleanValue: boolean = true;


  allGenderTypes = [
    { "name": "لكلا الجنسين", ID: "rbGenderBoth", "value": null },
    { "name": "للإناث فقط", ID: "rbGenderFemale", "value": false },
    { "name": "للذكور فقط", ID: "rbGenderMale", "value": true }
  ];

  allCitizenTypes = [
    { "name": "لكل المستخدمين", ID: "rbCitizensBoth", "value": null },
    { "name": "للمواطنين فقط", ID: "rbOnlyCitizens", "value": true },
    { "name": "للمقيمين فقط", ID: "rbOnlyForiegners", "value": false }
  ];

  allManagersTypes = [
    { "name": "لكل المستخدمين", ID: "rbForAllEmp", "value": false },
    { "name": "للمدراء فقط", ID: "rbOnlyManagers", "value": true }
  ];

  allStageDependentTypes = [
    { "name": "متاح دائما", ID: "rbAlwaysAvailable", "value": false },
    { "name": "فترات محددة (تتم إدارتها من خلال إدارة المراحل)", "value": true }
  ];





  constructor(
    private serviceservice: ServiceService,
    private groupservice: GroupsService,
    private lookupsService: LookupsService,
    private viewportScroller: ViewportScroller,
    private router: Router,
    private route: ActivatedRoute) {
    this.subscription = new Subscription();
  }


  ngOnInit(): void {

    this.serviceservice.GetAllServices().subscribe(res => {

      this.servicesCategories = res.data;
      this.servicesCount = this.servicesCategories.reduce((count, current) => count + current.services.length, 0);
      this.servicesCategoriesCount = this.servicesCategories.length;
      this.servicesCategoriesBackUp = this.servicesCategories.map(obj => ({ ...obj }));

    });

    this.subscription = this.serviceservice.ServicesChanged.subscribe(
      {
        next: (response =>

          this.loadServices()
        ),
        error: (
          error => { 

            if (error.status == "401") {
              this.router.navigate(['/login']);
          }
          }
        ),
        complete: () => { }
      }


    );

    this.groupservice.GetAllGroups().subscribe((res: { data: GroupInfo[]; }) => {

      this.allGroups = res.data;
    });

    this.lookupsService.GetAllShowingRequestHistoryTypes().subscribe((res: { data: ShowingRequestHistoryTypeInfo[]; }) => {

      this.allShowingRequestHistoryTypes = res.data;
    });


    this.lookupsService.GetAllRequestsCountTypes().subscribe((res: { data: RequestsCountTypeInfo[]; }) => {

      this.allRequestsCountTypes = res.data;
    });





  }

  loadServices() {
    this.serviceservice.GetAllServices().subscribe(res => {
      this.servicesCategories = res.data;
      this.servicesCategoriesBackUp = this.servicesCategories.map(obj => ({ ...obj }));
      this.servicesCount = this.servicesCategories.reduce((count, current) => count + current.services.length, 0);
      this.servicesCategoriesCount = this.servicesCategories.length;

    });
  }

  onChangeServiceStatus(service: ServiceInfo) {

    this.isLoading = true;
    let observable: Observable<ActionResult>;
    observable = this.serviceservice.ChangeServiceStatus(service);

    this.HandleResponse(observable);

    this.loadServices();
  }



  onAddServiceCategory(serviceCategoryForm: NgForm) {

    this.isLoading = true;
    this.serviceCategory.name = serviceCategoryForm.value.name;


    let observable: Observable<ActionResult>;
    observable = this.serviceservice.AddServiceCategory(this.serviceCategory);

    this.HandleResponse(observable);

    this.openAddServiceDialog();

    this.loadServices();

    this.closeAddServiceCategoryModal();


  }

  onAddService(serviceForm: NgForm) {


    if(serviceForm.value.categoryID=='-1')
    {
      this.showMessage("ادخل كامل الحقول المطلوبة","error");
      return;
    }
    this.isLoading = true;

    this.service.name = serviceForm.value.name;
    this.service.description = serviceForm.value.description;
    this.service.categoryID = serviceForm.value.categoryID;
    if (serviceForm.value.forGender != null && serviceForm.value.forGender != -1) {
      this.service.forGender = (serviceForm.value.forGender == 1);
    }
    else {
      this.service.forGender = null!;
    }
    if (serviceForm.value.forCitizens != null && serviceForm.value.forCitizens != -1) {
      this.service.forCitizens = (serviceForm.value.forCitizens == 1);
    }
    else {
      this.service.forCitizens = null!;
    }
    if (serviceForm.value.forManagers != null) {
      this.service.forManagers = serviceForm.value.forManagers;
    }
    else {
      this.service.forManagers = null!;
    }
    if (serviceForm.value.forGroup != null && serviceForm.value.forGroup != -1) {
      this.service.forGroup = serviceForm.value.forGroup;
    }
    else {
      this.service.forGroup = null!;
    }


    if (serviceForm.value.stagesDependent != null) {
      this.service.stagesDependent = serviceForm.value.stagesDependent;
    }
    else {
      this.service.stagesDependent = false;
    }


    if (serviceForm.value.requestsCount != null && serviceForm.value.requestsCount != -1) {
      this.service.requestsCountTypeId = serviceForm.value.requestsCount;
    }
    else {
      this.service.requestsCountTypeId = 1;
    }

    if (serviceForm.value.ShowingHistory != null && serviceForm.value.ShowingHistory != -1) {
      this.service.showingRequestHistoryTypeId = serviceForm.value.ShowingHistory;
    }
    else {
      this.service.showingRequestHistoryTypeId = 1;
    }

    let observable: Observable<ActionResult>;
    observable = this.serviceservice.AddService(this.service);
    

    observable.subscribe(
      responseDate => {

        this.showMessage(responseDate.resultMessage, 'success');
       
        this.service.id=responseDate.data;
        this.AddForm(this.service);
        this.isLoading = false;
        this.closeAddServiceModal();


      },
      resultError => {
        this.showMessage(resultError.resultMessage, 'error');

        this.isLoading = false;
      }
    );


  

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }




  openAddServiceDialog(): void {



    var modal = document.getElementById("model_AddService")!;
    modal.style.display = 'block';

    this.serviceForm.setValue({
     
      'name': '',
      'description': '',
      'categoryID': -1,
      'forGender': -1,
      'forCitizens': -1,
      'forManagers': 0,
      'forGroup': -1,
      'StagesDependent': 0,
      'requestsCount': 1,
      'ShowingHistory': 1
    });


  }

  closeAddServiceModal(): void {
    var modal = document.getElementById("model_AddService")!;
    modal.style.display = 'none';

  }


  openAddServiceCategoryDialog(): void {
    var modal = document.getElementById("model_AddServiceCategory")!;
    modal.style.display = 'block';

  }

  closeAddServiceCategoryModal(): void {
    var modal = document.getElementById("model_AddServiceCategory")!;
    modal.style.display = 'none';
  }


  openUpdateServiceCategoryDialog(categoryId: number): void {
    var modal = document.getElementById("model_UpdateServiceCategory")!;
    modal.style.display = 'block';

    const selectedCategory = this.servicesCategories.find(x => x.id == categoryId)!;
    this.updateServiceCategoryForm.
      setValue({
        'id': selectedCategory.id,
        'name': selectedCategory.name
      });
  }

  onUpdateServiceCategory(serviceCategoryForm: NgForm) {

    this.isLoading = true;
    this.serviceCategory.id = serviceCategoryForm.value.id;
    this.serviceCategory.name = serviceCategoryForm.value.name;



    let observable: Observable<ActionResult>;
    observable = this.serviceservice.UpdateServiceCategory(this.serviceCategory);
    this.HandleResponse(observable);

    this.loadServices();

    this.closeUpdateServiceCategoryModal();
  }

  closeUpdateServiceCategoryModal(): void {
    var modal = document.getElementById("model_UpdateServiceCategory")!;
    modal.style.display = 'none';
  }



  openUpdateServiceDialog(serviceId: number): void {
    var modal = document.getElementById("model_UpdateService")!;
    modal.style.display = 'block';


    let selectedService: ServiceInfo = new ServiceInfo();
    for (let p of this.servicesCategories) {
      for (let i of p.services) {
        if (i.id === serviceId) {
          selectedService = i;
        };
      }
    }



    this.updateServiceForm.reset();
    this.updateServiceForm.setValue({
      'id': selectedService.id,
      'name': selectedService.name,
      'description': selectedService.description,
      'categoryID': selectedService.categoryID,
      'forGender': selectedService.forGender,
      'forCitizens': selectedService.forCitizens,
      'forManagers': selectedService.forManagers,
      'forGroup': selectedService.forGroup == null ? -1 : selectedService.forGroup,
      'stagesDependent': selectedService.stagesDependent,
      'requestsCount': selectedService.requestsCountTypeId == null ? -1 : selectedService.requestsCountTypeId,
      'showingHistory': selectedService.showingRequestHistoryTypeId == null ? -1 : selectedService.showingRequestHistoryTypeId,
    });


    // this.allGenderTypes=[
    //   { "name": "لكلا الجنسين", ID: "rbGenderBoth", "value": null ,"checked":false},
    //   { "name": "للإناث فقط", ID: "rbGenderFemale", "value": false ,"checked":false },
    //   { "name": "للذكور فقط", ID: "rbGenderMale", "value": true ,"checked":false}
    // ];



    // this.allCitizenTypes=[
    //   { "name": "لكل المستخدمين", ID: "rbCitizensBoth", "value": null ,"checked":false},
    //   { "name": "للمواطنين فقط", ID: "rbOnlyCitizens", "value": true  ,"checked":false},
    //   { "name": "للمقيمين فقط", ID: "rbOnlyForiegners", "value": false ,"checked":false}
    // ];

    // this.allManagersTypes=[
    //   { "name": "لكل المستخدمين", ID: "rbForAllEmp", "value": null,"checked":false},
    //   { "name": "للمدراء فقط", ID: "rbOnlyManagers", "value": true,"checked":false}
    // ];

    // this.allStageDependentTypes=[
    //   { "name": "متاح دائما", ID: "rbAlwaysAvailable", "value": null ,"checked":false},
    //   { "name": "فترات محددة (تتم إدارتها من خلال إدارة المراحل)", "value": true ,"checked":false}
    // ];
    //this.changeDetectorRef.detectChanges();

  }

  onUpdateService(updateServiceForm: NgForm) {
    this.isLoading = true;
    this.service.id = updateServiceForm.value.id;

    let selectedService: ServiceInfo = new ServiceInfo();
    for (let p of this.servicesCategories) {
      for (let i of p.services) {
        if (i.id === this.service.id) {
          this.service.formID = i.formID;
          this.service.isActive = i.isActive;
        };
      }
    }

    this.service.name = updateServiceForm.value.name;
    this.service.description = updateServiceForm.value.description;
    this.service.categoryID = updateServiceForm.value.categoryID;


    this.service.forGender = updateServiceForm.value.forGender;


    this.service.forCitizens = updateServiceForm.value.forCitizens;


    this.service.forManagers = updateServiceForm.value.forManagers;


    if (updateServiceForm.value.forGroup != null && updateServiceForm.value.forGroup != -1) {
      this.service.forGroup = updateServiceForm.value.forGroup;
    }
    else {
      this.service.forGroup = null!;
    }

    this.service.stagesDependent = updateServiceForm.value.stagesDependent;


    if (updateServiceForm.value.requestsCount != null && updateServiceForm.value.requestsCount != -1) {
      this.service.requestsCountTypeId = updateServiceForm.value.requestsCount;
    }
    else {
      this.service.requestsCountTypeId = null!;
    }

    if (updateServiceForm.value.showingHistory != null && updateServiceForm.value.showingHistory != -1) {
      this.service.showingRequestHistoryTypeId = updateServiceForm.value.showingHistory;
    }
    else {
      this.service.showingRequestHistoryTypeId = null!;
    }



    let observable: Observable<ActionResult>;
    observable = this.serviceservice.UpdateService(this.service);

    this.HandleResponse(observable);


    this.loadServices();
    this.closeUpdateServiceModal()
  }
  closeUpdateServiceModal(): void {
    var modal = document.getElementById("model_UpdateService")!;
    modal.style.display = 'none';
  }


  AddForm(service: ServiceInfo) {


    this.serviceservice.selectedService = service;
    this.router.navigate(['../new-form'], { relativeTo: this.route });
  }

  onSearch() {

    this.servicesCategories = [];

    this.servicesCategories = this.servicesCategoriesBackUp.map(obj => ({ ...obj }));

    if (this.searchText.length > 1) {
      let searchValue = this.searchText;

      for (let i = 0; i < this.servicesCategories.length; i++) {

        if (this.searchText != '') {
          this.servicesCategories[i].services = this.servicesCategories[i].services.filter(srv => srv.name.indexOf(searchValue) >= 0);
        }
      }
    }

    this.servicesCount = this.servicesCategories.reduce((count, current) => count + current.services.length, 0);

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


  getRequestsCountTypeName(requestsCountTypeId: number) {
    if (this.allRequestsCountTypes != undefined && this.allRequestsCountTypes.length > 0) {
      return this.allRequestsCountTypes.find(x => x.id == requestsCountTypeId)!.name
    }
    return '';
  }



  getShowingRequestHistoryTypeName(showingRequestHistoryTypeId: number) {
    if (this.allShowingRequestHistoryTypes != undefined && this.allShowingRequestHistoryTypes.length > 0) {
      return this.allShowingRequestHistoryTypes.find(x => x.id == showingRequestHistoryTypeId)!.name
    }
    return '';
  }


}
