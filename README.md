# SMS Field Sales or Customer Service Bot
Big thanks to @matdombrock for participating with this project. 

#Purpose of SMS Field Sales CS Bot
The objective of this project was to give field canvassers/sales reps a way to send me any issues with their native field application (think salesforce).  It works well and has a lot of potential in multiple fields. You’ll need to be familiar with the stack. 

#Details 
This is a NodeJS app that runs in a Docker Image. The Docker Image is available on docker hub at `matdombrock/sms-bot`.

Simply stated, interaction happens when a user sends a text message to the given phone number.This will cause Twilio to send a request (web hook) to the express server at the `/sms` endpoint. 

## Stack
* Linux
* [Docker](https://hub.docker.com/) 
* [Tmux](https://github.com/tmux/tmux/wiki)
* [NodeJS](https://nodejs.dev/)
* [ExpressJS](https://expressjs.com/) (NodeJS web server framework)
* [Twilio API Wrapper](https://www.twilio.com/docs/sms/quickstart/node) (NodeJS API Wrapper)
* Custom Bot Logic (NodeJS)
* Binary Tree Definition (JSON)


## Setup
1. Download/Run Docker Image
2. Clone Repo
3. Install NPM packages How to Install NPM Packages (also Update and Uninstall) – HowToCreateApps
4. Create a new tmux pane and attach to the pane How to use tmux to create a multi-pane Linux terminal window | Network World
5. Run `node server | tee -a server.log`

## Run

Run in Tmux.

```bash
node server | tee -a server.log
```

## Logging
Logging will happen automatically because of the `<...> | tee -a server.log` part of the run command. 

This log path is hard coded into the bot as the location to read its own log from. 

This log is *appended* and not deleted when you start the bot. Clearing the log can be done just by deleting the existing log file. 

A new log file will be created again automatically on the next run. 

## Docker
This project runs on a custom docker container found with Docker Hub at `matdombrock/sms-bot`. Important to note that the Docker images does NOT contain the private repo code. 

## SMS
SMS integration happens via the Twilio API using a wrapper inside `/SMS` to send messages.

Receiving messages happens through the webhook at `/sms` mentioned above. 

## State
The state of the app is stored with a data structure that looks something like this:
```js
state[fromNumber] = {
    phone: fromNumber,
    node: 'init',
    email: 'unknown',
    time: Date.now(),
    location: 'unknown',
    phoneModel: 'unknown',
};
```

We included ‘phoneModel’ in effort to help decipher any issues pertinent to the users phone model. 
The state cannot be mutated directly and must be accessed via the `state` wrapper in `/state`. 

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

The tree logic is defined in `/tree/treeLogic.js`. This contains the app behavior that is related to the binary tree. 

## Validating Nodes
Since the tree definitions are hard to validate by hand, we wrote a tool to do this automatically. 

Essentially the tool checks to make sure the children (`l` and `r` nodes) of each node exist. 

This runs automatically when the bot initiates and the bot will refuse to start if this check does not pass. It would crash eventually if it didn't refuse to start. 

This can be ran manually with `node /tree/validateNodes`.

## Config
The `/config.js` file defined the configuration of the chat bot as well as any needed credentials. 

## Server
The file `/server.js` is the main entry point for the chat bot. Run this to start the bot. 

The server provides a web hook endpoint for the Twilio API to connect to at `/sms`. This contains the main logic for the bot. 

The server also provides the admin API endpoints.

If the server IP address changes, this needs to be changed on the Twilio dashboard to reflect the new IP. This can be done under phone number settings in the incoming SMS section. 

[Twilio Console]

## Admin Messages
When a user reaches the end of the tree they will be at a "resolution node". There are 2 types of resolution node:

* `resolution_y` - The user's issue was resolved. The admin is not notified.
* `resolution_n` - The user's issue was NOT resolved. The admin IS notified.

When the user's issue was not resolved, the bot will send a message to the admin number (set in `/config.js`). Right now, this will just send the current user state as JSON. 

## Admin API Commands
Since the bot is essentially just a web server, we created a simple API that allows the admin to control the bot and retrieve info about the bot. This API is available at `<ip_address>:<port>/<endpoint_name>`. 

The available endpoints are:

* `/state` - Get the bot state as a JSON object
* `/stateClear` - Clear the global bot state (deletes all existing user profiles)
* `/log` - Get the server log
* `/logDownload` - Download a copy of the server log
* `/logClear` - Clear the logs (if they get too long)

These can be accessed at the following links:

[STATE](http://XXX.XXX.XXX.XX:XXXX/state)

[STATE CLEAR](http://XXX.XXX.XXX.XX:XXXX/stateClear)

[LOG](http://XXX.XXX.XXX.XX:XXXX/log)

[LOG DOWNLOAD](http://XXX.XXX.XXX.XX/logDownload)

[LOG CLEAR](http://XXX.XXX.XXX.XXX.XX:XXXX/logClear)

As this iteration stands there is nothing stopping anyone from using the endpoints. They would have to guess your IP address. There is no way to figure out just by sending and receiving texts from the bot. 

### Web Interface
I also added a SUPER simple web interface for this. This is at `/`. Currently:

[WEB INTERFACE](http://XXX.XXX.XXX.XX:XXXX/)

## Special Bot Commands
Like the admin API endpoints, the bot has a few admin commands that can provide valuable information without accessing the API. 

* `!reset` - Resets your user state (not the global state)
* `!state` - Responds with the global state in JSON format
* `!skip`  - Skips the initial questions 

## Useful Docker Commands
```
docker build -t matdombrock/sms-bot .

docker run -p XXXX:XXXX -it --name sms matdombrock/sms-bot

docker container rm sms
```
