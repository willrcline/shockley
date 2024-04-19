const { db } = require('../../../firebase/connection.js')
const { doc, getDoc } = require("firebase-admin/firestore"); 


const ENTRY_DB = 'entries';

async function getEntries(userId) {
  try {
    const ref = db.collection(ENTRY_DB)
    const snapshot = await ref
      .where("accountID", "==", userId)
      .orderBy("dateCreated", "desc")
      .get();

    const docs = snapshot.docs.slice(0, 3);
    console.log(docs.map(doc => doc.data()))
    return docs.map(doc => doc.data());
  } catch (e) {
    console.error("Error reading all documents: ", e);
    return [];
  }
}

async function getEntry(entryId) {
  try {
    const entryRef = db.collection(ENTRY_DB).doc(entryId);
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

async function setEntry(entry) {
  try {
    const ref = db.collection(ENTRY_DB).doc(entry.id);
    const docRef = await ref.set(entry);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

module.exports = { getEntries, getEntry, setEntry };