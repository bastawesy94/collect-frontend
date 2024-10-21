import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'http://localhost:3030/api/api/contacts'; // Adjust based on your backend API

  constructor(private http: HttpClient) {}

  searchContacts(options: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/search`, options);
  }

  createContact(contact: any): Observable<any> {
    return this.http.post(this.apiUrl, contact);
  }

  deleteContact(contactKey: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${contactKey}`);
  }

  editContact(contactKey: string, contact: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${contactKey}`, contact);
  }

  getContact(contactKey: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${contactKey}`);
  }
}
