const { db } = require('../../../firebase/connection.js')

const OVERVIEW_COLLECTION = 'overviews';

const setOverview = async (userId, periodId, sectionId, newSectionValue) => {
  console.log("setOverview userId, periodId, sectionId, newSectionValue___", userId, periodId, sectionId, newSectionValue)

  const overviewsRef = db.collection(OVERVIEW_COLLECTION);

  const query = overviewsRef.where('userId', '==', userId).where('periodId', '==', periodId);

  const updatedData = {
    userId,
    periodId,
    [sectionId]: newSectionValue
  };

  query.get().then((querySnapshot) => {
    if (querySnapshot.empty) {
      console.log('No matching documents. Creating a new one...');
      // Create a new document if no matching document is found
      overviewsRef.add(updatedData)
        .then(docRef => {
          console.log('New overview created with ID:', docRef.id);
        })
        .catch(error => {
          console.error('Error creating new overview:', error);
        });
    } else {
      // If documents exist, update them
      querySnapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
        const overviewDocRef = doc.ref;
        overviewDocRef.update(updatedData)
          .then(() => {
            console.log('Overview updated successfully!');
          })
          .catch((error) => {
            console.error('Error updating overview:', error);
          });
      });
    }
  }).catch((error) => {
    console.error("Error getting documents: ", error);
  });
}

module.exports = { setOverview };