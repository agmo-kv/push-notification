import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SwService {
  private isPushNotificationsSupported =
    'serviceWorker' in navigator && 'PushManager' in window;
  private serviceWorkerRegistration?: ServiceWorkerRegistration;

  async registerSW(): Promise<void> {
    if (!this.isPushNotificationsSupported) {
      return;
    }
    console.log('Registering service worker...');
    /*
    Register the service worker file
    Store a reference to the returned ServiceWorkerRegistration Object
     */
    try {
      const registration = await navigator.serviceWorker.register(
        '/assets/sw.js'
      );
      this.serviceWorkerRegistration = registration;
      console.log('Service worker registered...', registration);
      this.registerAngularClient();
    } catch (err) {
      console.error('Failed to register service worker: ', err);
    }
  }

  async registerAngularClient(): Promise<void> {
    console.log('Registering angular client connection...');
    // PING to service worker, later we will use this ping to identify our application
    this.serviceWorkerRegistration!.active?.postMessage('angular-client');

    // listening for messages from service worker
    navigator.serviceWorker.addEventListener('message', function (event) {
      const messageFromSW = event.data;
      console.log('message from SW: ' + messageFromSW);
      // you can also send a stringified JSON and then do a JSON.parse() here.
    });
    console.log('Angular Client connection registered...');
  }

  async requestPermission(): Promise<PushSubscription | undefined> {
    if (!this.isPushNotificationsSupported || !this.serviceWorkerRegistration) {
      return;
    }

    /*
    Request permission for push notifications
    If permission is granted, configure the push subscription
     */
    try {
      const userChoice = await Notification.requestPermission();
      if (userChoice !== 'granted') {
        throw new Error('Permission not granted');
      }
      return this.configurePushSubscription();
    } catch (err) {
      console.error('Failed to request permission: ', err);
      return;
    }
  }

  async configurePushSubscription(): Promise<PushSubscription | undefined> {
    const pushManager = this.serviceWorkerRegistration!.pushManager;

    /*
    Get the current push subscription
    If a subscription exists, return it
    If no subscription exists, create a new subscription and return it
     */
    try {
      const subscription = await pushManager.getSubscription();
      if (subscription) {
        return subscription;
      }
      console.log('Configuring PushSubscription...');
      const newSubscription = await pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlB64ToUint8Array(
          'BBys2F0oVAtbDmFIL-cCUqq8fT9OhVUrFF6ujPetU1wXYw5ECo2vFDgswxYmUGAkc3DbgYzqrQ5iNFmizY9qA6s'
        ), //! environment.vapidPublicKey
      });
      console.log('PushSubscription generated...');
      return newSubscription;
    } catch (err) {
      console.error('Failed to configure push subscription: ', err);
      return;
    }
  }

  private urlB64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}
