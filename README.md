# SMS BOT
This is a NodeJS app that runs in a Docker Image. The Docker Image is available on docker hub at `matdombrock/sms-bot`.

Interaction happens when a user sends a text message to the given phone number. 

This will cause Twilio to send a request (web hook) to the express server at the `/sms` endpoint. 

## Setup
1. Download/Run Docker Image
2. Clone Repo
3. Install NPM packages
4. Run `server.js`

## Docker
This project runs on a custom docker container. This can be built from the tools in `/docker` or downloaded from Dockerhub at `matdombrock/sms-bot`. The Docker images does NOT contain the private repo code. 

## SMS
SMS integration happens via the Twilio API using a the wrapper inside `/SMS` to send messages.

Reciving messages happens through the webhook at `/sms` mentioned above. 

## State
The state of the app is stored with a data structure that looks something like this:
```js
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
```

The state can not be mutated directly and must be accessed via the `state` wrapper in `/state`. 

## Tree
The main chat bot logic is defined as a binary tree. The nodes are defined in `/tree/tree.js` as simple JSON objects like this:
```js
data_save:{
    text: `Does your data save?`,
    l:'gps_issue',
    r:'free_space'
},
```

Each node has an `l` and `r` pointer which point to another node.

The tree logic is defined in `/tree/treeLogic.js`. This contains all of the app behavior that is realted to the binary tree. 

## Config
The `/config.js` file defined the configuration of the chat bot as well as any needed credentials. 

## Server
The file `/server.js` is the main entry point for the chat bot. Run this to start the bot. 

## Special Bot Commands

`!reset` - Resets your user state (not the global state)
`!state` - Responds with the global state in JSON format
`!skip`  - Skips the inital questions 

## Admin API Commands
Since the bot is essentially just a web server, I have created a simple API that allows the admin to control the bot and retrive info about the bot. 

To this API is available at `<ip_adress>:<port>/<endpoint_name>`. 

The currently available endpoints are:

* `/state` - Get the bot state as a JSON object
* `/stateClear` - Clear the global bot state (deletes all existing user profiles)
* `/log` - Get the server log
* `/logDownload` - Download a copy of the server log
* `/logClear` - Clear the logs (if they get too long)

Right now, these can be accessed at the following links:

http://159.223.141.60:3001/state

http://159.223.141.60:3001/stateClear

http://159.223.141.60:3001/log

http://159.223.141.60:3001/logDownload

http://159.223.141.60:3001/logClear

### Web Interface
I also added a SUPER simple web interface for this. This is at `/`. Currently:

http://159.223.141.60:3001/

## Useful Docker Commands
```
docker build -t matdombrock/sms-bot .

docker run -p 3001:3001 -it --name sms matdombrock/sms-bot

docker container rm sms
```