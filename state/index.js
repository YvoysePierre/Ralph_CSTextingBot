const fs = require('fs');

const treeFlow = require('../tree/treeFlow');

let state = {

};

function dump(){
    fs.writeFileSync(__dirname+'/state-dump.json', JSON.stringify(state, null, 2));
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
  };
  dump();
}

function updateUserNode(fromNumber, newNode)
{
  if(treeFlow[newNode])
  {
    state[fromNumber].node = newNode;
    return;
  }
  console.log('Can not find node: '+newNode);
}
function getUserNode(fromNumber)
{
    if(userExists(fromNumber))
    {
        return treeFlow[state[fromNumber].node];
    }
    console.log('Can not find state for: '+fromNumber);
}
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

module.exports = {
    dump,
    initUser,
    updateUserNode,
    getUserNode,
    getUserNodeString,
    updateUserData,
    userExists,
    getStateJSON,
};