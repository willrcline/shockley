const { db } = require('../../../firebase/connection.js')

const PERIOD_COLLECTION = 'periods';

async function getPeriods(userId) {
  try {
    const ref = db.collection(PERIOD_COLLECTION)
    const snapshot = await ref
      .where("accountID", "==", userId)
      .orderBy("dateCreated", "desc")
      .get();

    const docs = snapshot.docs
    return docs.map(doc => doc.data());
  } catch (e) {
    console.error("Error reading all documents: ", e);
    return [];
  }
}

async function getPeriod(periodId) {
  try {
    const periodRef = db.collection(PERIOD_COLLECTION).doc(periodId);
    const doc = await periodRef.get()
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      return doc.data();
    }
  } catch (e) {
    console.error("Error reading period: ", e);
    return null;
  }
}

async function setPeriod(period) {
  try {
    const ref = db.collection(PERIOD_COLLECTION).doc(period.id);
    const docRef = await ref.set(period);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

module.exports = { getPeriods, getPeriod, setPeriod };