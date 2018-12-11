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
    apiKey: "AIzaSyB-8gScjX7i5qYZYI_VTPOTOPQKW_peztE",
    authDomain: "gawh-f81a5.firebaseapp.com",
    databaseURL: "https://gawh-f81a5.firebaseio.com",
    projectId: "gawh-f81a5",
    storageBucket: "gawh-f81a5.appspot.com",
    messagingSenderId: "251170516039"
    };
    firebase.initializeApp(config);   
    
    firebase.firestore().collection("DiaLearn").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        document.getElementById("select_existing_fach").innerHTML += "<option value=\"" + doc.id + "\">" + doc.id + "</option>";
        });
    });
}

//Parameterübergabe
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




//////////////////////////deleteQuestion.html/////////////////////////////
function selectFrage() {
     
    
    var fragetyp;
    var y = getQueryVariable("fach");
    var x = unescape(y);
    
    if(document.getElementById("check1").checked){
        fragetyp = "Multiple Choice";
    } else if (document.getElementById("check2").checked) {
        fragetyp = "Freitext";
    }
    firebase.firestore().collection("DiaLearn").doc(x).collection(fragetyp).get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        if(doc.id != "Anzahl")
            {
                //docid = doc.id;
                document.getElementById("select_deleting_question").innerHTML = "<option disabled selected value=\"0\">Bitte wählen Sie die Frage aus..</option>" + "<option value=\"" + doc.data().Frage + "\">" + doc.data().Frage + "</option>"; 
            }
        });
    });
    
    
}


function deleteQuest(){
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



/////////////////////////////multiple_choice.html///////////////////////////
function reload_html()
{
    var frage = sessionStorage.getItem("frage");
    var a1 = sessionStorage.getItem("a1");
    var a2 = sessionStorage.getItem("a2");
    var a3 = sessionStorage.getItem("a3");
    var a4 = sessionStorage.getItem("a4");
    
    document.getElementsByName("question_multiple_choice")[0].value = frage;
    document.getElementsByName("answer1_multiple_choice")[0].value = a1;
    document.getElementsByName("answer2_multiple_choice")[0].value = a2;
    document.getElementsByName("answer3_multiple_choice")[0].value = a3;
    document.getElementsByName("answer4_multiple_choice")[0].value = a4;
}

function mc_submit()
{    
    var y = getQueryVariable("fach"); 
    var x = unescape(y);
    
    var coll = firebase.firestore().collection("DiaLearn").doc(x).collection("Multiple Choice");
    var anz;


    anz = coll.doc("Anzahl").get().then(function(doc) {
        anz = doc.data().Anzahl + 1;
        var str = "F" + (anz);
        //Frage
        var f = document.getElementsByName("question_multiple_choice")[0].value;
        //Antworten
        var a = document.getElementsByName("answer1_multiple_choice")[0].value;
        var b = document.getElementsByName("answer2_multiple_choice")[0].value;
        var c = document.getElementsByName("answer3_multiple_choice")[0].value;
        var d = document.getElementsByName("answer4_multiple_choice")[0].value;
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
            alert("Keine Checkbox ausgewählt.");
            sessionStorage.setItem("frage", document.getElementsByName("question_multiple_choice")[0].value);
            sessionStorage.setItem("a1", document.getElementsByName("answer1_multiple_choice")[0].value);
            sessionStorage.setItem("a2", document.getElementsByName("answer2_multiple_choice")[0].value);
            sessionStorage.setItem("a3", document.getElementsByName("answer3_multiple_choice")[0].value);
            sessionStorage.setItem("a4", document.getElementsByName("answer4_multiple_choice")[0].value);
            window.location.reload();
        }
        
        coll.doc("Anzahl").set(
        {
            Anzahl: anz
        });
        
        coll.doc(str).set(
        {
             Frage: f,
             a: a,
             acheck: ca,
             b: b,
             bcheck: cb,
             c: c,
             ccheck: cc,
             d: d,
             dcheck: cd
        }).then(function() {
            if(confirm("Die Frage wurde hinzugefügt!")){window.location.reload();}
        });
    });
}


///////////////////////////freitext.html//////////////////////////////
function ft_submit()
{
    var y = getQueryVariable("fach");
    var x = unescape(y);
    
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
        if(confirm("Die Frage wurde hinzugefügt!")){window.location.reload();}
    });
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