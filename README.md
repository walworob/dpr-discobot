# Dread Pirate Roberts - Discord Bot

## ACCESS
First thing's first. Ask someone who already has this all set up (e.g. Robbie, Kyle) for access to the Heroku project (and github if we haven't made it public yet)

## SETUP
It's probably worth mentioning that we followed [this guide](https://github.com/synicalsyntax/discord.js-heroku), so if you want you can just try to follow that. But we've faced some recurring problems and this guide should show you how to get past those, so if you ignore this and go on your own I'll probably tell you to piss off when you ask for help :). 

Anyways...

### 1. Install a Linux Distro
*(NOTE: this is technically optional, but this guide is based on the assumption that you're running from Ubuntu for Windows)*

1. Enable linux subsystems to be installed in Windows 
   1. Run Windows Powershell as Administrator
   2. Run the following command (it may take a few minutes):
        ```
        Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux
        ```
    3. Restart when prompted
2. Install Ubuntu from the Windows Store. Let it sit there thinking while it configures itself. This took some time for me.
   1. I think it asks you to set up a linux username and pw. Just pick something you'll remember so that you can sudo later

### 2. Get NodeJS
1. First get nvm (node version manager) by running this:
    ```
    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
    ```
    1. Verify the install by running the below command. It should output `nvm`
        ```
        command -v nvm
        ```

2. Now use nvm to install NodeJS:
    ```
    nvm install node
    ```
    1. Verify by running `which node` or `node -v` (if nothing comes back, relaunch Ubuntu and try again)

### 3. Get Git (and git gud)
1. First update your apt-get:
    ```
    sudo apt-get update
    ```
2. Now install git:
   ```
   sudo apt-get install git-core
   ```
3. Verify the install:
   ```
   git --version
   ```
4. Configure git **(REPLACE PLACEHODLERS WITH YOUR INFO)**:
   ```
   git config --global user.name "John Doe"
   git config --global user.email "john.doe@gmail.com"
   ```
5. While we're doing git stuff, might as well get the code:
   1. Navigate to where you want to put the project (mine is at `/mnt/d/git`)
   2. Run this (assuming Robbie gave you access):
        ```
        git clone https://github.com/walworob/dpr-discobot.git
        ```

### 4. Get Heroku
1. Install it (takes some time):
   ```
   curl https://cli-assets.heroku.com/install-ubuntu.sh | sh
   ```
2. Verify:
   ```
   heroku -v
   ```

### 5. Get the correct version of Python
This part is stupid. I guess Ubuntu ships with Python3 installed, but we need Python2 I guess. At this point if you pulled down the code and ran `npm update` you'd get a big giant error. So we're going to use a hack to get it working...

**If you find a better way to get this working, by all means, do that instead. Just make sure you update the README to show what you did!**

1. If you didn't already run `apt-get update` above, run it now.
2. Install python2.7: 
   ```
   sudo apt-get install python2.7
   ```
3. Create a symbolic link from current Python to old Python (sorry if you're using python for something else...we're basically going to force python to use 2.7):
    ```
    sudo ln -s /usr/bin/python2.7 /usr/bin/python
    ```

### 6. Get unix build-essential package
If you tried running `npm update` here, you'd get some error about not having "make" installed. Get around that by running this:
```
sudo apt-get install build-essential
```
**NOTE:** This takes some time!
### 7. Get FFMPEG (this is used somehow to actually play the files)
Run the following:
```
sudo apt-get install ffmpeg
```
### 8. Get the code if you didn't already in the Git setup steps
1. Navigate to where you want to put the project (mine is at `/mnt/d/git`)
2. Run this (assuming Robbie gave you access):
     ```
     git clone https://github.com/walworob/dpr-discobot.git
     ```
### 9. Update your node dependencies (stuff defined in package.json)
1. Navigate to the root of the project
2. Run this:
   ```
   npm install
   ```
### 10. Set up environment variables
1. Log in to Heroku:
   ```
   heroku login
   ```
2. Run the following command to get the discord key from the (hopefully secure) server:
   ```
   heroku config:get DISCORD_KEY --app drp-discobot
   ```
3. Copy the output
4. Create a new file at the root of the project called `.env`
5. Open the file in a text editor and enter the following:
   ```
   DISCORD_KEY=that-thing-you-copied-in-step-3-as-is-with-no-quotes
   LATEST_LOGS_URL=https://www.google.com
   ```
6. Save and close!

## RUNNING LOCALLY
1. Log in to Heroku:
   ```
   heroku login
   ```
2. Once you authenticate through the browser, start the bot locally with this:
   ```
   heroku local
   ```

## USAGE
### Update latest logs (temporary until we get set up with a db)
1. To upload the URL which points to the latest raid logs, run the following:
   ```
   heroku config:set LATEST_LOGS_URL=https://www.warcraftlogs.com/URL/FOR/LATEST/LOGS/FROM/RAID
   ```