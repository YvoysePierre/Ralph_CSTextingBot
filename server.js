const http = require('http');
const express = require('express');

const bodyParser = require('body-parser');

const tree = require('./tree/treeLogic');

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

  // Check/Run special commands
  // And stop the loop if needed
  const stopLoop = tree.specialCommands(fromNumber, incomingMsg);
  if(stopLoop){return;}
  
  // Check if user is on an inital question
  // If so record response to user data
  tree.initQuestions(fromNumber, incomingMsg);

  // Check if the user is set to a valid node
  // caches bugs
  if(!tree.validNode(fromNumber)){return;}

  // Check if the user responded yes or no
  // Defualts to no
  tree.YesNo(fromNumber, incomingMsg);

  // Check if we are on an end node
  // and act accordingly
  await tree.endNodes(fromNumber, incomingMsg);

  // Check if we are on the init node
  // This has special conditions
  tree.handleInitNode(fromNumber, incomingMsg);

  // Dump a copy of our current state
  // Used for debug and eventually to restore state
  tree.dumpState(); 

  // Create return msg
  const resMsg = tree.getUserNode(fromNumber).text;

  // Send return msg
  SMS.respond(resMsg, res);

});

http.createServer(app).listen(port, () => {
  console.log('Express server listening on port: '+port);
});