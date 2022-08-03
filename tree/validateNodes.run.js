const validateNodes = require('./validateNodes');

function run()
{
    const res = validateNodes();
    if(res.length > 0)
    {
        console.log('Issues:');
        console.log(JSON.stringify(res, null, 2));
        return;
    }
    console.log('No issues found!');
}
run();