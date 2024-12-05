import { Component , OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-account-activation',
  templateUrl: './user-account-activation.component.html',
  styleUrls: ['./user-account-activation.component.css']
})
export class UserAccountActivationComponent implements OnInit {
  userId: string | null = null;
  token: string | null = null;
  activationStatus:string='';
  constructor(private route: ActivatedRoute, private http: HttpClient,private router: Router) {}

  ngOnInit(): void {
    // Extract query parameters
    this.route.queryParamMap.subscribe(params => {
      this.userId = params.get('userId');
      this.token = params.get('token');

      if (this.userId && this.token) {
        // Prepare the data to send
        const requestData = {
          userId: this.userId,
          token: this.token
        };

        // Call the API
        this.postActivationData(requestData);
      } else {
        console.error('Missing query parameters');
      }
    });
  }

  postActivationData(data: { userId: string; token: string }): void {
    this.http.get('api/Account?userId='+this.userId+"&token="+this.token)
      .subscribe({
        next: response => {
          console.log('Activation Successful:', response);

          this.activationStatus='success';

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 4000);
        },
        error: error => {
          this.activationStatus='error';

          console.error('Activation Failed:', error);
        }
      });
  }
}