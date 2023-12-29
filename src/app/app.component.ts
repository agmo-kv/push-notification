import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwService } from './sw.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  notificationStatus = false;
  subscription: PushSubscriptionJSON | null = null;

  constructor(private swService: SwService, private http: HttpClient) {}

  ngOnInit(): void {
    this.swService.registerSW();
  }

  async onEnable() {
    const subscription = await this.swService.requestPermission();
    if (!subscription) {
      return;
    }
    console.log(subscription.toJSON());
    this.subscription = subscription.toJSON();
    this.notificationStatus = true;
  }

  onNotify() {
    this.http
      .post('http://localhost:3000/subscribe', this.subscription)
      .subscribe();
  }
}
