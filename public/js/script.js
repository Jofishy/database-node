document.addEventListener('DOMContentLoaded', loaded);

function loaded(){
	var addButton = document.getElementById("add");

	makeRequest("/select", makeTable);
	
	addButton.addEventListener('click', function(e){
		payload = {name: null, due: null};
		payload.name = document.getElementById("name").value;
		payload.due = document.getElementById("due").value;
		payload.reps = document.getElementById("reps").value;
		payload.weight = document.getElementById("weight").value;
		payload.done = document.getElementById("done").value;
		//console.log(payload.name);
		if(payload.name != ""){
			makeRequest("/insert?name="+payload.name+"&done="+payload.done+"&due="+payload.due+"&reps="+payload.reps+"&weight="+payload.weight, displayResult);
		}
		e.preventDefault();
	});
}

function makeRequest(url, callback){
	console.log(url);
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", url, true);

	xmlHttp.addEventListener('load', function(){
		if(xmlHttp.status >= 200 && xmlHttp.status < 400){
			if(callback) callback(xmlHttp.responseText);
		}
		else {
			console.log("Error in network request: " + xmlHttp.statusText);
		}
	});
	xmlHttp.send( null );
}

function displayResult(str){
	makeRequest("/select", makeTable);
	console.log(str);
}

function makeTable(str){
	var data = JSON.parse(str);
	var element = document.getElementById("table");
	if(element !== null){
		element.outerHTML = "";
	}

	var newTable = document.createElement('table');
	var header = document.createElement('tr');
	var n = document.createElement('td');
	n.textContent = "Names";
	header.appendChild(n);
	n = document.createElement('td');
	n.textContent = "Dates";
	header.appendChild(n);
	n = document.createElement('td');
	n.textContent = "LBS";
	header.appendChild(n);
	n = document.createElement('td');
	n.textContent = "weight";
	header.appendChild(n);
	n = document.createElement('td');
	n.textContent = "reps";
	header.appendChild(n);
	newTable.appendChild(header);
	for (var item in data){
		var tr = document.createElement('tr');
		var edit = document.createElement('td');
		var del = document.createElement('td');
		var name = document.createElement('td');
		var done = document.createElement('td');
		var date = document.createElement('td');	
		var weight = document.createElement('td');
		var reps = document.createElement('td');
	
		delButt = document.createElement('button');
		addEvent(delButt, data[item].id, remove);	
		delButt.textContent = "Delete";
		del.appendChild(delButt);
	
		editButt = document.createElement('button');
		addEvent(editButt, data[item].id, editEvent);
		editButt.textContent = "Edit";
		del.appendChild(editButt);

		name.innerHTML = data[item].name;
		tr.appendChild(name);
		date.innerHTML = data[item].due;
		tr.appendChild(date);
		done.innerHTML = data[item].done;
		tr.appendChild(done);
		weight.innerHTML = data[item].weight;
		tr.appendChild(weight);
		reps.innerHTML = data[item].reps;
		tr.appendChild(reps);
		tr.appendChild(edit);
		tr.appendChild(del);
		newTable.appendChild(tr);
	}
	newTable.id = "table";
	document.body.appendChild(newTable);
}
function addEvent(item, id, callback){
	item.addEventListener('click', function(e){
		callback(id);
		//window.location= "/edit?id=" + id;
	});
}
function editEvent(id){
	window.location="/edit?id=" + id;
	//console.log(id);
	//makeRequest("/edit?id=" + id);	
}
function remove(id){
	makeRequest("/delete?id=" + id, displayResult);
	makeRequest("/select", makeTable);
}
