const sendSMS = require('./sendSMS');

async function test()
{
    const res = await sendSMS.send('3602248958', 'This is a test message 123x');
    console.log(JSON.stringify(res, null, 2));  
}
test();