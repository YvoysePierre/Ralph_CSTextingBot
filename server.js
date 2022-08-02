const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');

const fs = require('fs');

const flowTree = require('./flowTree');
const sendSMS = require('./sendSMS');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));


let state = {

}
function dumpState(){
  fs.writeFileSync(__dirname+'/state-dump.json', JSON.stringify(state, null, 2));
}
function initUserState(fromNumber)
{
  state[fromNumber] = {
    phone: fromNumber,
    node: 'init',
    email: 'unknown',
    time: Date.now(),
    location: 'unknown',
    walkbook: 'unknown',
    precinct: 'unknown',
    phoneModel: 'unknown',
  };
  dumpState();
}
function updateUserNode(fromNumber, newNode)
{
  if(flowTree[newNode])
  {
    state[fromNumber].node = newNode;
    return;
  }
  console.log('Can not find node: '+newNode);
}

function getCurrentNode(fromNumber)
{
  return flowTree[state[fromNumber].node];
}


async function respond(msg, res)
{
  const twiml = new MessagingResponse();
  twiml.message(msg);
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
}

app.post('/sms', async (req, res) => {
  const fromNumber = req.body['From'];

  console.log('\r\n///////');
  console.log('New message from: '+fromNumber);
  console.log(req.body['Body']);
  if(!state[fromNumber])
  {
    // We have a new user
    initUserState(fromNumber);
  }
  console.log('Current User Node: '+state[fromNumber].node);

  let resMsg = 'init_msg';

  // Get incoming msg
  let incomingMsg = req.body.Body;
  incomingMsg = incomingMsg.toLowerCase();

  //
  // Handle special commands
  //
  if(incomingMsg === '!reset')
  {
    console.log(fromNumber+' requested reset!');
    initUserState(fromNumber);
  }
  if(incomingMsg === '!status')
  {
    resMsg = JSON.stringify(state, null, 2);
    respond(resMsg, res);
    return;
  }
  if(incomingMsg === '!skip')
  {
    // Instead of updating to start, update to phone model
    // Which is the last init question
    // Otherwise the command will be treated as an answer to the first question
    updateUserNode(fromNumber, 'init_phone_model');
    state[fromNumber].email = 'skipped';
    state[fromNumber].location = 'skipped';
    state[fromNumber].walkbook = 'skipped';
    state[fromNumber].precinct = 'skipped';
    state[fromNumber].phoneModel = 'skipped';
  }
  //
  // Handle init questions
  //
  if(state[fromNumber].node === 'init_email')
  {
    state[fromNumber].email = incomingMsg;
    console.log('Collected email from '+fromNumber+' as: '+incomingMsg);
  }
  if(state[fromNumber].node === 'init_location')
  {
    state[fromNumber].location = incomingMsg;
    console.log('Collected location from '+fromNumber+' as: '+incomingMsg);
  }
  if(state[fromNumber].node === 'init_walkbook')
  {
    state[fromNumber].walkbook = incomingMsg;
    console.log('Collected walkbook from '+fromNumber+' as: '+incomingMsg);
  }
  if(state[fromNumber].node === 'init_precinct')
  {
    state[fromNumber].precinct = incomingMsg;
    console.log('Collected precinct from '+fromNumber+' as: '+incomingMsg);
  }
  if(state[fromNumber].node === 'init_phone_model')
  {
    state[fromNumber].phoneModel = incomingMsg;
    console.log('Collected phone model from '+fromNumber+' as: '+incomingMsg);
  }

  

  // Ensure we have a valid node
  if(!getCurrentNode(fromNumber))
  {
    console.log('Missing node: '+state[fromNumber].node);
    return;
  }

  // Setup yes bool
  const yes = incomingMsg.includes('y');

  // Move user to next flow pos
  if(yes)
  {
    let targetNode = getCurrentNode(fromNumber).l;
    updateUserNode(fromNumber, targetNode);
    //state[fromNumber] = flowTree[state[fromNumber]].l;  
  }
  else
  {
    let targetNode = getCurrentNode(fromNumber).r;
    updateUserNode(fromNumber, targetNode);
    //state[fromNumber] = flowTree[state[fromNumber]].r;  
  }

  //
  // Handle End Nodes
  //
  if(state[fromNumber].node === 'end_resolution_y')
  {
    //
    console.log(fromNumber+': reached the end of the tree...');
    const sendMsg = JSON.stringify(state[fromNumber],null, 2);
    await sendSMS.sendAdmin(sendMsg);
    //initUserState(fromNumber);
  }
  if(state[fromNumber].node === 'end_resolution_n')
  {
    //
    console.log(fromNumber+': reached the end of the tree...');
    const sendMsg = JSON.stringify(state[fromNumber],null, 2);
    await sendSMS.sendAdmin(sendMsg);
    //initUserState(fromNumber);
  } 

  // Init is special
  if(state[fromNumber].node === 'init')
  {
    // Pass init node no matter what the original msg says
    let targetNode = getCurrentNode(fromNumber).l;
    updateUserNode(fromNumber, targetNode);
  }

  // Dump a copy of the current state
  dumpState(); 

  // Return the final message
  resMsg = getCurrentNode(fromNumber).text;
  respond(resMsg, res);
});

http.createServer(app).listen(3001, () => {
  console.log('Express server listening on port 1337');
});


// Setup local defs
  //let UserNode = state[fromNumber];// String of user node id
  //let treeNode = flowTree[UserNode];// Actual node data