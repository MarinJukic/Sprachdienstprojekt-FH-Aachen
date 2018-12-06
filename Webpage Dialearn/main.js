'use strict'

///////////////////////////index.html/////////////////////////////////
function addFach()
{
    var x = document.getElementsByName("text_addFach")[0].value;
    var coll = firebase.firestore().collection('GAWH');
    
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
    apiKey: "AIzaSyB-8gScjX7i5qYZYI_VTPOTOPQKW_peztE",
    authDomain: "gawh-f81a5.firebaseapp.com",
    databaseURL: "https://gawh-f81a5.firebaseio.com",
    projectId: "gawh-f81a5",
    storageBucket: "gawh-f81a5.appspot.com",
    messagingSenderId: "251170516039"
    };
    firebase.initializeApp(config);   

    firebase.firestore().collection("GAWH").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        document.getElementById("select_existing_fach").innerHTML += "<option value=\"" + doc.id + "\">" + doc.id + "</option>";
        });
    });
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
    apiKey: "AIzaSyB-8gScjX7i5qYZYI_VTPOTOPQKW_peztE",
    authDomain: "gawh-f81a5.firebaseapp.com",
    databaseURL: "https://gawh-f81a5.firebaseio.com",
    projectId: "gawh-f81a5",
    storageBucket: "gawh-f81a5.appspot.com",
    messagingSenderId: "251170516039"
    };
    firebase.initializeApp(config);   
    
    var x = getQueryVariable("fach");
    var coll = firebase.firestore().collection("GAWH").doc(x).collection("Multiple Choice");
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


///////////////////////////freitext.html//////////////////////////////
function ft_submit()
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
   
    //Initialisierung der Eingaben für das Schreiben nach Firebase
    var f = document.getElementsByName("new_freitext_question")[0].value;
    var ka = document.getElementsByName("key1_freitext")[0].value;
    var kb = document.getElementsByName("key2_freitext")[0].value;
    var kc = document.getElementsByName("key3_freitext")[0].value;
    var kd = document.getElementsByName("key4_freitext")[0].value;
    var ke = document.getElementsByName("key5_freitext")[0].value;
    var kf = document.getElementsByName("key6_freitext")[0].value;
    
   //Das schreiben der Eingaben in das Jeweilige Fach
    var coll = firebase.firestore().collection("GAWH");
    coll.doc("aaa").collection("Freitext").doc("F5").set({
        Frage: f,
        Key1: ka,
        Key2: kb,
        Key3: kc,
        Key4: kd,
        Key5: ke,
        Key6: kd
    }).then(function() {
        if(confirm("Die Frage wurde hinzugefügt!")){window.location.reload();}
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