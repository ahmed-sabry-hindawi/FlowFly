import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { UsersService } from 'src/app/Services/users.service';
import { DataSourceInfo } from 'src/app/models/DataSourceInfo.model';
import { DataSourcesService } from 'src/app/Services/dataSources.Service';
import { ItemInfo } from 'src/app/models/ItemInfo.model';
import { ActionResult } from 'src/app/models/ActionResult.model';
import { ViewportScroller } from '@angular/common';


@Component({
  selector: 'app-manage-data-sources',
  templateUrl: './manage-data-sources.component.html',
  styleUrls: ['../../app.component.css']
})
export class ManageDataSourcesComponent implements OnInit, OnDestroy {
  [x: string]: any;

  @ViewChild('updateDataSourcesForm', { static: false }) updateDataSourcesForm!: NgForm;
  @ViewChild('AdditemToDataSourceForm', { static: false }) AdditemToDataSourceForm!: NgForm;
  @ViewChild('deleteDataSourceForm', { static: false }) deleteDataSourceForm!: NgForm;

  selectDataSourceID!: number;
  selectedDataSourceItem!: ItemInfo;
  selectedDataSourceName!: string;

  subscription: Subscription;
  // subscription2: Subscription;

  allDataSources: DataSourceInfo[] = [];
  allDataSourcesBackUp: DataSourceInfo[] = [];
  errorMessage: string = "";
  successMessage: string = "";
  isLoading: boolean = false;


  DataSource: DataSourceInfo = new DataSourceInfo();
  dataSourceItem: ItemInfo = new ItemInfo()


  constructor(
    private DataSourceservice: DataSourcesService,
    private usersService: UsersService,
    private viewportScroller: ViewportScroller,
    private router: Router,
    private route: ActivatedRoute) {
    this.subscription = new Subscription();
  }


  ngOnInit(): void {

    this.DataSourceservice.GetAllDataSources().subscribe(res => {

      this.allDataSources = res.data;
      this.allDataSourcesBackUp = this.allDataSources.map(obj => ({ ...obj }));
    });


    this.subscription = this.DataSourceservice.DataSourcesChanged.subscribe(
      {
        next: (response =>

          this.loadDataSources()
        ),
        error: (
          error => { }
        ),
        complete: () => { }


      }


    );





  }

  loadDataSources() {
    this.DataSourceservice.GetAllDataSources().subscribe(res => {
      this.allDataSources = res.data;
      this.allDataSourcesBackUp = this.allDataSources.map(obj => ({ ...obj }));
      

    });
  }

  onChangeDataSourceStatus(DataSource: DataSourceInfo) {
    

    let observable: Observable<ActionResult>;
    observable =  this.DataSourceservice.ChangeDataSourceStatus(DataSource);
    this.HandleResponse(observable);
    this.loadDataSources();
  }


  onAddDataSource(addSourceForm: NgForm) {

    this.DataSource.name = addSourceForm.value.name;
    this.DataSource.arName = addSourceForm.value.arName;
    this.DataSource.dataSourceItems = [];
   

    let observable: Observable<ActionResult>;
    observable =  this.DataSourceservice.AddDataSource(this.DataSource);
    this.HandleResponse(observable);

    this.loadDataSources();
    this.closeAddDataSourceModal()
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  openAddDataSourceDialog(): void {
    var modal = document.getElementById("model_AddDataSource")!;
    modal.style.display = 'block';
  }

  closeAddDataSourceModal(): void {
    var modal = document.getElementById("model_AddDataSource")!;
    modal.style.display = 'none';
  }


  openUpdateDataSourceDialog(sDataSourceId: number): void {
    var modal = document.getElementById("model_UpdateDataSource")!;
 

    let selectedDataSource = this.allDataSources.find(x => x.id == sDataSourceId)!;


    modal.style.display = 'block';

    this.updateDataSourcesForm.setValue({
      'id': selectedDataSource.id, 'name': selectedDataSource.name,'arName':selectedDataSource.arName
    });   

  }

  onUpdateDataSources(updateForm: NgForm) {

   
    let selectedDataSource = this.allDataSources.find(x => x.id == updateForm.value.id)!;

    this.DataSource.id=updateForm.value.id;
    this.DataSource.name = updateForm.value.name;
    this.DataSource.arName = updateForm.value.arName;
    this.DataSource.dataSourceItems=selectedDataSource.dataSourceItems;
    this.DataSource.isActive=selectedDataSource.isActive;
    this.DataSource.createdBy=selectedDataSource.createdBy;
    this.DataSource.createdOn=selectedDataSource.createdOn;


    let observable: Observable<ActionResult>;
    observable = this.DataSourceservice.UpdateDataSource(this.DataSource);
    this.HandleResponse(observable);

    this.loadDataSources();
    this.closeUpdateDataSourcesModal();
  }

  closeUpdateDataSourcesModal(): void {
    var modal = document.getElementById("model_UpdateDataSource")!;
    modal.style.display = 'none';
  }






  openAddItemToDataSourceDialog(dataSourceID: number): void {
    var modal = document.getElementById("model_AddItemToDataSources")!;
    modal.style.display = 'block';

 
    this.selectDataSourceID = dataSourceID;
  }


  closeAddItemToDataSourceDialog(): void {
    var modal = document.getElementById("model_AddItemToDataSources")!;
    modal.style.display = 'none';
  }



  onAddItemToDataSource(addItemToDataSourceForm: NgForm) {
    this.isLoading = true;
    this.dataSourceItem.name = addItemToDataSourceForm.value.name;
    this.dataSourceItem.arName = addItemToDataSourceForm.value.arName;
    this.dataSourceItem.isActive = false;
    this.dataSourceItem.DataSourceId = this.selectDataSourceID;


    let observable: Observable<ActionResult>;
    observable = this.DataSourceservice.AddItemToDataSource(this.dataSourceItem);
    this.HandleResponse(observable);    


    this.loadDataSources();
    this.closeAddItemToDataSourceDialog();


  }


  onCloseDeleteItemFromDataSource() {
    var modal = document.getElementById("model_DeleteItem")!;
    modal.style.display = 'none';
  }

  onOpenDeleteItemFromDataSource(item: ItemInfo, dataSourceName: string) {
    this.selectedDataSourceItem = item;
    this.selectedDataSourceName = dataSourceName;




    var modal = document.getElementById("model_DeleteItem")!;
    modal.style.display = 'block';

    this.deleteDataSourceForm.setValue({ 'itemName': item.arName, 'souceName': dataSourceName });
  }


  onDeleteItemFromDataSource() {

    let observable: Observable<ActionResult>;
    observable = this.DataSourceservice.DeleteItemFromDataSource(this.selectedDataSourceItem);

    this.HandleResponse(observable);

    this.loadDataSources();
    this.onCloseDeleteItemFromDataSource();

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


    this.allDataSources = [];

    this.allDataSources = this.allDataSourcesBackUp.map(obj => ({ ...obj }));

    if (this.searchText.length > 1) {
      let searchValue = this.searchText;

      for (let i = 0; i < this.allDataSources.length; i++) {

        if (this.searchText != '') {
          this.allDataSources = this.allDataSources.filter(srv => srv.name.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0 || srv.arName.indexOf(searchValue) >= 0);
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
