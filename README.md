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
This project runs on a custom docker container. This can be built from the tools in `/docker` or downloaded from Docker Hub at `matdombrock/sms-bot`. The Docker images does NOT contain the private repo code. 

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

The tree logic is defined in `/tree/treeLogic.js`. This contains all of the app behavior that is related to the binary tree. 

## Validating Nodes
Since the tree definitions are a little hard to validate by hand, I wrote a tool to do this automatically. 

Essentially the tool checks to make sure the children (`l` and `r` nodes) of each node actually exist. 

This runs automatically when the bot starts and the bot will refuse to start if this check does not pass. It would crash eventually if it didn't refuse to start. 

This can also be run manually with `node /tree/validateNodes`.

## Config
The `/config.js` file defined the configuration of the chat bot as well as any needed credentials. 

## Server
The file `/server.js` is the main entry point for the chat bot. Run this to start the bot. 

The server provides an web hook endpoint for the Twilio API to connect to at `/sms`. This contains the main logic for the bot. 

The server also provides the admin API endpoints.

If the server IP address changes, this needs to be changed on the Twilio dashboard to reflect the new IP. This can be done under phone number settings in the incoming SMS section. 

[Twilio Console](https://console.twilio.com/us1/develop/phone-numbers/manage/incoming?frameUrl=%2Fconsole%2Fphone-numbers%2Fincoming%2FPN59a01ef2f137b9dd1ece552cbd3a01b2%3F__override_layout__%3Dembed%26bifrost%3Dtrue%26x-target-region%3Dus1)

## Admin API Commands
Since the bot is essentially just a web server, I have created a simple API that allows the admin to control the bot and retrieve info about the bot. 

To this API is available at `<ip_address>:<port>/<endpoint_name>`. 

The currently available endpoints are:

* `/state` - Get the bot state as a JSON object
* `/stateClear` - Clear the global bot state (deletes all existing user profiles)
* `/log` - Get the server log
* `/logDownload` - Download a copy of the server log
* `/logClear` - Clear the logs (if they get too long)

Right now, these can be accessed at the following links:

[STATE](http://159.223.141.60:3001/state)

[STATE CLEAR](http://159.223.141.60:3001/stateClear)

[LOG](http://159.223.141.60:3001/log)

[LOG DOWNLOAD](http://159.223.141.60:3001/logDownload)

[LOG CLEAR](http://159.223.141.60:3001/logClear)

Right now, there is nothing stopping anyone from using these endpoints. That being said they would have to guess the IP address. There is no way to figure it out just by sending and receiving texts from the bot. 

### Web Interface
I also added a SUPER simple web interface for this. This is at `/`. Currently:

[WEB INTERFACE](http://159.223.141.60:3001/)

## Special Bot Commands
Similar to the admin API endpoints, the bot has a few special admin commands that can give some valuable information without accessing the API. 

At this time there is nothing to prevent regular users from using these commands aside from the fact that are secret. 

`!reset` - Resets your user state (not the global state)
`!state` - Responds with the global state in JSON format
`!skip`  - Skips the initial questions 



## Useful Docker Commands
```
docker build -t matdombrock/sms-bot .

docker run -p 3001:3001 -it --name sms matdombrock/sms-bot

docker container rm sms
```