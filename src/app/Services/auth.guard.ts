import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChildFn, CanActivateFn, CanLoadFn, CanMatchFn, NavigationExtras, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "./auth.Service";
import { BehaviorSubject, Observable } from "rxjs";

// @Injectable({providedIn: 'root'})
// export class AuthGuard implements CanActivate {

//     //isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
//     // isLoggedIn$: Observable<boolean> = this.isLoggedIn.asObservable();

//   constructor(
//     private authService: AuthService, 
//     private router: Router
//   ) {}

//   canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean 
//   {
//     let url: string = state.url;
//     return this.checkLogin(url);
//   }

//   checkLogin(url: string): boolean {
//      if (this.authService.isLoggedIn()) {
       
//       return true;
//     } else {
      
//         this.router.navigate([url]);
//       return false;
//     } 
    
//   }
// }


export const authGuard: CanMatchFn|CanActivateChildFn|CanActivateFn = () => {
    const router = inject(Router);
    const authService = inject(AuthService);
  
    if (authService.isLoggedIn()) {
      return true;
    }
  
    // Create a dummy session id
    const sessionId = 123456789;
  
    // Set our navigation extras object
    // that contains our global query params and fragment
    const navigationExtras: NavigationExtras = {
      queryParams: { session_id: sessionId },
      fragment: 'anchor'
    };
  
    // Navigate to the login page with extras
    //return router.createUrlTree(['/login'], navigationExtras);

    // Create a UrlTree
  const urlTree = router.createUrlTree(['/login'], navigationExtras);
  
  // Navigate using the UrlTree
  return router.navigateByUrl(urlTree);

  };


  export const adminGuard: CanMatchFn|CanActivateChildFn|CanActivateFn = () => {
    const router = inject(Router);
    const authService = inject(AuthService);
  
    if (authService.isAdmin()) {
      return true;
    }
  
    // Create a dummy session id
    const sessionId = 123456789;
  
    // Set our navigation extras object
    // that contains our global query params and fragment
    const navigationExtras: NavigationExtras = {
      queryParams: { session_id: sessionId },
      fragment: 'anchor'
    };
  
    // Navigate to the login page with extras
    return router.createUrlTree(['/home/my-services'], navigationExtras);
  };


