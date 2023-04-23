// import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// const functions = require('firebase-functions');
// const admin = require('firebase-admin');

// admin.initializeApp();

// exports.getCollections = functions.https.onCall(async (data, context) => {

//     const collections = await admin.firestore().listCollections();
//     const collectionIds = collections.map(col => col.id);

//     return { collections: collectionIds };

// });
