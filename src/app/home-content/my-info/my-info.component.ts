import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.Service';
import { UsersService } from 'src/app/Services/users.service';
import { NationalityInfo } from 'src/app/models/NationalityInfo.model';
import { UserInfo } from 'src/app/models/UserInfo.model';

@Component({
  selector: 'app-my-info',
  templateUrl: './my-info.component.html',  
  styleUrls: ['../../app.component.css']
})
export class MyInfoComponent implements OnInit {

  user!: UserInfo;
  isDataLoaded!: boolean;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService,  @Inject('BASE_Personal_Images_URL') private baseImagesUrl: string, private userService: UsersService) {

  }


  ngOnInit(): void {

    if (this.authService.isLoggedIn()) {
      this.userService.GetByUserID(+this.authService.getUserId()).subscribe(res => {

        this.user = res.data;
        if (this.user.personalImage != '' && this.user.personalImage != 'null' && this.user.personalImage != undefined) {
          this.user.personalImage = this.baseImagesUrl + this.user.personalImage;
        }
        else{
          this.user.personalImage ="/assets/images/anonumous.png";
        }
        this.isDataLoaded = true;
      });



    }

  }
}
