import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AuthComponent } from './accounts/auth/auth.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { HomeContentComponent } from './home-content/home-content.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { AuthService } from './Services/auth.Service';
import { MyServicesComponent } from './home-content/my-services/my-services.component';
import { ServiceService } from './Services/Services.Service';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { ManageServicesComponent } from './admin-panel/manage-services/manage-services.component';
import { ManageGroupsComponent } from './admin-panel/manage-groups/manage-groups.component';
import { GroupsService } from './Services/groups.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { UsersService } from './Services/users.service';
import { MatTabsModule } from '@angular/material/tabs';
import { ManageDataSourcesComponent } from './admin-panel/manage-data-sources/manage-data-sources.component';
import { DataSourcesService } from './Services/dataSources.Service';
import { MatMenuModule } from '@angular/material/menu';
import { ComposeFormComponent } from './admin-panel/compose-form/compose-form.component';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { LookupsService } from './Services/lookUps.service';
import { DepartmentsService } from './Services/departments.Service';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsService } from './Services/form.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BasicSnackbarComponent } from 'src/app/basic-snackbar/basic-snackbar.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ApplyRequestComponent } from './home-content/apply-request/apply-request.component';
import { RequestsService } from './Services/request.Service';
import { MyRequestsComponent } from './home-content/my-requests/my-requests.component';
import { MyTasksComponent } from './home-content/my-tasks/my-tasks.component';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { RequestDetailsComponent } from './home-content/request-details/request-details.component'
import { TasksService } from './Services/tasks.service';
import { TaskDetailsComponent } from './home-content/task-details/task-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BiDashboardComponent } from './reports/bi-dashboard/bi-dashboard.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { ServicesReportComponent } from './reports/services-report/services-report.component';
import { SideNavNarrowComponent } from './side-nav-narrow/side-nav-narrow.component';
import { OrganizationStructureComponent } from './admin-panel/organization-structure/organization-structure.component';
import { MatTreeModule } from '@angular/material/tree';
import { MyInfoComponent } from './home-content/my-info/my-info.component';
import { RegistrationComponent } from './accounts/registration/registration.component';
import { APP_BASE_HREF, DatePipe,  HashLocationStrategy,  LocationStrategy, PathLocationStrategy} from '@angular/common';
import { ManageEndpointsComponent } from './admin-panel/manage-endpoints/manage-endpoints.component';
import { EndPointsService } from './Services/endPoints.service';
import { ManageSubmitStagesComponent } from './admin-panel/manage-submit-stages/manage-submit-stages.component';
import { SubmitStagesService } from './Services/submitStages.service';
import { MatBadgeModule } from '@angular/material/badge';
import { FlowflyComponent } from './home-content/flowfly/flowfly.component';
import { BaseUrlInterceptor } from './Services/APIInterceptor';
import { NotFoundComponent } from './not-found/not-found.component';
import { SiteSettingsComponent } from './admin-panel/site-settings/site-settings.component';
import { SiteSettingsService } from './Services/siteSettings.Service';
import { UsersDirectoryComponent } from './home-content/users-directory/users-directory.component';
import { ExternalAPIService } from './Services/externalAPIService.service';
import { UserAccountActivationComponent } from './accounts/user-account-activation/user-account-activation.component';

var production=true;
export const environment = {
 

//   apiUrl: "https://flowflyapiservice.azurewebsites.net",
//  baseWebURL: "https://happy-pebble-035eda810.5.azurestaticapps.net",
//  filesBaseURl: "https://flowflyfiles.blob.core.windows.net/requestsfiles/",
  personalImagesBaseURL: "https://flowflyfiles.blob.core.windows.net/personalimages/",

  apiUrl: production?"https://flowflyapiservice.azurewebsites.net": "http://localhost:8080",
 // baseWebURL: production?"https://happy-pebble-035eda810.5.azurestaticapps.net":"http://localhost:4200/",
  filesBaseURl: production?"https://flowflyfiles.blob.core.windows.net/requestsfiles/":"http://localhost:8080/Files/",
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AuthComponent,
    SideNavComponent,
    HomeContentComponent,
    LoadingSpinnerComponent,
    MyServicesComponent,
    AdminPanelComponent,
    ManageServicesComponent,
    ManageGroupsComponent,
    ManageDataSourcesComponent,
    ComposeFormComponent,
    BasicSnackbarComponent,
    ApplyRequestComponent,
    MyRequestsComponent,
    MyTasksComponent,
    RequestDetailsComponent,
    TaskDetailsComponent,
    BiDashboardComponent,
    ServicesReportComponent,
    SideNavNarrowComponent,
    OrganizationStructureComponent,
    MyInfoComponent,
    RegistrationComponent,
    ManageEndpointsComponent,
    ManageSubmitStagesComponent,
    FlowflyComponent,
    NotFoundComponent,
    SiteSettingsComponent,
    UsersDirectoryComponent,
    UserAccountActivationComponent,


  ],
  imports: [
    
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatMenuModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatStepperModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatGridListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSidenavModule,
    DragDropModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTreeModule,
    MatBadgeModule,
    NgbModule,
    HighchartsChartModule

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    
    AuthService,
    ServiceService,
    GroupsService,
    UsersService,
    DataSourcesService,
    LookupsService,
    DepartmentsService,
    FormsService,
    RequestsService,
    TasksService,
    EndPointsService,
    SubmitStagesService,
    SiteSettingsService,
    ExternalAPIService,
    PageEvent,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BaseUrlInterceptor,
      multi: true
    },
     { provide: LocationStrategy, useClass: HashLocationStrategy  },
    {
      provide: "BASE_API_URL", useValue: environment.apiUrl
    },
    {
      provide: "BASE_Files_URL", useValue: environment.filesBaseURl
    },
    {
      provide: "BASE_Personal_Images_URL", useValue: environment.personalImagesBaseURL
    },
     [{ provide: APP_BASE_HREF, useValue: '/'}],
    
  ],
  bootstrap: [AppComponent],
  exports: [BasicSnackbarComponent]
})
export class AppModule { }
