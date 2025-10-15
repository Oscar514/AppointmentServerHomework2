const http = require('http');
const fs = require('fs')
const url = require('url');
const path = require('path');

const times = ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"];
const days = ["Monday","Tuesday","Wednesday","Thursday","Friday"];

const availableTimes = {
    Monday: ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    Tuesday: ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    Wednesday: ["1:00", "1:30", "2:00", "2:30", "3:00", "4:00", "4:30"],
    Thursday: ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    Friday: ["1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
};
const appointments = [
    {name: "James", day: "Wednesday", time: "3:30" },
    {name: "Lillie", day: "Friday", time: "1:00" }];

let serverObj =  http.createServer(function(req,res){
	console.log(req.url);
	let urlObj = url.parse(req.url,true);
	switch (urlObj.pathname) {
		case "/schedule":
			schedule(urlObj.query,res);
			break;
		case "/cancel":
			cancel(urlObj.query,res);
			break;
		case "/check":
			check(urlObj.query,res);
			break;
		case "/":
			sendFile("/index.html",res);
			break;
		default:
			sendFile(urlObj.pathname,res);

	}
});

function schedule(qObj,res) {
	if (!verifyScheduling(qObj,res)) {
		error(res,300,"Missing data or incorrect input");
	}
	else if (availableTimes[qObj.day].some(time => time == qObj.time))
	{
		let date = availableTimes[qObj.day].indexOf(qObj.time);
		addElement(availableTimes[qObj.day],date,1);
		appointments.splice(0,0,{name: String(qObj.name), day: qObj.day, time: qObj.time});
		write(res,200,"Scheduled",contentType(qObj.pathname))
	}
	else
	{
		error(res,400,"Can't schedule");
	}
}
function cancel(qObj,res) {
	appointmentExists = false;
	if (!verifyScheduling(qObj,res)) {
		error(res,300,"Missing data or incorrect input");
        }
	else {
		for (let i = 0; i < appointments.length; i++)
		{
			if (appointments[i].name == qObj.name && appointments[i].day == qObj.day && appointments[i].time == qObj.time)
			{
				addElement(appointments,appointments[i],1);
				for (let j = 0; j <= availableTimes[qObj.day].length; j++)
				{
					num1 = qObj.time[0] + qObj.time[2];
					num2 = availableTimes[qObj.day][j][0] + availableTimes[qObj.day][j][2];
					if (num1 < num2)
					{
						addElement(availableTimes[qObj.day],j,0,qObj.time);
						break;
					}
					else if (num1 == 100)
					{
						addElement(availableTimes[qObj.day],0,0,qObj.time);
						break;
					}
					else if (num1 > num2 && num1 == 430)
					{
						addElement(availableTimes[qObj.day],j,0,qObj.time);
						break;
					}
				}
				write(res,200,"Appointment has been canceled",contentType(qObj.pathname));
				appointmentExists = true;
				break;
			}
		}
		if (appointmentExists == false)
		{
			error(res,400,"Appointment not found");
		}
	}
}
function verifyScheduling(qObj,res) {
	if (
	  qObj.name == undefined ||
	  qObj.day == undefined ||
	  qObj.time == undefined ||
	  days.some(day => day != qObj.day) ||
	  times.some(time => time != qObj.time)
	) {
		return false;
	}
}

function contentType(route) {
	switch(path.extname(route)) {
		case(".html"):
			return "text/html";
			break;
		case(".json"):
			return "application/json";
			break;
		case(".txt"):
			return "text/plain";
			break;
		case(".css"):
			return "text/css";
			break;
		case(".js"):
			return "text/javascript";
			break;
		case("/"):
			return "text/html";
	}
}

function sendFile(path,res) {
	fs.readFile("./public_html"+path,function(err,content) {
		if (err) {
			error(res,404,'error: not working');
		}
		else {
			write(res,200,content,contentType(path));
		}
		});
}

function verifyChecking(qObj,res) {
	if (
	  qObj.day == undefined ||
          qObj.time == undefined)
        {
                 return false;
	}
}
function addElement(array,index,amount,element) {
	array.splice(index,amount,element);
}
function deleteElement(array,index,amount) {
	array.splice(index,amount);
}
function check(qObj,res) {
	if (verifyChecking(qObj,res)) {
		error(res,300,"Missing data or incorrect input");
	}
	else if (availableTimes[qObj.day].some(time => time == qObj.time)) {
		write(res,200,"This date is available",contentType(qObj.pathname));
	}
	else {
		error(res,300,"This date is not available");
	}
}
function write(response,status,message,contentType) {
	console.log(contentType);
	response.writeHead(status,{'content-type':contentType});
        response.write(message);
        response.end();
}
function error(response,status,message) {

	response.writeHead(status,{'content-type':'text/plain'});
	response.write(message);
	response.end();
}

serverObj.listen(80,function(){console.log("listening on port 80")});
