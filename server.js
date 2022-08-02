const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');

const flowTree = require('./flowTree');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));


let state = {

}

async function respond(msg, res)
{
  const twiml = new MessagingResponse();
  twiml.message(msg);
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
}

app.post('/sms', (req, res) => {
  const fromNumber = req.body['From'];

  let resMsg = 'init_msg';

  if(!state[fromNumber])
  {
    // We have a new user
    state[fromNumber] = 'init';
  }

  // Get incoming msg
  let incomingMsg = req.body.Body;
  incomingMsg = incomingMsg.toLowerCase();

  // Handle special commands
  if(incomingMsg === '!reset')
  {
    console.log(fromNumber+' requested reset!');
    state[fromNumber] = 'init';
  }
  if(incomingMsg === '!status')
  {
    resMsg = JSON.stringify(state, null, 2);
    respond(resMsg, res);
    return;
  }

  // Setup yes bool
  const yes = incomingMsg.includes('y');

  // Move user to next flow pos
  if(yes)
  {
    state[fromNumber] = flowTree[state[fromNumber]].l;  
  }
  else
  {
    state[fromNumber] = flowTree[state[fromNumber]].r;  
  }
  
  // Setup local defs
  //let userState = state[fromNumber];// String of user node id
  //let treeNode = flowTree[userState];// Actual node data
  
  // Init is special
  if(state[fromNumber] === 'init')
  {
    // Pass init node no matter what the original msg says
    state[fromNumber] = treeNode.l;
  }
  // Ensure we have a valid node
  if(!flowTree[state[fromNumber]])
  {
    console.log('Missing node: '+userState);
    return;
  }

  resMsg = flowTree[state[fromNumber]].text;
  respond(resMsg, res);
});

http.createServer(app).listen(3001, () => {
  console.log('Express server listening on port 1337');
});