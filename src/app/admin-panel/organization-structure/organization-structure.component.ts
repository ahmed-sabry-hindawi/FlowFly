import { FlatTreeControl } from '@angular/cdk/tree';
import { ViewportScroller } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener
} from '@angular/material/tree';
import { Observable, Subscription, from } from 'rxjs';
import { expand } from 'rxjs-compat/operator/expand';
import { DepartmentsService } from 'src/app/Services/departments.Service';
import { UsersService } from 'src/app/Services/users.service';
import { ActionResult } from 'src/app/models/ActionResult.model';
import { DepartmentInfo } from 'src/app/models/DepartmentInfo.model';
import { DepartmentTypeInfo } from 'src/app/models/DepartmentTypeInfo.model';
import { SearchUsersDTO } from 'src/app/models/SearchUsersDTO.model';
import { TreeDepartmentInfo } from 'src/app/models/TreeDepartmentInfo.model';
import { UserInfo } from 'src/app/models/UserInfo.model';



/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  id: number;
  typeId: number;
  level: number;
}

@Component({
  selector: 'app-organization-structure',
  templateUrl: './organization-structure.component.html',
  styleUrls: ['./organization-structure.component.css']
})
export class OrganizationStructureComponent implements OnInit {


  @ViewChild('updateDepartmentForm', { static: false }) updateDepartmentForm!: NgForm;
  @ViewChild('addEmployeeToDepartmentForm', { static: false }) addEmployeeToDepartmentForm!: NgForm;
  @ViewChild('deactivateDepartmentForm', { static: false }) deactivateDepartmentForm!: NgForm;
  

  subscription: Subscription;
  errorMessage: string = "";
  successMessage: string = "";
  isLoading: boolean = false;
  isModalLoading: boolean = false;
  departmentTree: TreeDepartmentInfo[] = [];
  departmentTypes: DepartmentTypeInfo[] = [];
  usersFiltered: UserInfo[] = [];
  selectedDepartment!: DepartmentInfo;
  parentOfSelectedDepartment!: DepartmentInfo;
  usersSearchDTO: SearchUsersDTO = new SearchUsersDTO();


  private _transformer = (node: TreeDepartmentInfo, level: number) => {
    return {
      expandable: !!node.Children && node.Children.length > 0,
      name: node.DepartmentName,
      id: node.DepartmentID,
      typeId: node.DepartmentTypeID,
      level: level
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.Children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
    private departmentsService: DepartmentsService,
    private viewportScroller: ViewportScroller,
    private usersService: UsersService,
  ) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    this.loadDepartments();
    this.loadDepartmentsTypes();



    this.subscription = this.departmentsService.DepartmentsChanged.subscribe(
      {
        next: (response =>

          this.loadDepartments()
        ),
        error: (
          error => { }
        ),
        complete: () => { }


      }
    );


  }

  loadDepartments() {
    this.departmentsService.GetDepartmentsTree().subscribe(res => {

      this.departmentTree = JSON.parse(res.data);
      this.dataSource.data = JSON.parse(res.data);
      if (this.selectedDepartment) {
        this.selectDepartment(this.selectedDepartment.departmentId);
      }
      else {
        this.selectDepartment(1);
      }

      this.treeControl.expandAll();
    });
  }

