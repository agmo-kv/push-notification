import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SwService {
  private isServiceWorkerSupported = 'serviceWorker' in navigator;
  private isPushManagerSupported = 'PushManager' in window;
  isSupported = this.isServiceWorkerSupported && this.isPushManagerSupported;
  private serviceWorkerRegistration?: ServiceWorkerRegistration;

  async registerSW(): Promise<void> {
    console.log('Registering service worker...');
    try {
      const registration = await navigator.serviceWorker.register(
        '/assets/sw.js'
      );
      this.serviceWorkerRegistration = registration;
      console.log('Service worker registered...', registration);
    } catch (err) {
      console.error('Failed to register service worker: ', err);
    }
  }

  async requestPermission(): Promise<PushSubscription | undefined> {
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
    if (!this.serviceWorkerRegistration) {
      console.error('Service Worker not registered');
      return;
    }
    const subscription =
      await this.serviceWorkerRegistration.pushManager.getSubscription();
    if (subscription) {
      return subscription;
    }
    console.log('Configuring PushSubscription...');
    const newSubscription =
      await this.serviceWorkerRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlB64ToUint8Array(
          'BBys2F0oVAtbDmFIL-cCUqq8fT9OhVUrFF6ujPetU1wXYw5ECo2vFDgswxYmUGAkc3DbgYzqrQ5iNFmizY9qA6s'
        ), //! environment.vapidPublicKey
      });
    console.log('PushSubscription generated...');
    return newSubscription;
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
