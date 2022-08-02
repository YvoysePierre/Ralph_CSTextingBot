#!/bin/bash
cat << EOF
     __   __  _______  ______   _______       
    |  |_|  ||       ||      | |   _   |      
    |       ||   _   ||  _    ||  |_|  |      
    |       ||  | |  || | |   ||       |      
    |       ||  |_|  || |_|   ||       |      
    | ||_|| ||       ||       ||   _   |      
    |_|   |_||_______||______| |__| |__|      
 _     _  _______  ______    ___   _  _______ 
| | _ | ||       ||    _ |  |   | | ||       |
| || || ||   _   ||   | ||  |   |_| ||  _____|
|       ||  | |  ||   |_||_ |      _|| |_____ 
|       ||  |_|  ||    __  ||     |_ |_____  |
|   _   ||       ||   |  | ||    _  | _____| |
|__| |__||_______||___|  |_||___| |_||_______|
EOF

SETUP_CHECK=.setup_complete

if ! test -f "$SETUP_CHECK"; then

cat << EOF
Modaworks back-end Docker image setup. 
Mathieu Dombrock 2022
Press any key to continue with setup...
EOF

read -n 1 -s
printf "\033c"

cat << EOF
First we need to collect your Github username, email
and auth token. This will be used to clone the
repo as well as setup a git profile for your 
user account. 
Press any key to continue...
EOF

read -n 1 -s
printf "\033c"

echo "Github Username:"
read gh_username
echo "Github Email:"
read gh_email
echo "Github Token:"
read gh_token

echo " "
echo "Thanks! If that was all right press any key to continue..."

read -n 1 -s
printf "\033c"

echo "Setting up git profile..."
git config --global user.name $gh_username
git config --global user.email $gh_email

echo "Done. Press any key to continue..."
read -n 1 -s
printf "\033c"

echo "If you know the Docker IP of the DB container enter it now (or hit enter to continue):"
read -e -i "localhost" db_ip
echo "Setting up db config file..."
cat << EOF > /usr/src/app/moda_db_config.json
{
  "database":"moda",
  "user":"moda",
  "pass":"password123",
  "host":"$db_ip"
}
EOF

echo "DB Config:"
cat /usr/src/app/moda_db_config.json
echo "You can change this later by editing /usr/src/app/moda_db_config.json"

echo "Press any key to continue..."
read -n 1 -s
printf "\033c"

echo "Cloning back-end repo..."
git clone https://$gh_username:$gh_token@github.com/Twelve-23/MODA_Server.git
echo "Installing node modules..."
cd /usr/src/app/MODA_Server/server && npm install
cd /usr/src/app/

echo "Cloning utilities..."
git clone https://$gh_username:$gh_token@github.com/Twelve-23/Moda-util.git
echo "Installing node modules..."
cd /usr/src/app/Moda-util && npm install
cd /usr/src/app/

echo "Renaming directories..."
mv MODA_Server moda_back
mv Moda-util moda_util
cat << EOF
 ______   _______  __    _  _______  __  
|      | |       ||  |  | ||       ||  | 
|  _    ||   _   ||   |_| ||    ___||  | 
| | |   ||  | |  ||       ||   |___ |  | 
| |_|   ||  |_|  ||  _    ||    ___||__| 
|       ||       || | |   ||   |___  __  
|______| |_______||_|  |__||_______||__| 
PRESS ANY KEY TO EXIT SETUP...
EOF

touch .setup_complete

read -n 1 -s

fi

bash