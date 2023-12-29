console.log("Service Worker Loaded...");

/*
  This service worker is responsible for handling push notifications
  and communicating with the angular application
 */
let angularClient;
self.addEventListener("message", (e) => {
  // if message is a "angular-client" string,
  // we store a reference to the client
  if (e.data == "angular-client") {
    angularClient = e.source;
  }
});

self.addEventListener("push", (e) => {
  const data = e.data.json();
  console.log("Push Recieved...");
  // Show notification using the device notification feature
  self.registration.showNotification(data.title, {
    body: "Knock Knock",
  });
  // Communicate notification event from service worker to angular application
  angularClient.postMessage('{"data": "angular app, please do your magic" }');
});
