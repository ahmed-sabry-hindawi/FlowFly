import { Component } from '@angular/core';
import { Form, NgForm } from '@angular/forms';
import { AuthResponseData, AuthService } from '../../Services/auth.Service';
import { catchError, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs-compat';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  constructor(private authService: AuthService,private router:Router) {

  }
  
  isLoading = false;
  errorMessage:string='';
  successMessage:string='';
  showPassword:boolean=false;

 

  onSubmitForm(authForm: NgForm) {

    let authObservable:Observable<AuthResponseData>;
    if (!authForm.valid) {
      return;
    }
    this.isLoading = true;

    const email = authForm.value.email;
    const password = authForm.value.password;


      authObservable=this.authService.signIn(email, password) ; 
    

    authObservable.subscribe(
      responseDate => {
        console.log(responseDate);
        this.isLoading = false;
        this.successMessage='تم تسجيل الدخول بنجاح ';
        this.errorMessage='';

        setTimeout(() => {
          this.router.navigate(['/home/my-services']);
      }, 500);
       
      },
      resultError => {
        console.log('error ' + resultError);
        this.isLoading = false;
        this.errorMessage=resultError;
        this.successMessage='';
      }
    );

    authForm.reset();
 
  }


  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }


}
