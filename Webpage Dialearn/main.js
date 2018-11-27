


document.querySelector('#fach').addEventListener('click', select_doc);
 

function select_doc(){
    
}
  function berechne_BMI () {
	var groesse = parseInt(document.getElementById("groesse").value),
	    masse = parseInt(document.getElementById("masse").value),
	    bmi = Math.round(100000 * masse / (groesse * groesse)) / 10;
				
	document.querySelector("output").textContent = bmi;
  }