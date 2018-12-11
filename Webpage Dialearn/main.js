'use strict'

///////////////////////////index.html/////////////////////////////////
function addFach()
{
    var x = document.getElementsByName("text_addFach")[0].value;
    var coll = firebase.firestore().collection('DiaLearn');
    
    //Erstelle Dokument vom neuen Fach
    coll.doc(x).set({});
    
    //erstelle in diesem Dokument eine neue Collection "Multiple Choice" mit einem neuen Dokument "Anzahl" für die spätere Abfrage der Fragenanzahl
    coll.doc(x).collection("Multiple Choice").doc('Anzahl').set({Anzahl: 0});
    
    //erstelle in diesem Dokument eine neue Collection "Freitext" mit einem neuen Dokument "Anzahl" für die spätere Abfrage der Fragenanzahl
    coll.doc(x).collection("Freitext").doc('Anzahl').set({Anzahl: 0}).then(function() {
        if(confirm('Das Fach wurde hinzugefügt!')){window.location.reload();}
    });
}

function selectFach()
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

    firebase.firestore().collection("DiaLearn").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        document.getElementById("select_existing_fach").innerHTML += "<option value=\"" + doc.id + "\">" + doc.id + "</option>";
        });
    });
}

var docid;

function selectFrage() {
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
    var fragetyp;
var x = getQueryVariable("fach");
if(document.getElementsByName("check_mc").value == true){
    fragetyp = "Multiple Choice"
} else if (document.getElementsByName("check_ft").value == true) {
    fragetyp = "Freitext"
}
     firebase.firestore().collection("DiaLearn").doc(x).collection(fragetyp).get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        if(doc.id != 'Anzahl'){
            docid = doc.id;
        document.getElementById("select_deleting_question").innerHTML += "<option value=\"" + doc.data().Frage + "\">" + doc.data().Frage + "</option>"; 
        }
        });
    });
    
    
}


function deleteQuest(){
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
    if(document.getElementById("select_deleting_question").value == "0")
    {
        if(confirm('Bitte wählen Sie eine Frage aus!')){return;}
    }
    else
    {
        var x = getQueryVariable("fach");
       firebase.firestore().collection("DiaLearn").doc(x).collection("Freitext").doc(docid).delete().then(function() {
    alert("Document successfully deleted!");
}).catch(function(error) {
    alert("Error removing document: ", error);
});
    }
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
    
    var x = getQueryVariable("fach");
    var coll = firebase.firestore().collection("DiaLearn").doc(x).collection("Multiple Choice");
    var anz;


    anz = coll.doc("Anzahl").get().then(function(doc) {
        anz = doc.data().Anzahl + 1;
        var str = "F" + (anz);
        //Frage
        var f = document.getElementsByName("question_multiple_choice")[0].value;
        //Antworten
        var ka = document.getElementsByName("answer1_multiple_choice")[0].value;
        var kb = document.getElementsByName("answer2_multiple_choice")[0].value;
        var kc = document.getElementsByName("answer3_multiple_choice")[0].value;
        var kd = document.getElementsByName("answer4_multiple_choice")[0].value;
        //Checks
        var ca = false;
        var cb = false;
        var cc = false;
        var cd = false;
    
        if(document.getElementById("check1").checked)
        {
            ca = true;
        }
        else if(document.getElementById("check2").checked)
        {
            cb = true;
        }
        else if(document.getElementById("check3").checked)
        {
            cc = true;
        }
        else if(document.getElementById("check4").checked)
        {
            cd = true;
        }
        else
        {
            
        }
        
        coll.doc("Anzahl").set(
        {
            Anzahl: anz
        });
        
        coll.doc(str).set(
        {
             Frage: f,
             a: ka,
             acheck: ca,
             b: kb,
             bcheck: cb,
             c: kc,
             ccheck: cc,
             d: kd,
             dcheck: cd
        }).then(function() {
            if(confirm("Die Frage wurde hinzugefügt!")){window.location.reload();}
        });
    });
    
    coll.doc(x).collection("Multiple Choice").doc('Anzahl').set({Anzahl: 0});

}


//////////



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
    
    var x = getQueryVariable("fach");
    var coll = firebase.firestore().collection("DiaLearn").doc(x).collection("Freitext");
    var anz;


    anz = coll.doc("Anzahl").get().then(function(doc) {
        anz = doc.data().Anzahl + 1;
        var str = "F" + (anz);
        var f = document.getElementsByName("freitext")[0].value;
    var ka = document.getElementsByName("freitext")[1].value;
    var kb = document.getElementsByName("freitext")[2].value;
    var kc = document.getElementsByName("freitext")[3].value;
    var kd = document.getElementsByName("freitext")[4].value;
    var ke = document.getElementsByName("freitext")[5].value;
    var kf = document.getElementsByName("freitext")[6].value;
        
        
        
       coll.doc("Anzahl").set(
        {
            Anzahl: anz
        });
        
        coll.doc(str).set({
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
    });
    
    //coll.doc(x).collection("Multiple Choice").doc('Anzahl').set({Anzahl: 0});

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

/////////////////////////Retrieve Data for List of deleting Questions////////////////
function retr_data(){
    
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