'use strict';

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
process.env.DEBUG = 'dialogflow:*';
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const {
  dialogflow
} = require('actions-on-google');

const app = dialogflow({
  debug: true,
});


app.middleware((conv, framework) => {
  return new Promise(resolve => {
    if (framework.express) {
      conv.rText = framework.express.request.body.queryResult.queryText;
    }
    resolve();
  });
});


app.intent('Fach', (conv) => {
    var str = conv.body.queryResult.queryText;
    conv.data.fach = str;
});

app.intent('Speech', (conv) => {

var rand_choice = Math.floor((Math.random() *2) + 1);
  conv.data.random_choice = rand_choice;
if(rand_choice == 1){
  var count;
  //Hole Anzahl aus DB
  var fach_name = conv.data.fach;
  const collection1 = db.collection('DiaLearn').doc(conv.data.fach).collection('Freitext').doc('Anzahl');
  collection1.get().then(snap => {
      //Speicher in "globale Variable"
      conv.data.count = snap.data().Anzahl;
  });
  count = conv.data.count;

  //mache Random Choice und speicher in "globale Variable"
  var rand = Math.floor((Math.random() * count) + 1);
  conv.data.random = rand;

  const collection = db.collection('DiaLearn').doc(conv.data.fach).collection('Freitext').doc('F' + conv.data.random);

   return collection.get()
    .then(doc => {
      if (!doc.exists) {
        conv.ask('No data found in the database!');
      } else {
        //show question
        var str = doc.data().Frage;
        conv.data.frage = doc.data().Frage;
        conv.ask(str);
      } return Promise.resolve('Read complete');
    }).catch(() => {
      conv.ask('Error reading entry from the Firestore database.');
      conv.ask('Please add a entry to the database first by saying, "Write <your phrase> to the database"');
    });


}
else if(rad_choice == 2){

  var count;
  const collection1 = db.collection('DiaLearn').doc(conv.data.fach).collection('Multiple Choice').doc('Anzahl');
  collection1.get().then(snap => {
          conv.data.count = snap.data().Anzahl;
  });
  count = conv.data.count;

  var rand = Math.floor((Math.random() * count) + 1);
  conv.data.random = rand;
  const collection = db.collection('DiaLearn').doc(conv.data.fach).collection('Multiple Choice').doc('F' + conv.data.random);

  return collection.get().then(doc => {
      if (!doc.exists) {
        conv.ask('No data found in the database!');
      } else {
       var str = doc.data().Frage + '\n' + doc.data().a + '\n' + doc.data().b + '\n' + doc.data().c + '\n' + doc.data().d;
       conv.data.frage = str;
        conv.ask(str);
      } return Promise.resolve('Read complete');
    }).catch(() => {
      conv.ask('Error reading entry from the Firestore database.');
      conv.ask('Please add a entry to the database first by saying, "Write <your phrase> to the database"');
    });


}
});




///////////////////////////////////Freitext/////////////////////////////////////////////////
//Frage stellen
app.intent('Freitext', (conv) => {
    var count;
    //Hole Anzahl aus DB
    var fach_name = conv.data.fach;
    const collection1 = db.collection('DiaLearn').doc(conv.data.fach).collection('Freitext').doc('Anzahl');
    collection1.get().then(snap => {
        //Speicher in "globale Variable"
        conv.data.count = snap.data().Anzahl;
    });
    count = conv.data.count;

    //mache Random Choice und speicher in "globale Variable"
    var rand = Math.floor((Math.random() * count) + 1);
    conv.data.random = rand;

    const collection = db.collection('DiaLearn').doc(conv.data.fach).collection('Freitext').doc('F' + conv.data.random);

     return collection.get()
      .then(doc => {
        if (!doc.exists) {
          conv.ask('No data found in the database!');
        } else {
          //show question
          var str = doc.data().Frage;
          conv.data.frage = doc.data().Frage;
          conv.ask(str);
        } return Promise.resolve('Read complete');
      }).catch(() => {
        conv.ask('Error reading entry from the Firestore database.');
        conv.ask('Please add a entry to the database first by saying, "Write <your phrase> to the database"');
      });
});


app.catch((conv, error) => {
  console.error(error);
  conv.ask('Irgendwo ist ein Fehler aufgetreten!');
});

//Überprüfung der Antwort
app.intent('FreitextCheck', (conv) => {
    const collection = db.collection('DiaLearn').doc(conv.data.fach).collection('Freitext').doc('F' + conv.data.random);
    var ant = `${conv.rText}`.toLowerCase();
    var check = false;


    return collection.get()
    .then(doc => {
      if (!doc.exists) {
        conv.ask('No data found in the database!');
      } else {
        if(ant.indexOf(doc.data().a.toLowerCase()) > -1 && ant.indexOf(doc.data().b.toLowerCase()) > -1
        && ant.indexOf(doc.data().c.toLowerCase()) > -1 && ant.indexOf(doc.data().d.toLowerCase()) > -1
        && ant.indexOf(doc.data().e.toLowerCase()) > -1 && ant.indexOf(doc.data().f.toLowerCase()) > -1)
        {
          check = true;
        }
        if(check === true){
            conv.ask('Ihre Antwort war in Ordnung! Welchen Fragetyp wollen Sie als nächstes?');
        } else {
            conv.ask('Ihre Antwort war nicht in Ordnung! Bitte versuchen sie es erneut!');
            conv.ask(conv.data.frage);
        }
      }return Promise.resolve('Read complete');
    }).catch(() => {
      conv.ask('Error reading entry from the Firestore database.');

      conv.ask('Please add a entry to the database first by saying, "Write <your phrase> to the database"');
    });
});
app.catch((conv, error) => {
  console.error(error);
  conv.ask('Irgendwo ist ein Fehler aufgetreten!');
});

