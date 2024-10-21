import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.http.post('http://localhost:3030/api/login', { username, password }).subscribe(
        (response: any) => {
          const token = response.token;
          if (token) {
            localStorage.setItem('token', token);
            const userKey = this.extractUserKeyFromToken(token);
            console.log('UserKey:', userKey);  // You can use this userKey elsewhere
            this.router.navigate(['/contacts']);  // Navigate to contacts on successful login
          }
        },
        (error) => {
          console.error('Login error', error);
        }
      );
  }
    }
    extractUserKeyFromToken(token: string | null): string {
        if (!token) {
          throw new Error('No token provided');
        }
      
        // Decode JWT token to extract the payload
        const jwtHelper = new JwtHelperService();
        const decodedToken = jwtHelper.decodeToken(token);
      
        // Check if the token contains the 'userKey' field
        if (decodedToken && decodedToken.key) {
          return decodedToken.key;
        } else {
          throw new Error('userKey not found in token');
        }
      }
}
