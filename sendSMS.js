// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const {accountSid, authToken, senderNum, adminNum} = require('./config');

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const senderNum = process.env.TWILIO_NUMBER;
// const adminNum = process.env.ADMIN_NUMBER;
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
    const res = await send(adminNum, body);
    return res;
}

module.exports = {
    send,
    sendAdmin
}


