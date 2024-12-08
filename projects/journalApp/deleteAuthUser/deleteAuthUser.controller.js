const admin = require("firebase-admin");

const deleteAuthUser = async (email) => {
  try {
    // Retrieve UID using the email
    const userRecord = await admin.auth().getUserByEmail(email);
    const uid = userRecord.uid;

    // Delete user from Firebase Authentication
    await admin.auth().deleteUser(uid);
    console.log(`Successfully deleted user with UID: ${uid}`);
    return true;
  } catch (error) {
    console.error(`Error handling user deletion for email (${email}):`, error);
    return false;
  }
};

module.exports = { deleteAuthUser };
