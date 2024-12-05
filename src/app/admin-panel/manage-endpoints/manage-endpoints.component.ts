import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { UsersService } from 'src/app/Services/users.service';
import { EndPointInfo } from 'src/app/models/EndPointInfo.model';
import { EndPointsService } from 'src/app/Services/endPoints.service';
import { ItemInfo } from 'src/app/models/ItemInfo.model';
import { ActionResult } from 'src/app/models/ActionResult.model';
import { ViewportScroller } from '@angular/common';
import { EndPointTypeInfo } from 'src/app/models/EndPointTypeInfo.model';

@Component({
  selector: 'app-manage-Endpoints',
  templateUrl: './manage-Endpoints.component.html',
  styleUrls: ['./manage-Endpoints.component.css']
})
export class ManageEndpointsComponent implements OnInit, OnDestroy {
 
  @ViewChild('addEndPointForm', { static: false }) addEndPointForm!: NgForm;
  @ViewChild('updateEndPointsForm', { static: false }) updateEndPointsForm!: NgForm;
  @ViewChild('deleteEndPointForm', { static: false }) deleteEndPointForm!: NgForm;


  selectEndPointID!: number;
  selectedEndPointItem!: ItemInfo;
  selectedEndPointName!: string;
  searchText!:string;
  subscription: Subscription;

  allEndPoints: EndPointInfo[] = [];
  allEndPointsBackUp: EndPointInfo[] = [];


  endPointTypes: EndPointTypeInfo[] = [];


  errorMessage: string = "";
  successMessage: string = "";
  isLoading: boolean = false;


  EndPoint: EndPointInfo = new EndPointInfo();
  EndPointItem: ItemInfo = new ItemInfo()


  constructor(
    private EndPointservice: EndPointsService,
    private viewportScroller: ViewportScroller,
    private router: Router,
    private route: ActivatedRoute) {
    this.subscription = new Subscription();
  }


  ngOnInit(): void {

    this.loadEndPointsTypes();
    this.loadEndPoints();


    this.subscription = this.EndPointservice.EndPointsChanged.subscribe(
      {
        next: (response =>

          this.loadEndPoints()
        ),
        error: (
          error => { }
        ),
        complete: () => { }


      }


    );

  }

  loadEndPoints() {
    this.EndPointservice.GetAllEndPoints().subscribe(res => {
      this.allEndPoints = res.data;
      this.allEndPointsBackUp = this.allEndPoints.map(obj => ({ ...obj }));     

    });
  }


  loadEndPointsTypes() {
    this.EndPointservice.GetAllEndPointTypes().subscribe(res => {
      this.endPointTypes = res.data; 

    });
  }

  onChangeEndPointStatus(EndPoint: EndPointInfo) {
    

    let observable: Observable<ActionResult>;
    observable =  this.EndPointservice.ChangeEndPointStatus(EndPoint);
    this.HandleResponse(observable);
    this.loadEndPoints();
  }


  onAddEndPoint(addEndPointForm: NgForm) {

    
    this.EndPoint.name = addEndPointForm.value.name;   
    this.EndPoint.directory = addEndPointForm.value.directory; 
    this.EndPoint.typeId = addEndPointForm.value.typeId; 
    this.EndPoint.isActive = false;
    let observable: Observable<ActionResult>;
    observable =  this.EndPointservice.AddEndPoint(this.EndPoint);
    this.HandleResponse(observable);

    this.loadEndPoints();
    this.closeAddEndPointModal()
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  openAddEndPointDialog(): void {
    var modal = document.getElementById("model_AddEndPoint")!;
    modal.style.display = 'block';
  }

  closeAddEndPointModal(): void {
    var modal = document.getElementById("model_AddEndPoint")!;
    modal.style.display = 'none';
  }


  openUpdateEndPointDialog(sEndPointId: number): void {
    var modal = document.getElementById("model_UpdateEndPoint")!;
 

    let selectedEndPoint = this.allEndPoints.find(x => x.id == sEndPointId)!;


    modal.style.display = 'block';

    this.updateEndPointsForm.setValue({
      'id': selectedEndPoint.id, 'name': selectedEndPoint.name,'directory':selectedEndPoint.directory,'typeId':selectedEndPoint.typeId
    });


   

  }

  onUpdateEndPoints(updateForm: NgForm) {

   
    let selectedEndPoint = this.allEndPoints.find(x => x.id == updateForm.value.id)!;

    this.EndPoint.id=updateForm.value.id;
    this.EndPoint.name = updateForm.value.name;
    this.EndPoint.directory=updateForm.value.directory;
    this.EndPoint.typeId=updateForm.value.typeId;
    


    let observable: Observable<ActionResult>;
    observable = this.EndPointservice.UpdateEndPoint(this.EndPoint);
    this.HandleResponse(observable);

    this.loadEndPoints();
    this.closeUpdateEndPointsModal();
  }

  closeUpdateEndPointsModal(): void {
    var modal = document.getElementById("model_UpdateEndPoint")!;
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


    this.allEndPoints = [];

    this.allEndPoints = this.allEndPointsBackUp.map(obj => ({ ...obj }));

    if (this.searchText.length > 1) {
      let searchValue = this.searchText;

      for (let i = 0; i < this.allEndPoints.length; i++) {

        if (this.searchText != '') {
          this.allEndPoints = this.allEndPoints.filter(srv => srv.name.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0 );
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

  

  GetEndPointTypeName(typeId:number)
  {
    return this.endPointTypes.find(x=>x.id==typeId)?.name;
  }

}
