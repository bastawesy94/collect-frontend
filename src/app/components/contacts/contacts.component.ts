import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatTableModule, MatIconModule],
  templateUrl: './contacts.component.html'
})
export class ContactsComponent implements OnInit {
  contacts: any[] = [];
  contactForm: FormGroup;
  page = 1; // Initialize the page number
  limit = 5; // Number of contacts per page

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      address: ['', Validators.required],
      notes: [''],
      phone: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.fetchContacts();
  }

  fetchContacts() {
    const token = localStorage.getItem('token');
    const requestPayload = {
      limit: this.limit,
      page: this.page,
      select: ['id', 'key', 'address', 'phone', 'notes'] // Include 'key' field here
    };

    this.http.post('http://localhost:3030/api/contacts/search', requestPayload, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      (response: any) => {
        this.contacts = response.data;
      },
      (error) => {
        console.error('Error fetching contacts', error);
      }
    );
  }

  addContact() {
    const token = localStorage.getItem('token');
    const userKey = this.extractUserKeyFromToken(token);
    const { address, notes, phone } = this.contactForm.value;

    this.http.post('http://localhost:3030/api/contacts', { userKey, address, notes, phone }, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      () => {
        this.fetchContacts();
        this.contactForm.reset();
      },
      (error) => {
        console.error('Error adding contact', error);
      }
    );
  }

  deleteContact(contactKey: string) {
    const token = localStorage.getItem('token');
    if (confirm('Are you sure you want to delete this contact?')) {
      this.http.delete(`http://localhost:3030/api/contacts/${contactKey}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe(
        () => {
          this.fetchContacts(); // Refresh the contacts list
        },
        (error) => {
          console.error('Error deleting contact', error);
        }
      );
    }
  }

  editContact(contact: any) {
    const token = localStorage.getItem('token');
    const { address, notes, phone } = this.contactForm.value;

    this.http.put(`http://localhost:3030/api/contacts/${contact.key}`, { address, notes, phone }, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      () => {
        this.fetchContacts();
      },
      (error) => {
        console.error('Error editing contact', error);
      }
    );
  }

  nextPage() {
    this.page++;
    this.fetchContacts();
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.fetchContacts();
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
