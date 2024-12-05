import { Component, OnInit } from '@angular/core';
import { Form, NgForm } from '@angular/forms';
import { AuthResponseData, AuthService } from '../../Services/auth.Service';
import { catchError, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs-compat';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/Services/users.service';
import { NationalityInfo } from 'src/app/models/NationalityInfo.model';
import { RegistrationDTO } from 'src/app/models/RegistrationDTO.model';
import { UserInfo } from 'src/app/models/UserInfo.model';
import { DatePipe, ViewportScroller } from '@angular/common';
import { ActionResult } from 'src/app/models/ActionResult.model';
import { AttachmentInfo } from 'src/app/models/Attachment.model';
import { SiteSettingsService } from 'src/app/Services/siteSettings.Service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  attachment!: AttachmentInfo;
  dobStartDate: Date = new Date('01/01/1990');
  isLoading = false;
  errorMessage: string = '';
  successMessage: string = '';
  nationalities: NationalityInfo[] = [];
  filteredNationalities: NationalityInfo[] = [];
  dto: RegistrationDTO = new RegistrationDTO();
  minDate!: Date;
  maxDate!: Date;
  showPassword:boolean=false;
  allowedEmailExtension:string='';

  constructor(
    
    private authService: AuthService,
    private viewportScroller: ViewportScroller,
    private usersService: UsersService,
    private settingService:SiteSettingsService,
    private datePipe: DatePipe,
    private router: Router) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 90, 0, 1);
    this.maxDate = new Date(currentYear - 14, 11, 31);

  }

  ngOnInit(): void {

    this.settingService.getSettingByKey('AllowedUsersEmailDomain').subscribe(res => {
      this.allowedEmailExtension= res.data.settingValue;
    });


    this.usersService.GetAllNationalities().subscribe(res => {

      this.nationalities = res.body?.data;
      this.filteredNationalities = this.nationalities.map(obj => ({ ...obj }));
    });
  }


  onTypeUserName(event: KeyboardEvent) {

    var input = <HTMLInputElement>event.srcElement;
    if (input.value.length >= 0) {

      let temp: NationalityInfo[] = [];
      temp = this.nationalities.filter(x => x.name.toLowerCase().indexOf(input.value.toLowerCase()) >= 0);
      this.filteredNationalities = temp.map(obj => ({ ...obj }));
    }
  }





  onSubmitForm(registrationForm: NgForm) {


    let authObservable: Observable<ActionResult>;
    if (!registrationForm.valid) {
      return;
    }
    this.isLoading = true;

    if(this.allowedEmailExtension!='' && this.allowedEmailExtension.toLowerCase() !=registrationForm.value.email.split('@')[1].toLowerCase() )
    {
      this.errorMessage="لاحقة الايميل المسموحة : "+this.allowedEmailExtension.toLowerCase()+" فقط";
      this.isLoading = false;
      this.viewportScroller.scrollToAnchor('pageContainer');
     return ;

    }

    this.dto.userName = registrationForm.value.email.split('@')[0];
    this.dto.email = registrationForm.value.email;
    this.dto.password = registrationForm.value.password;
    this.dto.profile = new UserInfo();

    this.dto.profile.fullName = registrationForm.value.name;
    this.dto.profile.gender = registrationForm.value.gender;
    this.dto.profile.NationalityId = this.nationalities.find(x => x.name == registrationForm.value.selectNationality)?.id!;
    this.dto.profile.userName = registrationForm.value.email;
    this.dto.profile.jobTitle = registrationForm.value.jobTitle;
    this.dto.profile.dob = this.datePipe.transform(registrationForm.value.dob, 'yyyy-MM-dd')!;
    if (this.attachment != null) {
      this.dto.profile.newFileContent = this.attachment.FileContent;
      this.dto.profile.newFileExtension = this.attachment.FileExtension;
    }

    authObservable = this.authService.signUp(this.dto);

    this.viewportScroller.scrollToAnchor('pageContainer');
    authObservable.subscribe(
      responseDate => {
        console.log(responseDate);
        this.isLoading = false;
        this.successMessage = responseDate.resultMessage;
        this.errorMessage = '';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 4000);

      },
      resultError => {
        console.log('error ' + resultError);
        this.isLoading = false;
        this.errorMessage = resultError;
        this.successMessage = '';
        return false;
      }
    );

  }



  onFileSelected(event: any) {
    const inputNode: any = document.querySelector('#personalImage');

    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e: any) => {
        this.attachment = {
          FileName: 'personalImage',
          ElementID: '1',
          FileContent: reader.result!.toString().replace(/^data:(.*,)?/, ''),
          FileExtension: event.target.files[0].name.split('.')[1]
        }
      }
    }
  }



  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }


}
