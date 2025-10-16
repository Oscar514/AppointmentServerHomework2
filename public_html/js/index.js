let schedule = document.getElementById("scheduleButton");
let cancel = document.getElementById("cancelButton");
let check = document.getElementById("checkButton");

schedule.addEventListener("click", scheduler);
cancel.addEventListener("click", canceler);
check.addEventListener("click", checker);

function scheduler() {
/*	if (this.status == 200) {
	alert("statsu is 200");
	}
	else {
	alert("status not 200");
	}*/
	let aname = document.getElementById("name").value;
	let aweekday = document.getElementById("day").value;
	let atime = document.getElementById("time").value;

	let xmlhttp = new XMLHttpRequest();
	xmlhttp.onload = loadResults;
	xmlhttp.onerror = function () {alert("Error")};

	xmlhttp.open("GET", "http://34.68.15.246/schedule?name=" + aname + "&day=" + aweekday + "&time=" + atime);
	xmlhttp.send();
}

function canceler() {
	let aname = document.getElementById("name").value;
        let aweekday = document.getElementById("day").value;
        let atime = document.getElementById("time").value;

        let xmlhttp = new XMLHttpRequest();
        xmlhttp.onload = loadResults;
        xmlhttp.onerror = function () {alert("Error")};

        xmlhttp.open("GET", "http://34.68.15.246/cancel?name=" + aname + "&day=" + aweekday + "&time=" + atime);
        xmlhttp.send();

}

function checker() {
        let aweekday = document.getElementById("day").value;
        let atime = document.getElementById("time").value;

        let xmlhttp = new XMLHttpRequest();
        xmlhttp.onload = loadResults;
        xmlhttp.onerror = function () {alert("Error")};

        xmlhttp.open("GET", "http://34.68.15.246/check?&day=" + aweekday + "&time=" + atime);
        xmlhttp.send();

}

function loadResults() {
	if (this.status == 200) {
		let results = JSON.parse(this.responseText).data;
		document.getElementById("results").innerHTML = str(results);
	}
	else {
		alert("server error on loadResults");
	}
}


