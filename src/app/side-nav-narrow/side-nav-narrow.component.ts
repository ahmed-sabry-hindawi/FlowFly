import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.Service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-side-nav-narrow',
  templateUrl: './side-nav-narrow.component.html',
  styleUrls: ['./side-nav-narrow.component.css']
})
export class SideNavNarrowComponent implements OnInit,OnDestroy{

  options = this._formBuilder.group({
    bottom: 0,
    fixed: false,
    top: 0,
  });

  isAuthenticated:boolean=true;



  constructor(private authService:AuthService,private router:Router,private _formBuilder: FormBuilder)
  {

  }


  ngOnInit(): void {

    if(this.authService.isLoggedIn())
    {
   
    }
    else
    {
      //this.router.navigate(['/login']);
    }


  }

  ngOnDestroy(): void {
  }
    
  
}