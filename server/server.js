const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
const PushNotifications = require('node-pushnotifications');

const app = express();

// Set static path
app.use(express.static(path.join(__dirname, 'client')));

app.use(bodyParser.json());
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', '*');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

const publicVapidKey = 'BBys2F0oVAtbDmFIL-cCUqq8fT9OhVUrFF6ujPetU1wXYw5ECo2vFDgswxYmUGAkc3DbgYzqrQ5iNFmizY9qA6s'; // REPLACE_WITH_YOUR_KEY
const privateVapidKey = 'ESwzr_JWi9p5pxc7AhY9bHmvFs7l0kRK1emYpiPyU_k'; //REPLACE_WITH_YOUR_KEY

app.post('/subscribe', (req, res) => {
    // Get pushSubscription object
    const subscription = req.body;
    console.log('payload', subscription);
    const settings = {
        web: {
            vapidDetails: {
                subject: 'mailto:skteh@agmostudio.com', // REPLACE_WITH_YOUR_EMAIL
                publicKey: publicVapidKey,
                privateKey: privateVapidKey,
            },
            gcmAPIKey: 'gcmkey',
            TTL: 2419200,
            contentEncoding: 'aes128gcm',
            headers: {},
        },
        isAlwaysUseFCM: false,
    };

    // Send 201 - resource created
    const push = new PushNotifications(settings);

    // Create payload
    const payload = { title: 'Notification FROM TTTSSSSSSSS' };
    push.send(subscription, payload, (err, result) => {
        if (err) {
            console.log('failed', err);
        } else {
            console.log('success', result);
        }
    });

    res.status(200).json({ result: true });
});

app.get('/sk-demo', (req, res) => {
    // From Frontend to Backend & store in database.
    const subscription = {
        endpoint:
            'https://fcm.googleapis.com/fcm/send/fKylczPhnpA:APA91bEpjKoawk8crswzgXxTsZTjM1AhtadaDdTCwG7Xa7nYUPlnk3edplYM3_TwuuWDWwBHMW7Us0_IV3hQIaNbBO1iSZZUFAUpZtxGRwYu3Hw-L1Meqb_LU3EFoS5PqSO_A2gbZ2Lg',
        expirationTime: null,
        keys: {
            p256dh: 'BLZghrnbbv5kZqIJJOMXfSpSpD7jaaOj9rxv59dVWPVWZjzuIEytFj-6IOJyQLtP6GXD2PebCuz1-qS9ENECq_0',
            auth: 't1lCLIKPaW3hEt4S4dkj3w',
        },
    };
    const settings = {
        web: {
            vapidDetails: {
                subject: 'mailto:skteh@agmostudio.com', // REPLACE_WITH_YOUR_EMAIL
                publicKey: publicVapidKey,
                privateKey: privateVapidKey,
            },
            gcmAPIKey: 'gcmkey',
            TTL: 2419200,
            contentEncoding: 'aes128gcm',
            headers: {},
        },
        isAlwaysUseFCM: false,
    };

    const push = new PushNotifications(settings);
    const payload = { title: 'Secara amnye, this is title' };
    push.send(subscription, payload, (err, result) => {
        if (err) {
            console.log('demo failed', err);
        } else {
            console.log('demo success', result, result[0].message);
        }
    });

    res.send(200);
});

const port = 3100;

app.listen(port, () => console.log(`Server started on port ${port}`));
