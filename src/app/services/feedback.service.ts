import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  // key = '6iiLMDdWejJrMi831uTdnZg4vSWlguwLBjbw5962Zu5EPA6c8xvKyhItme6hFWTs';
  // id = '11045';
  key = 'aDo8GkNKKeKHjb0XSt37EeqwibFFiPOSWqzpPYVIWZZYLhZ38iUU3CxLNL4fWP0I';
  id = '11054';

  constructor(private http: HttpClient) {}

  submit(data) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(`https://doorbell.io/api/applications/${this.id}/submit?key=${this.key}`, data, {
      headers,
      responseType: 'text',
    });
  }

  upload(data) {
    return this.http.post(`https://doorbell.io/api/applications/${this.id}/upload?key=${this.key}`, data);
  }
}
