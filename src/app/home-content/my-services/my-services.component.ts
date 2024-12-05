import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ServiceService } from 'src/app/Services/Services.Service';
import { AuthService } from 'src/app/Services/auth.Service';
import { RequestsService } from 'src/app/Services/request.Service';
import { TasksService } from 'src/app/Services/tasks.service';
import { ServiceCategoryInfo } from 'src/app/models/ServiceCategoryInfo.model';
import { ServiceInfo } from 'src/app/models/ServiceInfo.model';

@Component({
  selector: 'app-my-services',
  templateUrl: './my-services.component.html',
  styleUrls: ['./my-services.component.css', '../../app.component.css']
})
export class MyServicesComponent implements OnInit, OnDestroy {
  Date() {
    throw new Error('Method not implemented.');
  }


  subscription: Subscription;
  isLoading = true;
  filteredServicesCategories: ServiceCategoryInfo[] = [];
  servicesCategories: ServiceCategoryInfo[] = [];
  servicesCategoriesBackUp: ServiceCategoryInfo[] = [];
  searchText!: string;
  servicesCount: number = 0;
  errorMessage: string = '';
  successMessage: string = '';


  constructor(
    private serviceservice: ServiceService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute) {
    this.subscription = new Subscription();
  }


  ngOnInit(): void {

    this.loadServices();
    if (!this.authService.IsAddedToOS()) {
      this.errorMessage = "أهلا وسهلا بك , يرجى الانتباه أنه لم يتم إضافتك إلى الهيكل التنظيمي للبوابة حتى تتمكن من تقديم طلبات";
    }

  }

  loadServices() {
    this.serviceservice.GetUserServices().subscribe(res => {
      this.servicesCategories = res.data;
      this.servicesCategoriesBackUp = this.servicesCategories.map(obj => ({ ...obj }));
      this.serviceservice.ServicesChanged.next(res.data);
      this.isLoading = false;
      this.servicesCount = this.servicesCategories.reduce((count, current) => count + current.services.length, 0);



    });
  }






  redirectToRequestForm(service: ServiceInfo) {


    this.serviceservice.selectedService = service;

    this.router.navigate(['../apply-request'], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }



  onSearch() {

    this.filteredServicesCategories = [];
    this.servicesCategories = [];
    this.servicesCategories = this.servicesCategoriesBackUp.map(obj => ({ ...obj }));

    let filteredCategory: ServiceCategoryInfo = {
      id: 0,
      name: 'خدمات مفلترة',
      createdBy: '',
      icon: '',
      services: []

    };
    this.filteredServicesCategories.push(filteredCategory)

    if (this.searchText.length > 1) {
      let searchValue = this.searchText;


      for (let i = 0; i < this.servicesCategories.length; i++) {

        if (this.searchText != '') {

          // this.servicesCategories[i].services = this.servicesCategories[i].services.filter(srv => srv.;

          if (this.servicesCategories[i].services != undefined && this.servicesCategories[i].services.length > 0) {
            for (let j = 0; j < this.servicesCategories[i].services.length; j++) {
              if (this.servicesCategories[i].services[j].name.indexOf(searchValue) >= 0) {
                this.filteredServicesCategories[0].services.push(this.servicesCategories[i].services[j]);
              }
            }
          }

        }
      }

      if (this.filteredServicesCategories[0].services != null && this.filteredServicesCategories[0].services.length > 0) {
        this.servicesCategories = this.filteredServicesCategories;
      }
      else {
        this.servicesCategories = [];
      }

    }
    this.servicesCount = this.servicesCategories.reduce((count, current) => count + current.services.length, 0);


  }



  isNewService(date: Date) {
    var before5Days = new Date().setDate(new Date().getDate()-5);
    return new Date(date) > new Date(before5Days);
  }



}
