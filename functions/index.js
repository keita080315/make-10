const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.createQuestionNumber = functions.firestore
    .document('questions/{roomId}')
    .onUpdate((change, context) => {
        if (change.after.data().questionNumber['user1'] === change.after.data().questionNumber['user2']) {
            void admin.firestore().doc('rooms/' + context.params.roomId).update({
                randomNumber: Math.floor(Math.random() * 5223) - 1,
                questionNumber: change.after.data().questionNumber['user1']
            });
        }
        return change.after.data();
    });