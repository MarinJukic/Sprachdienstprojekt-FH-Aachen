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

const main = db.collection('DiaLearn');

//Fach aussuchen
app.intent('Skip-Tutorial', conv => {
   var str = "Bitte wählen Sie eines der folgenden Fächer aus. (Wenn kein Fach angezeigt wird, sagen Sie \"reset\"). \n";
   main.get().then(snap => {
       snap.forEach(doc => {
           str += doc.id + ".\noder ";
       });
   });
    
   return main.get().then(snap => {
        if (str.length > 100)
        {
        str = str.substring(0, str.length - 5);
        }
        conv.ask(str);
        return Promise.resolve('Read complete');
   });
});

app.intent('Fach_After_Tutorial', conv => {
   var str = "Bitte wählen Sie eines der folgenden Fächer aus. (Wenn kein Fach angezeigt wird, sagen Sie \"reset\"). \n";
   main.get().then(snap => {
       snap.forEach(doc => {
           str += doc.id + ".\noder ";
       });
   });
   
   return main.get().then(snap => {
        if (str.length > 100)
        {
        str = str.substring(0, str.length - 5);
        }
        conv.ask(str);
        return Promise.resolve('Read complete');
   });
});


app.intent('Fach', conv => {
    const collection = main.doc('test');
    //Was der User gesagt hat in globalen Speicher schreiben
    conv.data.fach = conv.rText;

    const collection1 = main.doc(conv.data.fach).collection('Freitext').doc('Anzahl');
    return collection1.get().then(snap => {
        if(!snap.exists)
        {
            conv.ask("Dieses Fach existiert leider nicht. Bitte wählen Sie ein anderes Fach aus.");
            return Promise.resolve('Read complete');
        }
        else {
            conv.ask("Okay! Sind Sie bereit?");
            return Promise.resolve('Read complete');
        }
    });
});

