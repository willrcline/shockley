var admin = require("firebase-admin");
var { getFirestore } = require("firebase-admin/firestore");


var serviceAccount = require("./serviceKeys/journal-app-951a8-firebase-adminsdk-ekqtx-5a6dc81d4d.json");

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = getFirestore(app);

module.exports = { db };