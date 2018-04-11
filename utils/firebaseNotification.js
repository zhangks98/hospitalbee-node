
var admin = require("firebase-admin");
var secrets = require("../secrets");
var serviceAccount = secrets.serviceAccount;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-testings-e032e.firebaseio.com"
});

var payload = {
  notification: {
    title: "NASDAQ News",
    body: "The NASDAQ climbs for the second day. Closes up 0.60%.",
    priority: "high",
    sound : "default"
  }
};
var topic = "news";

admin.messaging().sendToTopic(topic, payload)
  .then(function(response) {
    console.log("Successfully sent message:", response);
  })
  .catch(function(error) {
    console.log("Error sending message:", error);
  });