  loadDepartmentsTypes() {
    this.departmentsService.GetAllDepartmentsTypes().subscribe(res => {

      this.departmentTypes = res.data;
    });
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  // filter recursively on a text string using property object value
  filterRecursive(filterText: string, array: any[], property: string) {
    let filteredData;

    //make a copy of the data so we don't mutate the original
    function copy(o: any) {
      return Object.assign({}, o);
    }

    // has string
    if (filterText) {
      // need the string to match the property value
      var filterTextLowerCase = filterText.toLowerCase();
      // copy obj so we don't mutate it and filter
      filteredData = array.map(copy).filter(function x(y) {
        if (y[property].toLowerCase().includes(filterTextLowerCase)) {
          return true;
        }

        if (y[property].includes(filterText)) {
          return true;
        }
        // if children match
        if (y.Children) {
          return (y.Children = y.Children.map(copy).filter(x)).length;
        }
      });
      // no string, return whole array
    } else {
      filteredData = array;
    }

    return filteredData;
  }

  // pass mat input string to recursive function and return data
  filterTree(filterText: string) {
    // use filter input text, return filtered TREE_DATA, use the 'name' object value
    this.dataSource.data = this.filterRecursive(filterText, this.departmentTree, 'DepartmentName');
  }

  // filter string from mat input filter
  applyFilter(filterText: string) {
    this.filterTree(filterText);
    // show / hide based on state of filter string
    if (filterText) {
      this.treeControl.expandAll();
    } else {
      this.treeControl.collapseAll();
    }
  }


  selectDepartment(departmentID: number) {

    this.departmentsService.GetDepartmentByID(departmentID).subscribe(res1 => {

      this.selectedDepartment = res1.data;

      if (this.selectedDepartment.departmentId != 1) {
        this.getParentDepartment(this.selectedDepartment.parentDepartmentId);
      }
    });
  }

  getParentDepartment(pDepID: number) {
    if (pDepID != null) {
      this.departmentsService.GetDepartmentByID(pDepID).subscribe(res => {

        this.parentOfSelectedDepartment = res.data;
      });
    }
  }

  openAddEmployeeToDepartmentDialogue() {
    var modal = document.getElementById("model_AddEmployeeToDepartment")!;
    modal.style.display = 'block';

    this.addEmployeeToDepartmentForm.reset();
    this.addEmployeeToDepartmentForm.setValue({
      'name': this.selectedDepartment.departmentName,
      'selectedUser': ''

    });
  }

  AddEmployeeToDepartment(form: NgForm) {


    let selectedUser = this.usersFiltered.find(x => x.fullName == form.value.selectedUser)!;


    let observable: Observable<ActionResult>;


    observable = this.departmentsService.AddEmployeeToDepartment(selectedUser.userId, this.selectedDepartment.departmentId);
    this.HandleResponse(observable);
    this.selectDepartment(this.selectedDepartment.departmentId);

    this.closeAddEmployeeToDepartmentDialogue();

  }

  closeAddEmployeeToDepartmentDialogue() {
    var modal = document.getElementById("model_AddEmployeeToDepartment")!;
    modal.style.display = 'none';
  }


  openDeactivateDepartmentDialogue() {
    if(this.selectedDepartment.departmentId==1)return;
    var modal = document.getElementById("model_DeactivateDepartment")!;
    modal.style.display = 'block';

    this.deactivateDepartmentForm.reset();
    this.deactivateDepartmentForm.setValue({
      'name': this.selectedDepartment.departmentName,
      'deletedDepartmentName': ''
    });
  }

  DeactivateDepartment(form: NgForm) {    

    if(form.controls.name.value !== form.controls.deletedDepartmentName.value)
    {
      this.showMessage('اسم الإدارة غير مطابق , لم يتم الحذف','error');
      this.closeDeactivateDepartmentDialogue();
      return;
    }

    let observable: Observable<ActionResult>;


    observable = this.departmentsService.DeleteDepartment(this.selectedDepartment.departmentId);
    this.HandleResponse(observable);
    this.selectDepartment(this.selectedDepartment.parentDepartmentId);

    this.closeDeactivateDepartmentDialogue();

  }

  closeDeactivateDepartmentDialogue() {
    var modal = document.getElementById("model_DeactivateDepartment")!;
    modal.style.display = 'none';
  }



  openUpdateDepartmentDialogue() {
    var modal = document.getElementById("model_UpdateDepartment")!;
    modal.style.display = 'block';


    this.updateDepartmentForm.reset();
    this.updateDepartmentForm.setValue({
      'name': this.selectedDepartment.departmentName,
      'typeID': this.selectedDepartment.departmentTypeId,
      'selectedUser': this.selectedDepartment.managerUser ? this.selectedDepartment.managerUser.fullName : ''
    });
  }

  UpdateDepartment(form: NgForm) {

    let managerUserID: number = this.selectedDepartment.managerUser ? this.selectedDepartment.managerUser.userId : -1;
    if (managerUserID == -1 || form.value.selectedUser != this.selectedDepartment.managerUser.fullName) {
      managerUserID = this.usersFiltered.find(x => x.fullName == form.value.selectedUser)?.userId ?? this.selectedDepartment.managerUser.userId;

    }



    let observable: Observable<ActionResult>;

    let department: DepartmentInfo = new DepartmentInfo();
    department.departmentId = this.selectedDepartment.departmentId;
    department.departmentName = form.value.name;
    department.departmentTypeId = form.value.typeID;
    department.managerUserId = managerUserID;

    observable = this.departmentsService.UpdateDepartment(department);
    this.HandleResponse(observable);

    this.closeUpdateDepartmentDialogue();
  }

  closeUpdateDepartmentDialogue() {
    var modal = document.getElementById("model_UpdateDepartment")!;
    modal.style.display = 'none';
  }


  openAddDepartmentDialogue() {
    var modal = document.getElementById("model_AddDepartment")!;
    modal.style.display = 'block';

  }

  AddDepartmentDialogue(form: NgForm) {
    let selectedUser = this.usersFiltered.find(x => x.fullName == form.value.selectedUser);


    let observable: Observable<ActionResult>;

    let department: DepartmentInfo = new DepartmentInfo();
    department.departmentName = form.value.name;
    department.departmentTypeId = form.value.typeID;
    department.managerUserId = selectedUser!.userId;
    department.parentDepartmentId = this.selectedDepartment.departmentId;
    observable = this.departmentsService.AddDepartment(department);
    this.HandleResponse(observable);

    this.closeAddDepartment();

  }




  closeAddDepartment() {
    var modal = document.getElementById("model_AddDepartment")!;
    modal.style.display = 'none';
  }


  openUpdateUserDialog(userID: number) {

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

  getDepartmentTypeName(typeID: number) {
    return this.departmentTypes.find(x => x.id == typeID)?.name
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


  highlight(departmentID: number) {
    if (this.selectedDepartment && this.selectedDepartment.departmentId == departmentID) {
      return 'selected-tree-node pointer-cursor';
    }
    return 'pointer-cursor';
  }
}




