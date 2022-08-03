
const state = require('../state');
const SMS = require('../SMS');
const validateNodes = require('../tree/validateNodes');

function ensureValidNodes()
{
    const res = validateNodes();
    if(res.length > 0)
    {
        console.log('Issues:');
        console.log(JSON.stringify(res, null, 2));
        return false;
    }
    console.log('All nodes appear valid. No issues found!');
    return true;
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

function logMsg(fromNumber, req)
{
  console.log('\r\n///////');
  console.log(new Date().toLocaleString('en-US', {timeZone: 'PST'}));
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

function specialCommands(fromNumber, incomingMsg, res)
{
  //
  // Handle special commands
  //
  let stopLoop = false;
  let isSpecial = incomingMsg.startsWith('!');
  if(!isSpecial)
  {
    // This is not a special command
    return stopLoop;
  }
  switch(incomingMsg)
  {
    case '!reset':
      console.log(fromNumber+' requested reset!');
      state.initUser(fromNumber);
      break;
    case '!state':
      resMsg = JSON.stringify(state.getJSON(), null, 2);
      SMS.respond(resMsg, res);
      stopLoop = true;
      break;
    case '!skip':
      // Instead of updating to start, update to phone model
      // Which is the last init question
      // Otherwise the command will be treated as an answer to the first question
      state.updateUserNode(fromNumber, 'init_phone_model');
      // Set user data to fixed
      state.updateUserData(fromNumber, 'email', 'skipped');
      state.updateUserData(fromNumber, 'location', 'skipped');
      state.updateUserData(fromNumber, 'walkbook', 'skipped');
      state.updateUserData(fromNumber, 'precinct', 'skipped');
      state.updateUserData(fromNumber, 'phoneModel', 'skipped');
      break;
    default:
      console.log('Can not find special command: '+incomingMsg);
      console.log('Skipping this response!');
      stopLoop = true;
      break;
  }
  return stopLoop;
}

function initQuestions(fromNumber, incomingMsg)
{
  //
  // Handle init questions
  //
  switch(state.getUserNodeString(fromNumber))
  {
    case 'init_email':
      state.updateUserData(fromNumber, 'email', incomingMsg);
      console.log('Collected email from '+fromNumber+' as: '+incomingMsg);
      break;
    case 'init_location':
      state.updateUserData(fromNumber, 'location', incomingMsg);
      console.log('Collected location from '+fromNumber+' as: '+incomingMsg);
      break;
    case 'init_walkbook':
      state.updateUserData(fromNumber, 'walkbook', incomingMsg);
      console.log('Collected walkbook from '+fromNumber+' as: '+incomingMsg);
      break;
    case 'init_precinct':
      state.updateUserData(fromNumber, 'precinct', incomingMsg);
      console.log('Collected precinct from '+fromNumber+' as: '+incomingMsg);
      break;
    case 'init_phone_model':
      state.updateUserData(fromNumber, 'phoneModel', incomingMsg);
      console.log('Collected phone model from '+fromNumber+' as: '+incomingMsg);
      break;
  }
}

function yesNo(fromNumber, incomingMsg)
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
    console.log(fromNumber+': reached the end of the tree...');
    const sendMsg = JSON.stringify(state.getUserJSON(fromNumber),null, 2);
    await SMS.sendAdmin(sendMsg);
  }
  if(state.getUserNodeString(fromNumber) === 'end_resolution_n')
  {
    console.log(fromNumber+': reached the end of the tree...');
    const sendMsg = JSON.stringify(state.getUserJSON(fromNumber),null, 2);
    await SMS.sendAdmin(sendMsg);
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

// State wrappers
function dumpState()
{
    state.dump();
}

function getUserNode(fromNumber)
{
    return state.getUserNode(fromNumber);
}

module.exports = {
  ensureValidNodes,
  validNode,
  parseMsg,
  logMsg,
  checkUser,
  specialCommands,
  initQuestions,
  yesNo,
  endNodes,
  handleInitNode,
  dumpState,
  getUserNode,
};