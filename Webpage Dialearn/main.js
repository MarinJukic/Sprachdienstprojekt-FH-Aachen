'use strict'

///////////////////////////index.html/////////////////////////////////
function addFach()
{
    var x = document.getElementsByName("text_addFach")[0].value;
    var coll = firebase.firestore().collection('Alpha');
    
    //Erstelle Dokument vom neuen Fach
    coll.doc(x).set({});
    
    //erstelle in diesem Dokument eine neue Collection "Multiple Choice" mit einem neuen Dokument "Anzahl" für die spätere Abfrage der Fragenanzahl
    coll.doc(x).collection("Multiple Choice").doc('Anzahl').set({Anzahl: 0});
    
    //erstelle in diesem Dokument eine neue Collection "Freitext" mit einem neuen Dokument "Anzahl" für die spätere Abfrage der Fragenanzahl
    coll.doc(x).collection("Freitext").doc('Anzahl').set({Anzahl: 0}).then(function() {
        if(confirm('Das Fach wurde hinzugefügt!')){window.location.reload();}
    });
}

function selectFach(){
    // Initialize Firebase
    var config = {
    apiKey: "AIzaSyARl9jVIqTls5AH0dBzhSDtvlHVPAudLsg",
    authDomain: "alpha-c1fa6.firebaseapp.com",
    databaseURL: "https://alpha-c1fa6.firebaseio.com",
    projectId: "alpha-c1fa6",
    storageBucket: "alpha-c1fa6.appspot.com",
    messagingSenderId: "658519541206"
  };
 firebase.initializeApp(config);
    
    firebase.firestore().collection("Alpha").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        document.getElementById("select_existing_fach").innerHTML += "<option value=\"" + doc.id + "\">" + doc.id + "</option>";
        });
    });
}


function addFreitext(){
      
      
} 

function weiterFach()
{ 
    if(document.getElementById("select_existing_fach").value == "0")
    {
        if(confirm('Bitte wählen Sie ein Fach aus!')){return;}
    }
    else
    {
        var fach = document.getElementById("select_existing_fach").value;
        window.location.href = "options_page.html?fach=" + fach;
    }
}




///////////////////////////options_page.html////////////////////////////////////////




//////////////////////////newQuestion.html/////////////////////////////////




//////////////////////////deleteQuestion.html/////////////////////////////




/////////////////////////////multiple_choice.html///////////////////////////
function mc_submit()
{    
    var config = {
    apiKey: "AIzaSyARl9jVIqTls5AH0dBzhSDtvlHVPAudLsg",
    authDomain: "alpha-c1fa6.firebaseapp.com",
    databaseURL: "https://alpha-c1fa6.firebaseio.com",
    projectId: "alpha-c1fa6",
    storageBucket: "alpha-c1fa6.appspot.com",
    messagingSenderId: "658519541206"
  };
  firebase.initializeApp(config);   
    
    var x = getQueryVariable("fach");
    var anz;
    
    var coll = firebase.firestore().collection("GAWH").doc(x).collection("Multiple Choice");

    coll.get().then(function(doc) {
        anz = doc.data();
    });
                                            
    
    //var f = document.getElementsByName("question_multiple_choice")[0].value;
    var str = "F" + (anz+1);
    /*coll.doc(str).set(
        {
            Frage: f
        });
    */
    alert(str);
}



///////////////////////////freitext.html//////////////////////////////
function ft_submit()
{
    // Initialize Firebase
    
    var config = {
    apiKey: "AIzaSyARl9jVIqTls5AH0dBzhSDtvlHVPAudLsg",
    authDomain: "alpha-c1fa6.firebaseapp.com",
    databaseURL: "https://alpha-c1fa6.firebaseio.com",
    projectId: "alpha-c1fa6",
    storageBucket: "alpha-c1fa6.appspot.com",
    messagingSenderId: "658519541206"
  };
  firebase.initializeApp(config); 
   
    //Initialisierung der Eingaben für das Schreiben nach Firebase
    var f = document.getElementsByName("freitext")[0].value;
    var ka = document.getElementsByName("freitext")[1].value;
    var kb = document.getElementsByName("freitext")[2].value;
    var kc = document.getElementsByName("freitext")[3].value;
    var kd = document.getElementsByName("freitext")[4].value;
    var ke = document.getElementsByName("freitext")[5].value;
    var kf = document.getElementsByName("freitext")[6].value;
    
   //Das schreiben der Eingaben in das Jeweilige Fach
    var coll = firebase.firestore().collection('Alpha');
    coll.doc("Test").collection("Freitext").doc('Mal').set({
        Frage: f,
        Key1: ka,
        Key2: kb,
        Key3: kc,
        Key4: kd,
        Key5: ke,
        Key6: kd
    }).then(function() {
        alert("Document successfully written!");
    });
}



///////////////////////////global//////////////////////////////////
function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

function ref_options()
{
    var fach = getQueryVariable("fach");
    window.location.href = "options_page.html?fach=" + fach;
}

function ref_newQ()
{
    var fach = getQueryVariable("fach");
    window.location.href = "newQuestion.html?fach=" + fach;
}

function ref_delQ()
{
    var fach = getQueryVariable("fach");
    window.location.href = "deleteQuestion.html?fach=" + fach;
}

function ref_mc()
{
    var fach = getQueryVariable("fach");
    window.location.href = "multiple_choice.html?fach=" + fach;
}

function ref_ft()
{
    var fach = getQueryVariable("fach");
    window.location.href = "freitext.html?fach=" + fach;
}

/*
    alert("Document successfully written!"); 
*/