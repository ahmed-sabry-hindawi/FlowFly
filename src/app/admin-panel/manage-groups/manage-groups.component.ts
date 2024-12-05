import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ViewportScroller } from '@angular/common';
import { Form, NgForm } from '@angular/forms';
import { GroupInfo } from 'src/app/models/GroupInfo.model';
import { GroupsService } from 'src/app/Services/groups.service';
import { UserInfo } from 'src/app/models/UserInfo.model';
import { UsersService } from 'src/app/Services/users.service';
import { SearchUsersDTO } from 'src/app/models/SearchUsersDTO.model';
import { ActionResult } from 'src/app/models/ActionResult.model';
import { LookupsService } from 'src/app/Services/lookUps.service';

@Component({
  selector: 'app-manage-groups',
  templateUrl: './manage-groups.component.html',
  styleUrls: ['../../app.component.css']
})
export class ManageGroupsComponent implements OnInit, OnDestroy {
  [x: string]: any;
  @ViewChild('updateGroupsCategoryForm', { static: false }) updateGroupsCategoryForm!: NgForm;
  @ViewChild('updateGroupForm', { static: false }) updateGroupForm!: NgForm;
  @ViewChild('addUserToGroupForm', { static: false }) addUserToGroupForm!: NgForm;
  selectGroupID!: number;

  subscription: Subscription;
  searchText!: string;
  allGroups: GroupInfo[] = [];
  allGroupsBackUp: GroupInfo[] = [];
  usersFiltered: UserInfo[] = [];
  errorMessage: string = "";
  successMessage: string = "";
  isLoading: boolean = false;
  isModalLoading:boolean=false;
  usersSearchDTO: SearchUsersDTO = new SearchUsersDTO();

  group: GroupInfo = new GroupInfo();


  constructor(
    private groupservice: GroupsService,
    private usersService: UsersService,
    private lookupsService:LookupsService,
    private viewportScroller: ViewportScroller,
    private router: Router,
    private route: ActivatedRoute) {
    this.subscription = new Subscription();

  }


  ngOnInit(): void {

    this.groupservice.GetAllGroups().subscribe(res => {

      this.allGroups = res.data;
      this.allGroupsBackUp = this.allGroups.map(obj => ({ ...obj }));
    });


    this.usersService.GetAllUsers(this.usersSearchDTO).subscribe(res => {

      this.usersFiltered = res.body?.data;
    });

    this.subscription = this.groupservice.GroupsChanged.subscribe(
      {
        next: (response =>

          this.loadGroups()
        ),
        error: (
          error => { }
        ),
        complete: () => { }


      }


    );


  }

  loadGroups() {
    this.groupservice.GetAllGroups().subscribe(res => {
      this.allGroups = res.data;
      this.allGroupsBackUp = this.allGroups.map(obj => ({ ...obj }));

    });
  }

  onChangeGroupStatus(group: GroupInfo) {



    let observable: Observable<ActionResult>;
    observable = this.groupservice.ChangeGroupStatus(group);

    this.HandleResponse(observable);

    this.loadGroups();
  }





  onAddGroups(serviceForm: NgForm) {

    this.group=new  GroupInfo();
    this.group.arName=serviceForm.value.arName;
    this.group.name = serviceForm.value.name;
    this.group.description = serviceForm.value.description;
    this.group.isActive=true;


    let observable: Observable<ActionResult>;
    observable = this.groupservice.AddGroup(this.group);

    this.HandleResponse(observable);

    this.loadGroups();
    this.closeAddGroupModal()
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }




  openAddGroupDialog(): void {
    var modal = document.getElementById("model_AddGroups")!;
    modal.style.display = 'block';
  }

  closeAddGroupModal(): void {
    var modal = document.getElementById("model_AddGroups")!;
    modal.style.display = 'none';
  }


  openUpdateGroupDialog(sgroupId: number): void {
    var modal = document.getElementById("model_UpdateGroup")!;
    modal.style.display = 'block';


    let selectedGroup= this.allGroups.find(x => x.id == sgroupId)!;

    this.updateGroupForm.setValue({
      'id': selectedGroup.id, 'name': selectedGroup.name, 'arName': selectedGroup.arName, 'description': selectedGroup.description
    });

  }

  onUpdateGroup(updateForm: NgForm) {

    this.group.id = updateForm.value.id;

    this.group.name = updateForm.value.name;
    this.group.description =  updateForm.value.description;
    this.group.arName =  updateForm.value.arName;
    this.group.isActive =  this.updateGroupForm.value.isActive;

    let observable: Observable<ActionResult>;
    observable = this.groupservice.UpdateGroup(this.group);
    this.HandleResponse(observable);

    this.loadGroups();
    this.closeUpdateGroupsModal();
  }
  closeUpdateGroupsModal(): void {
    var modal = document.getElementById("model_UpdateGroup")!;
    modal.style.display = 'none';
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



  openAddUserToGroupDialog(groupID: number): void {
    var modal = document.getElementById("model_AddUserToGroups")!;
    modal.style.display = 'block';

    let selectedGroup = this.allGroups.find(x => x.id == groupID)!;
    this.addUserToGroupForm.setValue({ 'name': selectedGroup.name, 'arName': selectedGroup.arName, 'selectedUser': null });
    this.selectGroupID = groupID;
  }


  closeAddUserToGroupDialog(): void {
    var modal = document.getElementById("model_AddUserToGroups")!;
    modal.style.display = 'none';
  }


  closeUpdateGroupModal(): void {
    var modal = document.getElementById("model_UpdateGroup")!;
    modal.style.display = 'none';
  }




  onAddUserToGroup(addUserToGroupForm: NgForm) {
    let selectedUser = this.usersFiltered.find(x => x.fullName == addUserToGroupForm.value.selectedUser);
    

    let observable: Observable<ActionResult>;
    observable = this.groupservice.AddUserToGroup(selectedUser!.userId, this.selectGroupID);
    this.HandleResponse(observable);

    this.closeAddUserToGroupDialog();
    this.loadGroups();
  }


  onDeleteUserFromGroup(userID: number, groupID: number) {
    


    let observable: Observable<ActionResult>;
    observable = this.groupservice.DeleteUserFromGroup(userID, groupID);
    this.HandleResponse(observable);


    let gIndex = this.allGroups.findIndex(x => x.id == groupID)

    let uIndex = this.allGroups[gIndex].users.findIndex(x => x.userId == userID)

    this.allGroups[gIndex].users.splice(uIndex, 1);
  }



  onSearch() {

    this.allGroups = [];

    this.allGroups = this.allGroupsBackUp.map(obj => ({ ...obj }));

    if (this.searchText.length > 1) {
      let searchValue = this.searchText;

      for (let i = 0; i < this.allGroups.length; i++) {

        if (this.searchText != '') {
          this.allGroups = this.allGroups.filter(srv => srv.name.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0 || srv.arName.indexOf(searchValue) >= 0);
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



}
