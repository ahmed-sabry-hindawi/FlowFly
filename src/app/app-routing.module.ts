import { NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterModule, RouterStateSnapshot, Routes, UrlTree } from '@angular/router';
import { HomeContentComponent } from './home-content/home-content.component';
import { AuthComponent } from './accounts/auth/auth.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { ManageServicesComponent } from './admin-panel/manage-services/manage-services.component';
import { ManageGroupsComponent } from './admin-panel/manage-groups/manage-groups.component';
import { ManageDataSourcesComponent } from './admin-panel/manage-data-sources/manage-data-sources.component';
import { ComposeFormComponent } from './admin-panel/compose-form/compose-form.component';
import { ApplyRequestComponent } from './home-content/apply-request/apply-request.component';
import { MyServicesComponent } from './home-content/my-services/my-services.component';
import { MyRequestsComponent } from './home-content/my-requests/my-requests.component';
import { MyTasksComponent } from './home-content/my-tasks/my-tasks.component';
import { RequestDetailsComponent } from './home-content/request-details/request-details.component';
import { TaskDetailsComponent } from './home-content/task-details/task-details.component';
import { BiDashboardComponent } from './reports/bi-dashboard/bi-dashboard.component';
import { ServicesReportComponent } from './reports/services-report/services-report.component';
import { OrganizationStructureComponent } from './admin-panel/organization-structure/organization-structure.component';
import { MyInfoComponent } from './home-content/my-info/my-info.component';
import { RegistrationComponent } from './accounts/registration/registration.component';
import { ManageEndpointsComponent } from './admin-panel/manage-endpoints/manage-endpoints.component';
import { ManageSubmitStagesComponent } from './admin-panel/manage-submit-stages/manage-submit-stages.component';
import { Observable } from 'rxjs';
import { adminGuard, authGuard } from './Services/auth.guard';
import { FlowflyComponent } from './home-content/flowfly/flowfly.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SiteSettingsComponent } from './admin-panel/site-settings/site-settings.component';
import { UsersDirectoryComponent } from './home-content/users-directory/users-directory.component';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { UserAccountActivationComponent } from './accounts/user-account-activation/user-account-activation.component';

interface AsyncGuard  {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree>;
}

const routes: Routes =
  [

    { path: '', component: MyServicesComponent},
    { path: 'login', component: AuthComponent },
    { path: 'registration', component: RegistrationComponent },
    { path: 'activation', component: UserAccountActivationComponent },
    {
      path: 'home', component: HomeContentComponent, children:
        [
          { path: 'my-services', component: MyServicesComponent, canActivate: [authGuard] },
          { path: 'my-requests', component: MyRequestsComponent, canActivate: [authGuard] },
          { path: 'my-tasks', component: MyTasksComponent, canActivate: [authGuard] },
          { path: 'apply-request', component: ApplyRequestComponent, canActivate: [authGuard] },
          { path: 'request-details', component: RequestDetailsComponent, canActivate: [authGuard] },
          { path: 'task-details', component: TaskDetailsComponent, canActivate: [authGuard] },
          { path: 'my-info', component: MyInfoComponent, canActivate: [authGuard] },
          { path: 'users-directory', component: UsersDirectoryComponent, canActivate: [authGuard] },
          { path: 'flowfly', component: FlowflyComponent },
        ]
    },
    {
      path: 'admin-panel', component: AdminPanelComponent, children:
        [
          { path: 'manage-services', component: ManageServicesComponent, canActivate: [adminGuard] },
          { path: 'manage-groups', component: ManageGroupsComponent, canActivate: [adminGuard] },
          { path: 'manage-data-sources', component: ManageDataSourcesComponent, canActivate: [adminGuard] },
          { path: 'manage-end-points', component: ManageEndpointsComponent },
          { path: 'manage-submit-stages', component: ManageSubmitStagesComponent, canActivate: [adminGuard] },
          { path: 'new-form', component: ComposeFormComponent, canActivate: [adminGuard] },
          { path: 'organization-structure', component: OrganizationStructureComponent, canActivate: [adminGuard] },
          { path: 'site-settings', component: SiteSettingsComponent, canActivate: [adminGuard] },
        ]
    },
    {
      path: 'bi-dashboard', component: BiDashboardComponent, canActivate: [adminGuard]
    },
    {
      path: 'services-report', component: ServicesReportComponent, canActivate: [adminGuard]
    },
    { path: '404', component: NotFoundComponent },
    { path: '**', component: NotFoundComponent }

  ];
@NgModule({
  
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled' }), MatSlideToggleModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy  }],
  exports: [RouterModule]
})
export class AppRoutingModule { }

