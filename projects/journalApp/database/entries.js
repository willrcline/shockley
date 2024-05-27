const { db } = require('../../../firebase/connection.js')

const ENTRY_COLLECTION = 'entries';

async function getEntries(userId) {
  try {
    const ref = db.collection(ENTRY_COLLECTION)
    const snapshot = await ref
      .where("accountID", "==", userId)
      .orderBy("dateCreated", "desc")
      .get();

    // const docs = snapshot.docs.slice(0, 3);
    const docs = snapshot.docs
    // console.log(docs.map(doc => doc.data()))
    return docs.map(doc => doc.data());
  } catch (e) {
    console.error("Error reading all documents: ", e);
    return [];
  }
}

async function getEntriesInPeriod(userId, startDate, endDate) {
  const allEntries = await getEntries(userId);

  return allEntries.filter(entry => {
    const entryDate = entry.dateCreated
    return entryDate >= startDate && entryDate <= endDate;
  });
}


async function getEntry(entryId) {
  try {
    const entryRef = db.collection(ENTRY_COLLECTION).doc(entryId);
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
    const ref = db.collection(ENTRY_COLLECTION).doc(entry.id);
    const docRef = await ref.set(entry);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

module.exports = { getEntries, getEntriesInPeriod, getEntry, setEntry };