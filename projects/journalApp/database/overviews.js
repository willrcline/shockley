const { db } = require('../../../firebase/connection.js');

const OVERVIEW_COLLECTION = 'overviews';

const setOverview = async (userId, periodId, sectionId, newSectionValue) => {

  console.log('setOverview newSectionValue___', newSectionValue)

  const overviewsRef = db.collection(OVERVIEW_COLLECTION);
  const query = overviewsRef.where('userId', '==', userId).where('periodId', '==', periodId);

  const updatedData = {
    userId,
    periodId,
    [sectionId]: newSectionValue
  };

  try {
    const querySnapshot = await query.get();
    if (querySnapshot.empty) {
      console.log('No matching documents. Creating a new one...');
      try {
        const docRef = await overviewsRef.add(updatedData);
        console.log('New overview created with ID:', docRef.id);
      } catch (error) {
        console.error('Error creating new overview:', error);
      }
    } else {
      querySnapshot.forEach(async (doc) => {
        const overviewDocRef = doc.ref;
        try {
          await overviewDocRef.update(updatedData);
          console.log('Overview updated successfully!');
        } catch (error) {
          console.error('Error updating overview:', error);
        }
      });
    }
  } catch (error) {
    console.error("Error getting documents: ", error);
  }
};

module.exports = { setOverview };
