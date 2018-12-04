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
    
    //Erstelle Dokument vom neuen Fach
    coll.doc(x).set({});
    
    //erstelle in diesem Dokument eine neue Collection "Multiple Choice" mit einem neuen Dokument "Anzahl" für die spätere Abfrage der Fragenanzahl
    coll.doc(x).collection("Multiple Choice").doc('Anzahl').set({Anzahl: 0});
    
    //erstelle in diesem Dokument eine neue Collection "Freitext" mit einem neuen Dokument "Anzahl" für die spätere Abfrage der Fragenanzahl
    coll.doc(x).collection("Freitext").doc('Anzahl').set({Anzahl: 0}).then(function() {
        alert("Document successfully written!");
    });
}





/*
    alert("Document successfully written!"); 
*/