const { db } = require("../../../firebase/connection.js");
const { getYearTimespans } = require("./bulkCreatePeriods.js");
const { DateTime } = require("luxon");

const PERIOD_COLLECTION = "periods";

async function getPeriods() {
  try {
    const ref = db.collection(PERIOD_COLLECTION);
    const snapshot = await ref
      .where("deletedAt", "==", null)
      .orderBy("dateCreated", "desc")
      .get();

    const docs = snapshot.docs;
    return docs.map((doc) => doc.data());
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
      .where("deletedAt", "==", null)
      .limit(1)
      .get();

    if (snapshot.empty) {
      console.log("No matching current period found.");
      return null;
    }

    const doc = snapshot.docs[0];
    console.log("Current period found: ", doc.id);
    console.log(doc.data());
    return doc.id;
  } catch (e) {
    console.error("Error retrieving current period: ", e);
    return null;
  }
}

async function getPeriod(periodId) {
  try {
    const periodRef = db.collection(PERIOD_COLLECTION).doc(periodId);
    const doc = await periodRef.get();
    if (!doc.exists) {
      console.log("No such document!");
    } else {
      const data = doc.data();
      // Ensure document is not soft-deleted
      if (data.deletedAt !== null) {
        console.log("Document is soft-deleted.");
        return null;
      }
      return data;
    }
  } catch (e) {
    console.error("Error reading period: ", e);
    return null;
  }
}

async function setPeriod(period) {
  try {
    const ref = db.collection(PERIOD_COLLECTION).doc(period.id);
    await ref.set({
      ...period,
      deletedAt: period.deletedAt || null, // Ensure deletedAt is handled
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

async function bulkAddPeriods() {
  const periods = getYearTimespans();
  console.log("periods length___", periods.length);
  periods.forEach(async (period) => {
    const res = await db
      .collection(PERIOD_COLLECTION)
      .add({ ...period, dateCreated: new Date(), deletedAt: null });
    console.log("bulkAddPeriods res.id___", res.id);
  });
}

async function deletePeriodsBeforeDate(date) {
  console.log("Soft-deleting periods before date___", date);
  try {
    const ref = db.collection(PERIOD_COLLECTION);
    const snapshot = await ref.where("dateCreated", "<", date).get();

    snapshot.forEach(async (doc) => {
      console.log(`Soft-deleting period: ${doc.id}`);
      await doc.ref.update({
        deletedAt: new Date(),
      });
    });

    const snapshotWithoutDateCreated = await ref.get();
    snapshotWithoutDateCreated.forEach(async (doc) => {
      if (!doc.data().dateCreated) {
        console.log(`Soft-deleting period without dateCreated: ${doc.id}`);
        await doc.ref.update({
          deletedAt: new Date(),
        });
      }
    });
    console.log("Soft delete complete for periods before given date.");
  } catch (e) {
    console.error("Error soft-deleting documents: ", e);
  }
}

async function deletePeriodsInYear2025() {
  const startOf2025 = new Date("2025-01-01T00:00:00.000Z");
  const endOf2025 = new Date("2025-12-31T23:59:59.999Z");

  try {
    const ref = db.collection(PERIOD_COLLECTION);
    const snapshot = await ref
      .where("periodStartDate", ">=", startOf2025)
      .where("periodStartDate", "<=", endOf2025)
      .get();

    snapshot.forEach(async (doc) => {
      console.log(`Soft-deleting period: ${doc.id}`);
      await doc.ref.update({
        deletedAt: new Date(),
      });
    });

    console.log("Soft delete complete for all documents in 2025.");
  } catch (e) {
    console.error("Error soft-deleting documents: ", e);
  }
}

async function addNullDeletedAtField() {
  try {
    const ref = db.collection(PERIOD_COLLECTION);
    const snapshot = await ref.get();

    // If you want to batch these writes, you can use a write batch or bulk writer.
    // For simplicity, this example updates documents one by one.
    snapshot.forEach(async (doc) => {
      const data = doc.data();
      // Only update if deletedAt doesn't exist or is undefined
      if (data.deletedAt === undefined) {
        console.log(`Setting deletedAt: null on doc: ${doc.id}`);
        await doc.ref.update({ deletedAt: null });
      }
    });

    console.log(
      "Successfully added `deletedAt: null` field to all existing periods."
    );
  } catch (err) {
    console.error("Error adding `deletedAt` field to periods:", err);
  }
}

async function renameDateCreatedToCreatedAt() {
  try {
    const ref = db.collection(PERIOD_COLLECTION);
    const snapshot = await ref.get();

    let updatedCount = 0;

    // Iterate over all documents in the periods collection
    for (const doc of snapshot.docs) {
      const data = doc.data();

      // Only rename if dateCreated exists
      if (data.hasOwnProperty("dateCreated")) {
        // newData includes copying old value + removing the old field
        const newData = {
          createdAt: data.dateCreated,
          dateCreated: admin.firestore.FieldValue.delete(),
        };

        await doc.ref.update(newData);
        console.log(`Renamed dateCreated -> createdAt on doc: ${doc.id}`);
        updatedCount++;
      }
    }

    console.log(
      `Successfully renamed dateCreated to createdAt on ${updatedCount} documents.`
    );
  } catch (err) {
    console.error("Error renaming dateCreated field:", err);
  }
}
renameDateCreatedToCreatedAt();

module.exports = {
  getPeriods,
  getPeriod,
  setPeriod,
  bulkAddPeriods,
  getCurrentPeriod,
};
