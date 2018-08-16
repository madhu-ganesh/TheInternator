// Code in this file regarding databases is mainly from database.js file uploaded on d2l

var express = require('express');
var sqlite = require('sqlite3');
var socket = require('socket.io');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var database = new sqlite.Database(__dirname + '/database.sqlite');

/*const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');*/

// If modifying these scopes, delete credentials.json.
/*const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = 'token.json';*/

// Load client secrets from a local file.
/*fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Calendar API.
  authorize(JSON.parse(content), listEvents);
});*/

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
/*function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}*/

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
/*function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return callback(err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}*/

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
/*function listEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = res.data.items;
    if (events.length) {
      console.log('Upcoming 10 events:');
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
      });
    } else {
      console.log('No upcoming events found.');
    }
  });
}*/

var io = socket(app.listen(8081));

database.serialize(function() {
	database.run('PRAGMA foreign_keys = ON;');

	database.run(`
		CREATE TABLE IF NOT EXISTS pay (
			hourly_wage INTEGER
		);
	`);
	database.run(`
		CREATE TABLE IF NOT EXISTS week_hours (
			day VARCHAR(255), hours INTEGER, PRIMARY KEY(day)
		);
	`);
	database.run(`
		CREATE TABLE IF NOT EXISTS to_do (
			task VARCHAR(1000), done BIT, PRIMARY KEY(task)
		);
	`);
	

// Checking if record exists before insert: https://tricksbynazir.wordpress.com/2013/12/26/mysql-insert-record-if-not-exists-in-table/
database.run(`INSERT INTO pay (hourly_wage) 
SELECT * FROM (SELECT '18') AS tmp 
WHERE NOT EXISTS (SELECT hourly_wage FROM pay 
      WHERE hourly_wage='18') 
LIMIT 1;`);

// Source for inserting into database: https://stackoverflow.com/questions/19337029/insert-if-not-exists-statement-in-sqlite
database.run(`INSERT OR IGNORE INTO week_hours (day, hours) VALUES ('monday',0);`);
database.run(`INSERT OR IGNORE INTO week_hours (day, hours) VALUES ('tuesday',0);`);
database.run(`INSERT OR IGNORE INTO week_hours (day, hours) VALUES ('wednesday',0);`);
database.run(`INSERT OR IGNORE INTO week_hours (day, hours) VALUES ('thursday',0);`);
database.run(`INSERT OR IGNORE INTO week_hours (day, hours) VALUES ('friday',0);`);
database.run(`INSERT OR IGNORE INTO week_hours (day, hours) VALUES ('previous_week',0);`);


	database.run('', function(objectError) {
		console.log('created tables');
	});
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.use('/', express.static(__dirname));



  var exp;
   var flag=0;
   var flag2=0;
   var functionPreprocess = function() {
		database.all(`
			SELECT * FROM week_hours
		`, function(objectError, objectRows) {
			if (objectError !== null) {
				functionError(String(objectError));

				return;
			}

			functionSuccess(JSON.stringify(objectRows, null, 4));
		});
		
		
	};

	var functionError = function(strError) {
	};

	var functionSuccess = function(strRows) {

		exp = JSON.parse(strRows);
			io.emit('monday', exp[0]);
			io.emit('tuesday', exp[1]);
			io.emit('wednesday', exp[2]);
			io.emit('thursday', exp[3]);
			io.emit('friday', exp[4]);
			
		database.all(`
			SELECT * FROM pay
		`, function(objectError, objectRows) {

			functionS(JSON.stringify(objectRows, null, 4));
		});
		
		var functionS = function(strRows) {
			var exp2 = JSON.parse(strRows);
		
		
		var total_pay = (Number(exp[0].hours) + Number(exp[1].hours) + Number(exp[2].hours) + Number(exp[3].hours) + Number(exp[4].hours) + Number(exp[5].hours)) * Number(exp2[0].hourly_wage);
		io.emit('total_pay', {
		'total_pay': total_pay
	});
		};
	};
	
	var functionProcessTasks = function() {
		database.all(`
			SELECT * FROM to_do where done=0
		`, function(objectError, objectRows) {
			

			functionTaskSuccess(JSON.stringify(objectRows, null, 4));
		});
	};
		
	var functionTaskSuccess = function(strRows) {

		var exp3 = JSON.parse(strRows);
		for (ii=0;ii<exp3.length;ii++)
		{
			io.emit('unfinished_task', exp3[ii]);
		}
			
		database.all(`
			SELECT * FROM to_do where done=1
		`, function(objectError, objectRows) {
			

			functionS(JSON.stringify(objectRows, null, 4))
		});
		
		var functionS = function(strRows) {
			var exp4 = JSON.parse(strRows);
			
			for (ii=0;ii<exp4.length;ii++)
			{
				io.emit('done_task', exp4[ii]);
			}
		};
		
	};
	
io.on('connection', function(objectSocket) {
	console.log('client connected');
	
	var d = new Date();
	objectSocket.emit('todays_date', {
		'todays_date': d.getDate()});
		
	
	// Reset monday, tuesday, wednesday, thursday, friday to zero on monday as we are starting a new week
	// and would like to calculate pay from 0 for that week
	// The flag helps in updating the table only once on monday and not every time we load
	// the page on monday
	if ((d.getDay()==1) && flag==0 && flag2==0)
	{	flag=1;
		flag2=1;
		var statement = `UPDATE week_hours SET hours=` + 0 + ` WHERE day='previous_week';`;
		var statement1 = `UPDATE week_hours SET hours=` + 0 + ` WHERE day='monday';`;
		var statement2 = `UPDATE week_hours SET hours=` + 0 + ` WHERE day='tuesday';`;
		var statement3 = `UPDATE week_hours SET hours=` + 0 + ` WHERE day='wednesday';`;
		var statement4 = `UPDATE week_hours SET hours=` + 0 + ` WHERE day='thursday';`;
		var statement5 = `UPDATE week_hours SET hours=` + 0 + ` WHERE day='friday';`;
		
		database.run(statement);
		database.run(statement1);
		database.run(statement2);
		database.run(statement3);
		database.run(statement4);
		database.run(statement5);
	}
	else if ((d.getDay()==1) && flag==0 && flag2==1)
	{
		flag=1;
		flag2=0;
		var statement = `UPDATE week_hours SET hours=` + (exp[0].hours+exp[1].hours+exp[2].hours+exp[3].hours+exp[4].hours) + ` WHERE day='previous_week';`;
		var statement1 = `UPDATE week_hours SET hours=` + 0 + ` WHERE day='monday';`;
		var statement2 = `UPDATE week_hours SET hours=` + 0 + ` WHERE day='tuesday';`;
		var statement3 = `UPDATE week_hours SET hours=` + 0 + ` WHERE day='wednesday';`;
		var statement4 = `UPDATE week_hours SET hours=` + 0 + ` WHERE day='thursday';`;
		var statement5 = `UPDATE week_hours SET hours=` + 0 + ` WHERE day='friday';`;
		
		database.run(statement);
		database.run(statement1);
		database.run(statement2);
		database.run(statement3);
		database.run(statement4);
		database.run(statement5);
	}
	// Reset the flag on tuesday so we can reset week_hours table again next monday
	if (d.getDay()===2)
		flag=0;
	functionPreprocess();
	functionProcessTasks();
	
	});
	
	

// Updating the database with how many hours have been input on html page
// The hours will keep getting added on
app.post("/addname", (req, res) => {
var mon = Number(req.body.monday)+exp[0].hours;
var tues = Number(req.body.tuesday)+exp[1].hours;
var wed = Number(req.body.wednesday)+exp[2].hours;
var thurs = Number(req.body.thursday)+exp[3].hours;
var fri = Number(req.body.friday)+exp[4].hours;

var statement1 = `UPDATE week_hours SET hours=` + mon + ` WHERE day='monday';`;
var statement2 = `UPDATE week_hours SET hours=` + tues + ` WHERE day='tuesday';`;
var statement3 = `UPDATE week_hours SET hours=` + wed + ` WHERE day='wednesday';`;
var statement4 = `UPDATE week_hours SET hours=` + thurs + ` WHERE day='thursday';`;
var statement5 = `UPDATE week_hours SET hours=` + fri + ` WHERE day='friday';`;


database.run(statement1);
database.run(statement2);
database.run(statement3);
database.run(statement4);
database.run(statement5);
res.sendFile(__dirname + "/index.html");  
 
// Update the message box on the schedule page to show how many hours have been worked in total so far
io.emit('monday', mon);
io.emit('tuesday', tues);
io.emit('wednesday', wed);
io.emit('thursday', thurs);
io.emit('friday', fri); 
    
});


app.post("/addtask", (req, res) => {
	//var statement1 = `DELETE from to_do where done=0;`;
	//database.run(statement1);

	var ii;
	
	if (typeof req.body.done!=="undefined") {
	console.log("done   "+req.body.done);
	var ggg = Number(req.body.done.length);
	for (ii=0;ii<ggg;ii++)
	{
		var vall = req.body.done[ii].toString();
		var statement2 = `INSERT INTO to_do (task, done) VALUES ('` + vall + `', 1);`;
		database.run(statement2);
	}
	}

	if (typeof req.body.undone!=="undefined") {
	console.log("undone   "+req.body.undone);
	var yyy = Number(req.body.undone.length);
	for (ii=0;ii<yyy;ii++)
	{
		var vall = req.body.undone[ii].toString();
		var statement2 = `INSERT INTO to_do (task, done) VALUES ('` + vall + `', 0);`;
		database.run(statement2);
	}
	}
	
	
	res.sendFile(__dirname + "/index.html");  
    
});

console.log('go ahead and open "http://localhost:8081" in your browser');