///////////////////////////////////Multiple Choice//////////////////////////////////////////
//Frage stellen
app.intent('MultipleChoice', conv => {
    // Get the database collection 'dialogflow' and document 'agent'
    var count;
    const collection1 = db.collection('DiaLearn').doc(conv.data.fach).collection('Multiple Choice').doc('Anzahl');
    collection1.get().then(snap => {
            conv.data.count = snap.data().Anzahl;
    });
    count = conv.data.count;

    var rand = Math.floor((Math.random() * count) + 1);
    conv.data.random = rand;
    const collection = db.collection('DiaLearn').doc(conv.data.fach).collection('Multiple Choice').doc('F' + conv.data.random);

    return collection.get().then(doc => {
        if (!doc.exists) {
          conv.ask('No data found in the database!');
        } else {
         var str = doc.data().Frage + '\n' + doc.data().a + '\n' + doc.data().b + '\n' + doc.data().c + '\n' + doc.data().d;
         conv.data.frage = str;
          conv.ask(str);
        } return Promise.resolve('Read complete');
      }).catch(() => {
        conv.ask('Error reading entry from the Firestore database.');
        conv.ask('Please add a entry to the database first by saying, "Write <your phrase> to the database"');
      });
});
app.catch((conv, error) => {
  console.error(error);
  conv.ask('Irgendwo ist ein Fehler aufgetreten!');
});

//Überprüfung der Antwort
app.intent('MultipleChoiceCheck', conv => {
   // Get the database collection 'dialogflow' and document 'agent'
    const collection = db.collection('DiaLearn').doc(conv.data.fach).collection('Multiple Choice').doc('F' + conv.data.random);
    var ant = `${conv.rText}`;
    var check = 'e';

    return collection.get()
      .then(doc => {
        if (!doc.exists) {
          conv.ask('No data found in the database!');
        } else {
        //Welche Antwort wurde gegeben?
        if (ant == doc.data().a || ant == 'a' || ant == 'A' || ant == '1' || ant == 'Erste Antwort'
            || ant == 'Die erste Antwort')
          {
            check = 'a';
          }
          else if(ant == doc.data().b || ant == 'b' || ant == 'B' || ant == '2' || ant == 'Zweite Antwort'
            || ant == 'Die zweite Antwort')
          {
             check = 'b';
          }
           else if(ant == doc.data().c || ant == 'c' || ant == 'C' || ant == '3' || ant == 'Dritte Antwort'
            || ant == 'Die dritte Antwort')
          {
             check = 'c';
          }
           else if(ant == doc.data().d || ant == 'd' || ant == 'D' || ant == '4' || ant == 'Vierte Antwort'
            || ant == 'Die vierte Antwort')
          {
             check = 'd';
          }
          else
          {
              conv.ask("Ich habe Sie nicht verstanden");
              return;
          }


        //Prüfe, ob Antwort richtig
        if (check == 'a' && doc.data().acheck === true)
          {
             conv.ask('Richtige Antwort! Welchen Fragetyp wollen Sie als nächstes?');
          }
          else if (check == 'b' && doc.data().bcheck === true)
          {
             conv.ask('Richtige Antwort! Welchen Fragetyp wollen Sie als nächstes?');
          }
          else if (check == 'c' && doc.data().ccheck === true)
          {
             conv.ask('Richtige Antwort! Welchen Fragetyp wollen Sie als nächstes?');
          }
          else if (check == 'd' && doc.data().dcheck === true)
          {
             conv.ask('Richtige Antwort! Welchen Fragetyp wollen Sie als nächstes?');
          }
          else if (check == 'e')
          {
             conv.ask('Ich habe dich nicht verstanden, bitte wiederhole deine Aussage.');
          }
          else {
             conv.ask('Leider falsch. Versuche es erneut!');
             conv.ask(conv.data.frage);
          }

        }return Promise.resolve('Read complete');
      }).catch(() => {
        conv.ask('Error reading entry from the Firestore database.');
        conv.ask('Please add a entry to the database first by saying, "Write <your phrase> to the database"');
      });
});
app.catch((conv, error) => {
  console.error(error);
  conv.ask('Irgendwo ist ein Fehler aufgetreten!');
});



app.fallback((conv) => {
  conv.ask(`I couldn't understand. Can you say that again?`);
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
