var admin = require("firebase-admin");
var { getFirestore } = require("firebase-admin/firestore");


var serviceAccount = require("./serviceKeys/journal-app.json");

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = getFirestore(app);

module.exports = { db };