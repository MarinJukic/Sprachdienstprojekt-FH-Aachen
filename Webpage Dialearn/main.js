'use strict'

function addFach()
{
    // Initialize Firebase
    var config = {
    apiKey: "AIzaSyB-8gScjX7i5qYZYI_VTPOTOPQKW_peztE",
    authDomain: "gawh-f81a5.firebaseapp.com",
    databaseURL: "https://gawh-f81a5.firebaseio.com",
    projectId: "gawh-f81a5",
    storageBucket: "gawh-f81a5.appspot.com",
    messagingSenderId: "251170516039"
    };
    firebase.initializeApp(config);
    
    var x = document.getElementsByName("text_addFach")[0].value;
    var coll = firebase.firestore().collection('GAWH');
    
    return coll.doc(x).set({}).then(function() {
    alert("Document successfully written!");
    });
}