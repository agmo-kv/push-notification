console.log('Service Worker Loaded...');

self.addEventListener("push", (e) => {
  const data = e.data.json();
  console.log(data);
  console.log("Push Recieved...");
  self.registration.showNotification(data.title, {
    body: "Knock Knock",
  });
});
