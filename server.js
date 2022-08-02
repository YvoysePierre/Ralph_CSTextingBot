const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');

const state = require('./state');

//const logger = require('./logger');

const sendSMS = require('./sendSMS');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

async function respond(msg, res)
{
  const twiml = new MessagingResponse();
  twiml.message(msg);
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
  console.log('Sent Msg:');
  console.log(msg);
}

function logMsg(fromNumber, req)
{
  console.log('\r\n///////');
  console.log('New message from: '+fromNumber);
  console.log(req.body['Body']);
}

function checkUser(fromNumber)
{
  if(!state.userExists(fromNumber))
  {
    // We have a new user
    state.initUser(fromNumber);
    console.log('New Contact From: '+fromNumber);
  }
  console.log('Current User Node: '+state.getUserNodeString(fromNumber));
}

function parseMsg(req)
{
  // Get incoming msg
  let incomingMsg = req.body.Body;
  incomingMsg = incomingMsg.toLowerCase();
  const fromNumber = req.body['From'];
  return {fromNumber, incomingMsg};
}

function specialCommands(fromNumber, incomingMsg)
{
  //
  // Handle special commands
  //
  let stopLoop = false;
  if(incomingMsg === '!reset')
  {
    console.log(fromNumber+' requested reset!');
    state.initUser(fromNumber);
  }
  if(incomingMsg === '!status')
  {
    resMsg = JSON.stringify(state, null, 2);
    respond(resMsg, res);
    stopLoop = true;
  }
  if(incomingMsg === '!skip')
  {
    // Instead of updating to start, update to phone model
    // Which is the last init question
    // Otherwise the command will be treated as an answer to the first question
    state.updateUserNode(fromNumber, 'init_phone_model');
    state[fromNumber].email = 'skipped';
    state[fromNumber].location = 'skipped';
    state[fromNumber].walkbook = 'skipped';
    state[fromNumber].precinct = 'skipped';
    state[fromNumber].phoneModel = 'skipped';
  }
  return stopLoop;
}

function initQuestions(fromNumber, incomingMsg)
{
  //
  // Handle init questions
  //
  if(state.getUserNodeString(fromNumber) === 'init_email')
  {
    state.updateUserData(fromNumber, 'email', incomingMsg);
    console.log('Collected email from '+fromNumber+' as: '+incomingMsg);
  }
  if(state.getUserNodeString(fromNumber) === 'init_location')
  {
    state.updateUserData(fromNumber, 'location', incomingMsg);
    console.log('Collected location from '+fromNumber+' as: '+incomingMsg);
  }
  if(state.getUserNodeString(fromNumber) === 'init_walkbook')
  {
    state.updateUserData(fromNumber, 'walkbook', incomingMsg);
    console.log('Collected walkbook from '+fromNumber+' as: '+incomingMsg);
  }
  if(state.getUserNodeString(fromNumber) === 'init_precinct')
  {
    state.updateUserData(fromNumber, 'precinct', incomingMsg);
    console.log('Collected precinct from '+fromNumber+' as: '+incomingMsg);
  }
  if(state.getUserNodeString(fromNumber) === 'init_phone_model')
  {
    state.updateUserData(fromNumber, 'phoneModel', incomingMsg);
    console.log('Collected phone model from '+fromNumber+' as: '+incomingMsg);
  }
}

function validNode(fromNumber)
{
  // Ensure we have a valid node
  if(!state.getUserNode(fromNumber))
  {
    console.log('Missing node: '+state.getUserNodeString(fromNumber));
    return false;
  }
  return true;
}

function handleYesNo(fromNumber, incomingMsg)
{
  // Setup yes bool
  const yes = incomingMsg.includes('y');

  // Move user to next flow pos
  if(yes)
  {
    let targetNode = state.getUserNode(fromNumber).l;
    state.updateUserNode(fromNumber, targetNode);
  }
  else
  {
    let targetNode = state.getUserNode(fromNumber).r;
    state.updateUserNode(fromNumber, targetNode);
  }
  return yes;
}

async function endNodes(fromNumber, incomingMsg)
{
  //
  // Handle End Nodes
  //
  if(state.getUserNodeString(fromNumber) === 'end_resolution_y')
  {
    //
    console.log(fromNumber+': reached the end of the tree...');
    const sendMsg = JSON.stringify(state[fromNumber],null, 2);
    await sendSMS.sendAdmin(sendMsg);
    //initUserState(fromNumber);
  }
  if(state.getUserNodeString(fromNumber) === 'end_resolution_n')
  {
    //
    console.log(fromNumber+': reached the end of the tree...');
    const sendMsg = JSON.stringify(state[fromNumber],null, 2);
    await sendSMS.sendAdmin(sendMsg);
    //initUserState(fromNumber);
  } 
}

function handleInitNode(fromNumber, incomingMsg)
{
  // Init is special
  if(state.getUserNodeString(fromNumber) === 'init')
  {
    // Pass init node no matter what the original msg says
    let targetNode = state.getUserNode(fromNumber).l;
    state.updateUserNode(fromNumber, targetNode);
  }
}

app.post('/sms', async (req, res) => {

  //const fromNumber = 
  const {fromNumber, incomingMsg} = parseMsg(req);

  logMsg(fromNumber, req);

  checkUser(fromNumber);

  const stopLoop = specialCommands(fromNumber, incomingMsg);
  if(stopLoop){return;}
  
  initQuestions(fromNumber, incomingMsg);

  if(!validNode(fromNumber)){return;}

  handleYesNo(fromNumber, incomingMsg);

  await endNodes(fromNumber, incomingMsg);

  handleInitNode(fromNumber, incomingMsg);

  // Dump a copy of the current state
  state.dump(); 

  // Return the final message
  const resMsg = state.getUserNode(fromNumber).text;
  respond(resMsg, res);
});

http.createServer(app).listen(3001, () => {
  console.log('Express server listening on port 1337');
});


// Setup local defs
  //let UserNode = state[fromNumber];// String of user node id
  //let treeNode = flowTree[UserNode];// Actual node data