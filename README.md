docker build -t matdombrock/sms-bot .

docker run -p 3001:3001 -it --name sms matdombrock/sms-bot

docker container rm sms


///

TWILIO_ACCOUNT_SID="ACe9740307b473cc0c73efb1b50dc69f43" TWILIO_AUTH_TOKEN="9ca4f841cb944503f9c7b4551961ac08" TWILIO_NUMBER="+19403505880" ADMIN_NUMBER="+3602248958" node app