/*
///////////////////////////////////Freitext/////////////////////////////////////////////////
//Frage stellen
app.intent('Freitext', (conv) => {
    var count;
    //Hole Anzahl aus DB
    const collection1 = main.doc(conv.data.fach).collection('Freitext').doc('Anzahl');
    collection1.get().then(snap => {
        //Speicher in globalen Speicher
        conv.data.count = snap.data().Anzahl;
    });
    
    //mache Random Choice und speicher in globalen Speicher
    var rand = Math.floor((Math.random() * conv.data.count) + 1);
    conv.data.random = rand;
    
    const collection = main.doc(conv.data.fach).collection('Freitext').doc('F' + conv.data.random);
    
     return collection.get()
      .then(doc => {
        if (!doc.exists) {
          conv.ask('Die Datenbank braucht noch ein bisschen. Versuchen Sie es erneut.');
        } else {
          //Frage anzeigen
          var str = doc.data().Frage;
          conv.data.frage = doc.data().Frage;
          conv.ask(str);
        } return Promise.resolve('Read complete');
      }).catch(() => {
        conv.ask('Error reading entry from the Firestore database.');
        conv.ask('Please add a entry to the database first by saying, "Write <your phrase> to the database"');
      });
});


//Überprüfung der Antwort
app.intent('FreitextCheck', (conv) => {
    const collection = main.doc(conv.data.fach).collection('Freitext').doc('F' + conv.data.random);
    var ant = `${conv.rText}`.toLowerCase();
    var check = false;


    return collection.get()
    .then(doc => {
      if (!doc.exists) {
        conv.ask('Irgendwo ist ein Fehler aufgetreten. Bitte sagen Sie "Mit Professor Ritz sprechen" um zum Anfang zu gelangen.');
      } else {
        if(ant.indexOf(doc.data().Key1.toLowerCase()) > -1 && ant.indexOf(doc.data().Key2.toLowerCase()) > -1 
        && ant.indexOf(doc.data().Key3.toLowerCase()) > -1 && ant.indexOf(doc.data().Key4.toLowerCase()) > -1
        && ant.indexOf(doc.data().Key5.toLowerCase()) > -1 && ant.indexOf(doc.data().Key6.toLowerCase()) > -1) 
        {
          check = true;
        }
        if(check === true){
            conv.ask('Ihre Antwort war in Ordnung! Wollen Sie die nächste Frage oder einen anderen Fragetyp?');
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

//Frage überspringen mit Lösung
app.intent('Skip-Freitext', conv => {
    const collection = main.doc(conv.data.fach).collection('Freitext').doc('F' + conv.data.random);
    return collection.get()
    .then(doc => {
      if (!doc.exists) {
        conv.ask('Irgendwo ist ein Fehler aufgetreten. Bitte sagen Sie "Mit Professor Ritz sprechen" um zum Anfang zu gelangen.');
      } 
      else {
        var str = "Die richtigen Keywords waren: \n";
        str += doc.data().Key1 + "\n";
        str += doc.data().Key2 + "\n";
        str += doc.data().Key3 + "\n";
        str += doc.data().Key4 + "\n";
        str += doc.data().Key5 + "\n";
        str += doc.data().Key6 + "\n";
        conv.ask(str);
        conv.ask('Wollen Sie die nächste Frage oder einen anderen Fragetyp?');
      }return Promise.resolve('Read complete');
    }).catch(() => {
      conv.ask('Error reading entry from the Firestore database.');
      
      conv.ask('Please add a entry to the database first by saying, "Write <your phrase> to the database"');
    });
});



///////////////////////////////////Multiple Choice//////////////////////////////////////////
//Frage stellen
app.intent('MultipleChoice', conv => {
    // Get the database collection 'dialogflow' and document 'agent'
    var count;
    const collection1 = main.doc(conv.data.fach).collection('Multiple Choice').doc('Anzahl');
    collection1.get().then(snap => {
        //Speicher in "globale Variable"
        conv.data.count = snap.data().Anzahl;
    });
    
    var rand = Math.floor((Math.random() * conv.data.count) + 1);
    conv.data.random = rand;
    const collection = main.doc(conv.data.fach).collection('Multiple Choice').doc('F' + conv.data.random);
      
    return collection.get().then(doc => {
        if (!doc.exists) {
          conv.ask('Die Datenbank braucht noch ein bisschen. Versuchen Sie es erneut.');
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


//Überprüfung der Antwort
app.intent('MultipleChoiceCheck', conv => {
   // Get the database collection 'dialogflow' and document 'agent'
    const collection = main.doc(conv.data.fach).collection('Multiple Choice').doc('F' + conv.data.random);
    var ant = `${conv.rText}`;
    var check = 'e';

    return collection.get()
      .then(doc => {
        if (!doc.exists) {
          conv.ask('Irgendwo ist ein Fehler aufgetreten. Bitte sagen Sie "Mit Professor Ritz sprechen" um zum Anfang zu gelangen.');
        } else {
        //Welche Antwort wurde gegeben?
        if (ant.toLowerCase() == doc.data().a.toLowerCase() || ant.toLowerCase() == 'a' || ant == '1' 
            || ant.toLowerCase() == 'erste antwort' || ant.toLowerCase() == 'die erste antwort' 
            || ant.toLowerCase() == 'antwort a' || ant.toLowerCase() == 'antwort 1')
          {
            check = 'a';
          }
          else if(ant.toLowerCase() == doc.data().b.toLowerCase() || ant.toLowerCase() == 'b'
                || ant == '2' || ant.toLowerCase() == 'zweite antwort' || ant.toLowerCase() == 'die zweite antwort' 
                || ant.toLowerCase() == 'antwort b' || ant.toLowerCase() == 'antwort 2')
          {
             check = 'b';
          }
           else if(ant.toLowerCase() == doc.data().c.toLowerCase() || ant.toLowerCase() == 'c'
                || ant == '3' || ant.toLowerCase() == 'dritte antwort' || ant.toLowerCase() == 'die dritte antwort' 
                || ant.toLowerCase() == 'antwort c' || ant.toLowerCase() == 'antwort 3')
          {
             check = 'c';
          }
           else if(ant.toLowerCase() == doc.data().d.toLowerCase() || ant.toLowerCase() == 'd'
                || ant == '4' || ant.toLowerCase() == 'vierte antwort' || ant.toLowerCase() == 'die vierte antwort' 
                || ant.toLowerCase() == 'antwort d' || ant.toLowerCase() == 'antwort 4')
          {
             check = 'd';
          }
          else
          {
              conv.ask('Irgendwo ist ein Fehler aufgetreten. Bitte sagen Sie "Mit Professor Ritz sprechen" um zum Anfang zu gelangen.');
              return;
          }
          
        
        //Prüfe, ob Antwort richtig
        if (check == 'a' && doc.data().acheck === true)
          {
             conv.ask('Richtige Antwort! Wollen Sie die nächste Frage oder einen anderen Fragetyp?');
          }
          else if (check == 'b' && doc.data().bcheck === true)
          {
             conv.ask('Richtige Antwort! Wollen Sie die nächste Frage oder einen anderen Fragetyp?');
          }
          else if (check == 'c' && doc.data().ccheck === true)
          {
             conv.ask('Richtige Antwort! Wollen Sie die nächste Frage oder einen anderen Fragetyp?');
          }
          else if (check == 'd' && doc.data().dcheck === true)
          {
             conv.ask('Richtige Antwort! Wollen Sie die nächste Frage oder einen anderen Fragetyp?');
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
*/

