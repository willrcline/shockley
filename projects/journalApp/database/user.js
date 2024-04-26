const { db } = require('../../../firebase/connection.js')
const { doc, getDoc } = require("firebase-admin/firestore"); 


const USER_COLLECTION = 'users';

async function getUser(email) {
  try {
    const entryRef = db.collection(USER_COLLECTION).doc(email);
    const doc = await entryRef.get()
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

module.exports = { getUser };