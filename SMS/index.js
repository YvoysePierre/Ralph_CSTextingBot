//
// Wrapper over the Twilio API
//
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const {accountSid, authToken, senderNum, adminNum} = require('../config');
const client = require('twilio')(accountSid, authToken);

// Send a Generic SMS message to anyone
async function send(to="3602248958", body="Live long and prosper!")
{
    const res = await client.messages.create({
        body: body,
        from: '+1'+senderNum,
        to: '+1'+to
    });
    return res;
}

// Send an SMS to the specified admin number
async function sendAdmin(body="Live long and prosper!")
{
    body = 'ADMIN MSG: \r\n'+body;
    console.log('Seinding an Admin MSG:');
    console.log(body);
    const res = await send(adminNum, body);
    return res;
}

// Respond to an incoming SMS
async function respond(msg, res)
{
    if(!res)
    {
        console.log('Missing res');
        return;
    }
    const twiml = new MessagingResponse();
    twiml.message(msg);
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
    console.log('Sent Msg:');
    console.log(msg);
}

module.exports = {
    send,
    sendAdmin,
    respond
}