///////////////////////////gemischt////////////////////////////////////
app.intent('gemischt', conv => {
    // 1=MC, 2=FT
    var rand = Math.floor((Math.random() * 2) + 1);
    conv.data.randChoice = rand;
    var count;
    
    if(rand == 1)
    {
        const collection1 = main.doc(conv.data.fach).collection('Multiple Choice').doc('Anzahl');
        collection1.get().then(snap => {
            //Speicher in "globale Variable"
            conv.data.count = snap.data().Anzahl;
        });
    
        rand = Math.floor((Math.random() * conv.data.count) + 1);
        conv.data.random = rand;
    
        const collection = main.doc(conv.data.fach).collection('Multiple Choice').doc('F' + conv.data.random);
      
        return collection.get().then(doc => {
        if (!doc.exists) {
            conv.ask('Die Datenbank braucht noch ein bisschen. Versuchen Sie es erneut. Sind Sie bereit?');
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
    else if (rand == 2)
    {
        count;
        //Hole Anzahl aus DB
        const collection1 = main.doc(conv.data.fach).collection('Freitext').doc('Anzahl');
        collection1.get().then(snap => {
            //Speicher in "globale Variable"
            conv.data.count = snap.data().Anzahl;
        });
    
        //mache Random Choice und speicher in "globale Variable"
        rand = Math.floor((Math.random() * conv.data.count) + 1);
        conv.data.random = rand;
    
        const collection = main.doc(conv.data.fach).collection('Freitext').doc('F' + conv.data.random);
      
        return collection.get()
        .then(doc => {
        if (!doc.exists) {
          conv.ask('Die Datenbank braucht noch ein bisschen. Versuchen Sie es erneut. Sind Sie bereit?');
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
});



app.intent('gemischtCheck', conv => {
    var ant;
    var check;
    var check1;
    if(conv.data.randChoice == 1)
    {
        const collection = main.doc(conv.data.fach).collection('Multiple Choice').doc('F' + conv.data.random);
        ant = conv.rText;
        check = 'e';

        return collection.get()
        .then(doc => {
            if (!doc.exists) {
                conv.ask('Irgendwo ist ein Fehler aufgetreten. Bitte sagen Sie "Mit Professor Ritz sprechen" um zum Anfang zu gelangen.');
            } else {
            //Welche Antwort wurde gegeben?
            if (ant.toLowerCase() == doc.data().a.toLowerCase() || ant.toLowerCase() == 'a' || ant == '1' 
                || ant.toLowerCase() == 'erste antwort' || ant.toLowerCase() == 'die erste antwort' 
                || ant.toLowerCase() == 'antwort a' || ant.toLowerCase() == 'antwort 1')
            {
                check = 'a';
            }
            else if(ant.toLowerCase() == doc.data().b.toLowerCase() || ant.toLowerCase() == 'b'
                || ant == '2' || ant.toLowerCase() == 'zweite antwort' || ant.toLowerCase() == 'die zweite antwort' 
                || ant.toLowerCase() == 'antwort b' || ant.toLowerCase() == 'antwort 2')
            {
                check = 'b';
            }
            else if(ant.toLowerCase() == doc.data().c.toLowerCase() || ant.toLowerCase() == 'c'
                || ant == '3' || ant.toLowerCase() == 'dritte antwort' || ant.toLowerCase() == 'die dritte antwort' 
                || ant.toLowerCase() == 'antwort c' || ant.toLowerCase() == 'antwort 3')
            {
                check = 'c';
            }
            else if(ant.toLowerCase() == doc.data().d.toLowerCase() || ant.toLowerCase() == 'd'
                || ant == '4' || ant.toLowerCase() == 'vierte antwort' || ant.toLowerCase() == 'die vierte antwort' 
                || ant.toLowerCase() == 'antwort d' || ant.toLowerCase() == 'antwort 4')
            {
                check = 'd';
            }
            else
            {
                conv.ask('Irgendwo ist ein Fehler aufgetreten. Bitte sagen Sie "Mit Professor Ritz sprechen" um zum Anfang zu gelangen.');
                return;
            }
          
        
            //Prüfe, ob Antwort richtig
            if (check == 'a' && doc.data().acheck === true)
            {
                conv.ask('Richtige Antwort! Wollen Sie die nächste Frage, das Fach wechseln oder aufhören?');
            }
            else if (check == 'b' && doc.data().bcheck === true)
            {
                conv.ask('Richtige Antwort! Wollen Sie die nächste Frage, das Fach wechseln oder aufhören?');
            }
            else if (check == 'c' && doc.data().ccheck === true)
            {
                conv.ask('Richtige Antwort! Wollen Sie die nächste Frage, das Fach wechseln oder aufhören?');
            }
            else if (check == 'd' && doc.data().dcheck === true)
            {
                conv.ask('Richtige Antwort! Wollen Sie die nächste Frage, das Fach wechseln oder aufhören?');
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
    }
    else if (conv.data.randChoice == 2)
    {
        const collection = main.doc(conv.data.fach).collection('Freitext').doc('F' + conv.data.random);
        ant = conv.rText.toLowerCase();
        check1 = false;


        return collection.get()
        .then(doc => {
            if (!doc.exists) {
                conv.ask('Irgendwo ist ein Fehler aufgetreten. Bitte sagen Sie "Mit Professor Ritz sprechen" um zum Anfang zu gelangen.');
            } else {
                if(ant.indexOf(doc.data().Key1.toLowerCase()) > -1 && ant.indexOf(doc.data().Key2.toLowerCase()) > -1 
                && ant.indexOf(doc.data().Key3.toLowerCase()) > -1 && ant.indexOf(doc.data().Key4.toLowerCase()) > -1
                && ant.indexOf(doc.data().Key5.toLowerCase()) > -1 && ant.indexOf(doc.data().Key6.toLowerCase()) > -1) 
                {
                    check = true;
                }
            if(check === true){
                conv.ask('Ihre Antwort war in Ordnung! Wollen Sie die nächste Frage, das Fach wechseln oder aufhören?');
            } else {
                conv.ask('Ihre Antwort war nicht in Ordnung! Bitte versuchen sie es erneut!');
                conv.ask(conv.data.frage);
            }
            }return Promise.resolve('Read complete');
        }).catch(() => {
            conv.ask('Error reading entry from the Firestore database.');
            conv.ask('Please add a entry to the database first by saying, "Write <your phrase> to the database"');
        });
    }
});


//Frage überspringen mit Lösung
app.intent('Skip-Freitext-Gemischt', conv => {
    const collection = main.doc(conv.data.fach).collection('Freitext').doc('F' + conv.data.random);
    return collection.get()
    .then(doc => {
      if (!doc.exists) {
        conv.ask('No data found in the database!');
      } 
      else {
        var str = "Die richtigen Keywords waren: \n";
        str += doc.data().Key1 + "\n";
        str += doc.data().Key2 + "\n";
        str += doc.data().Key3 + "\n";
        str += doc.data().Key4 + "\n";
        str += doc.data().Key5 + "\n";
        str += doc.data().Key6 + "\n";
        str += "Wollen Sie die nächste Frage, das Fach wechseln oder aufhören?";
        conv.ask(str);
      }return Promise.resolve('Read complete');
    }).catch(() => {
      conv.ask('Error reading entry from the Firestore database.');
      
      conv.ask('Please add a entry to the database first by saying, "Write <your phrase> to the database"');
    });
});


app.catch((conv, error) => {
  console.error(error);
  conv.ask('Irgendwo ist ein Fehler aufgetreten. Bitte sagen Sie "Mit Professor Ritz sprechen" um zum Anfang zu gelangen.');
});



app.fallback((conv) => {
  conv.ask(`I couldn't understand. Can you say that again?`);
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);