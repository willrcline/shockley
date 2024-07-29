const { db } = require('../../../firebase/connection.js')
const { getYearTimespans } = require('./bulkCreatePeriods.js')
const { DateTime } = require("luxon");

const PERIOD_COLLECTION = 'periods';

async function getPeriods() {
  try {
    const ref = db.collection(PERIOD_COLLECTION)
    const snapshot = await ref
      .orderBy("dateCreated", "desc")
      .get();

    const docs = snapshot.docs
    return docs.map(doc => doc.data());
  } catch (e) {
    console.error("Error reading all documents: ", e);
    return [];
  }
}

async function getCurrentPeriod(type) {
  try {
    const now = DateTime.now().toJSDate();

    const ref = db.collection(PERIOD_COLLECTION);
    const snapshot = await ref
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
    console.log(doc.data())
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

async function bulkAddPeriods() {
  const periods = getYearTimespans()
  console.log("periods length___", periods.length)
  periods.forEach(async (period) => {
    const res = await db.collection('periods').add({...period, dateCreated: new Date()})
    console.log("bulkAddPeriods res.id___", res.id)
  }
  )
}

async function deletePeriodsBeforeDate(date) {
  //delete all periods before a firestore timestamp
  console.log('period deletePeriodsBeforeDate date___', date)
  try {
    const ref = db.collection(PERIOD_COLLECTION)
    const snapshot = await ref
      .where("dateCreated", "<", date)
      .get();
    snapshot.forEach(doc => {
      console.log("deleting period: ", doc.id)
      doc.ref.delete();
    });
    const snapshotWithoutDateCreated = await ref.get();
    snapshotWithoutDateCreated.forEach(doc => {
      if (!doc.data().dateCreated) {
        console.log("deleting period without dateCreated: ", doc.id);
        doc.ref.delete();
      }
    });
  } catch (e) {
    console.error("Error deleting documents: ", e);
  }
}

async function deleteAllPeriods() {
  try {
    const ref = db.collection(PERIOD_COLLECTION)
    const snapshot = await ref.get();
    snapshot.forEach(doc => {
      doc.ref.delete();
    });
  } catch (e) {
    console.error("Error deleting all documents: ", e);
  }
}

// bulkAddPeriods()

// deleteAllPeriods()

// run deleteAllPeriodsBeforeDate with this date: June 19, 2024 at 6:45:21 PM UTC-5
deletePeriodsBeforeDate(new Date('2024-06-19T18:45:21-05:00'))

// getCurrentPeriod('week')

module.exports = { getPeriods, getPeriod, setPeriod, bulkAddPeriods, getCurrentPeriod };