const { db } = require('../../../firebase/connection.js');
const { doc, getDoc, where, query } = require("firebase-admin/firestore"); 

const USER_COLLECTION = 'users';

async function getUserByEmail(email) {
  try {
    const entryRef = db.collection(USER_COLLECTION).doc(email);
    const doc = await entryRef.get();
    console.log(doc.data());
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      return doc.data();
    }
  } catch (e) {
    console.error("Error reading entry: ", e);
    return null;
  }
}

async function getUserById(id) {
  try {
    const querySnapshot = await db.collection(USER_COLLECTION).where('id', '==', id).get();
    if (querySnapshot.empty) {
      console.log('No matching documents!');
    } else {
      const doc = querySnapshot.docs[0];
      console.log('doc.data().bio', doc.data().bio)
      return doc.data();
    }
  } catch (e) {
    console.error("Error reading entry: ", e);
    return null;
  }
}

getUserById("f5bb39e3-fd12-4aee-9788-882a9e587ee9")


module.exports = { getUserByEmail, getUserById };