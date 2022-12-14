const fs = require('fs');

const tree = require('../tree/tree');

let state = {

};

function dump(){
    fs.writeFileSync(__dirname+'/state-dump.json', JSON.stringify(state, null, 2));
}

function clear()
{
    state = {};
}

function initUser(fromNumber)
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
    history: [],
  };
  dump();
}

function updateUserNode(fromNumber, newNode)
{
  if(tree[newNode])
  {
    state[fromNumber].node = newNode;
    return;
  }
  console.log('Can not find node: '+newNode);
}

function updateUserHistory(fromNumber, choice)
{
    state[fromNumber].history.push(choice);
}
// Gets the actual node data of the user's current node
function getUserNode(fromNumber)
{
    if(userExists(fromNumber))
    {
        return tree[state[fromNumber].node];
    }
    console.log('Can not find state for: '+fromNumber);
}
// Gets the user's current node ID as a string
function getUserNodeString(fromNumber)
{
    if(userExists(fromNumber))
    {
        return state[fromNumber].node;
    }
    console.log('Can not find state for: '+fromNumber);
}

function updateUserData(fromNumber, dataPoint, newValue)
{
    if(!state[fromNumber])
    {
        console.log('Missing state for '+fromNumber);
        return;
    }
    if(state[fromNumber][dataPoint])
    {
        state[fromNumber][dataPoint] = newValue;
        return;
    }
    console.log('Can not find data point: '+dataPoint);
}

function userExists(fromNumber)
{
    return state[fromNumber] ? true : false;
}


function getJSON()
{
    return state;
}

function getUserJSON(fromNumber)
{
    return state[fromNumber]
}

module.exports = {
    dump,
    clear,
    initUser,
    updateUserNode,
    updateUserHistory,
    getUserNode,
    getUserNodeString,
    updateUserData,
    userExists,
    getJSON,
    getUserJSON
};