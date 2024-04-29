const { db } = require('../../../firebase/connection.js')
const { getYearTimespans } = require('./bulkCreatePeriods.js')
const { DateTime } = require("luxon");

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

async function deletePeriodsByUserId(userId) {
  try {
    const ref = db.collection(PERIOD_COLLECTION);
    const snapshot = await ref.where("accountID", "==", userId).get();

    if (snapshot.empty) {
      console.log("No matching documents to delete.");
      return;
    }

    snapshot.forEach(async (doc) => {
      await doc.ref.delete();
    });

    console.log(`Deleted ${snapshot.size} documents for userId ${userId}`);
  } catch (e) {
    console.error("Error deleting documents: ", e);
  }
}

async function getCurrentPeriod(type, userId) {
  try {
    const now = DateTime.now().toJSDate();

    const ref = db.collection(PERIOD_COLLECTION);
    const snapshot = await ref
      .where("accountID", "==", userId) 
      .where("type", "==", type)
      .where("periodStartDate", "<=", now)
      .where("periodEndDate", ">=", now)
      .limit(1)
      .get();

    if (snapshot.empty) {
      console.log("No matching current period found.");
      return null; // No current period for the specified type
    }

    // Return the ID of the first matching document
    const doc = snapshot.docs[0];
    console.log("Current period found: ", doc.id);
    console.log(doc.periodStartDate, doc.periodEndDate)
    return doc.id;
  } catch (e) {
    console.error("Error retrieving current period: ", e);
    return null;
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

async function bulkAddPeriods(userId) {
  const timespans = getYearTimespans()
  console.log("timespans length___", timespans.length)
  timespans.forEach(async (timespan) => {
    const period = {
      ...timespan,
      accountID: userId,
    }
    const res = await db.collection('periods').add(period)
    console.log("bulkAddPeriods res.id___", res.id)
  }

)
}

getCurrentPeriod('week', 'f5bb39e3-fd12-4aee-9788-882a9e587ee9')
// bulkAddPeriods('f5bb39e3-fd12-4aee-9788-882a9e587ee9')
// deletePeriodsByUserId('f5bb39e3-fd12-4aee-9788-882a9e587ee9')
  

module.exports = { getPeriods, getPeriod, setPeriod, bulkAddPeriods, getCurrentPeriod, deletePeriodsByUserId };