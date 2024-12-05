import { ViewportScroller } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { UsersService } from 'src/app/Services/users.service';
import { ActionResult } from 'src/app/models/ActionResult.model';
import { SearchUsersDTO } from 'src/app/models/SearchUsersDTO.model';
import { UserInfo } from 'src/app/models/UserInfo.model';

@Component({
  selector: 'app-users-directory',
  templateUrl: './users-directory.component.html',
  styleUrls: ['./users-directory.component.css']
})
export class UsersDirectoryComponent implements OnInit, OnDestroy {
 
  @ViewChild('addUserForm', { static: false }) addUserForm!: NgForm;
  @ViewChild('updateUsersForm', { static: false }) updateUsersForm!: NgForm;
  @ViewChild('deleteUserForm', { static: false }) deleteUserForm!: NgForm;


  selectUserID!: number;

  selectedUserName!: string;
  searchText!:string;
  subscription: Subscription;

  allUsers: UserInfo[] = [];
  allUsersBackUp: UserInfo[] = [];
  errorMessage: string = "";
  successMessage: string = "";
  isLoading: boolean = false;
  usersSearchDTO: SearchUsersDTO = new SearchUsersDTO();

  User: UserInfo = new UserInfo();


  constructor(
    private Userservice: UsersService,
    private viewportScroller: ViewportScroller,
    private router: Router,
    private route: ActivatedRoute) {
    this.subscription = new Subscription();
  }


  ngOnInit(): void {

    this.loadUsers();


    this.subscription = this.Userservice.UsersChanged.subscribe(
      {
        next: (response =>

          this.loadUsers()
        ),
        error: (
          error => { }
        ),
        complete: () => { }


      }


    );

  }

  loadUsers() {

  
    this.Userservice.GetAllUsers(this.usersSearchDTO).subscribe(res => {
      this.allUsers =  res.body!.data;
      this.allUsersBackUp = this.allUsers.map(obj => ({ ...obj }));
      

    });
  }

  // onChangeUserStatus(User: UserInfo) {
    

  //   let observable: Observable<ActionResult>;
  //   observable =  this.Userservice.ChangeUserStatus(User);
  //   this.HandleResponse(observable);
  //   this.loadUsers();
  // }


  // onAddUser(addUserForm: NgForm) {

    
  //   this.User.name = addUserForm.value.name;   
  //   this.User.directory = addUserForm.value.directory; 
  //   this.User.typeId = addUserForm.value.typeId; 
  //   this.User.isActive = false;
  //   let observable: Observable<ActionResult>;
  //   observable =  this.Userservice.AddUser(this.User);
  //   this.HandleResponse(observable);

  //   this.loadUsers();
  //   this.closeAddUserModal()
  // }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  openAddUserDialog(): void {
    var modal = document.getElementById("model_AddUser")!;
    modal.style.display = 'block';
  }

  closeAddUserModal(): void {
    var modal = document.getElementById("model_AddUser")!;
    modal.style.display = 'none';
  }


  // openUpdateUserDialog(sUserId: number): void {
  //   var modal = document.getElementById("model_UpdateUser")!;
 

  //   let selectedUser = this.allUsers.find(x => x.id == sUserId)!;


  //   modal.style.display = 'block';

  //   this.updateUsersForm.setValue({
  //     'id': selectedUser.id, 'name': selectedUser.name,'directory':selectedUser.directory,'typeId':selectedUser.typeId
  //   });


   

  // }

  // onUpdateUsers(updateForm: NgForm) {

   
  //   let selectedUser = this.allUsers.find(x => x.id == updateForm.value.id)!;

  //   this.User.id=updateForm.value.id;
  //   this.User.name = updateForm.value.name;
  //   this.User.directory=updateForm.value.directory;
  //   this.User.typeId=updateForm.value.typeId;
    


  //   let observable: Observable<ActionResult>;
  //   observable = this.Userservice.UpdateUser(this.User);
  //   this.HandleResponse(observable);

  //   this.loadUsers();
  //   this.closeUpdateUsersModal();
  // }

  closeUpdateUsersModal(): void {
    var modal = document.getElementById("model_UpdateUser")!;
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


    this.allUsers = [];

    this.allUsers = this.allUsersBackUp.map(obj => ({ ...obj }));

    if (this.searchText.length > 1) {
      let searchValue = this.searchText;

      for (let i = 0; i < this.allUsers.length; i++) {

        if (this.searchText != '') {
          this.allUsers = this.allUsers.filter(srv => srv.fullName.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0 );
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
