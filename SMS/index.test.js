const SMS = require('./index');

async function test()
{
    const res = await SMS.send('3602248958', 'This, right here, right now, is a test message 123x');
    console.log(JSON.stringify(res, null, 2));  
}
test();
