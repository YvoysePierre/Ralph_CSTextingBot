const http = require('http');
const express = require('express');

const bodyParser = require('body-parser');

const tree = require('./tree/treeLogic');

const state = require('./state')

const SMS = require('./SMS');

const port = 3001;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/sms', async (req, res) => {

  // Parse the incoming msg
  const {fromNumber, incomingMsg} = tree.parseMsg(req);

  // Log the incoming msg
  tree.logMsg(fromNumber, req);

  // Check if the user exists in state
  // Create if not
  tree.checkUser(fromNumber);

  // Check if the user is on init node
  // If so we need to send an init message to admin
  await tree.initAdminMsg(fromNumber);

  // Check/Run special commands
  // And stop the loop if needed
  const stopLoop = tree.specialCommands(fromNumber, incomingMsg, res);
  if(stopLoop){return;}
  
  // Check if user is on an inital question
  // If so record response to user data
  tree.initQuestions(fromNumber, incomingMsg);

  // Check if the user is set to a valid node
  // caches bugs
  if(!tree.validNode(fromNumber)){return;}

  // Check if the user responded yes or no
  // Defaults to no
  // Here is where we traverse the tree
  tree.yesNo(fromNumber, incomingMsg);

  // Create return msg
  // Must happen before end nodes because they can clear state
  const resMsg = tree.getUserNode(fromNumber).text;

  // Dump a copy of our current state
  // Used for debug and eventually to restore state
  tree.dumpState(); 

  // Check if we are on an end node
  // and act accordingly
  await tree.endNodes(fromNumber, incomingMsg);
  
  // Send return msg
  SMS.respond(resMsg, res);
});

//
// Admin Routes
//
app.get('/', (req, res)=>{
  console.log('\r\n///////');
  console.log('A request was made to /');

  // Basic Web Interface
  let html = '<a href="/state">state</a><br><br>';
  html += '<a href="/stateClear">clear state</a><br><br>';
  html += '<a href="/log">view log</a><br><br>';
  html += '<a href="/logDownload">download log</a><br><br>';
  html += '<a href="/logClear">clear log</a><br><br>';

  res.set('Content-Type', 'text/html');
  res.send(html);
});
app.get('/state', (req, res)=>{
  console.log('\r\n///////');
  console.log('A request was made to grab the state.');
  const stateJSON = state.getJSON();
  res.set('Content-Type', 'text/html');// Text response for testing
  res.send('<pre>'+JSON.stringify(stateJSON,null,2)+'</pre>');// Text response for testing
  //res.json(stateJSON);// Real JSON response
});

app.get('/stateClear', (req, res)=>{
  console.log('\r\n///////');
  console.log('A request was made to clear the state.');
  state.clear();
  res.send('state_cleared');
});

app.get('/log', (req, res)=>{
  console.log('\r\n///////');
  console.log('A request was made to grab the log.');
  const fs = require('fs');
  const logFile = fs.readFileSync('./server.log') || 'NO LOG PRESENT';
  res.set('Content-Type', 'text/html');
  res.send('<pre>'+logFile+'</pre>');
});

app.get('/logDownload', (req, res)=>{
  console.log('\r\n///////');
  console.log('A request was made to download the log.');
  const fs = require('fs');
  const logFile = fs.readFileSync('./server.log') || 'NO LOG PRESENT';
  res.send(logFile);
});

app.get('/logClear', (req, res)=>{
  console.log('\r\n///////');
  console.log('A request was made to clear the log.');
  const fs = require('fs');
  fs.writeFileSync('./server.log', 'LOG_CLEARED: '+new Date().toLocaleString('en-US', {timeZone: 'PST'})+'\r\n\r\n');
  res.send('log_cleared');
});


http.createServer(app).listen(port, () => {
  console.log('\r\n///////');
  console.log(`
  
                                 
  _____         __          _     
 (_____)       (__)        (_)    
 (_)__(_) ____  (_)  ____  (_)__  
 (_____) (____) (_) (____) (____) 
 ( ) ( )( )_( ) (_) (_)_(_)(_) (_)
 (_)  (_)(__)_)(___)(____) (_) (_)
                    (_)           
                    (_)   
  `);
  console.log('\r\n');
  console.log('Starting SMS Bot');
  console.log(new Date().toLocaleString('en-US', {timeZone: 'PST'}));
  if(!tree.ensureValidNodes()){
    console.log('Dying due to invalid nodes!');
    return;
  }
  console.log('Express server listening on port: '+port);
});