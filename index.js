const Discord = require("discord.js");
const bot = new Discord.Client();

const express = require('express');
const _ = require("underscore");
const app = express();

var commandsService = require('./service/commandsService');
var latestLogs = process.env.LATEST_LOGS_URL;

// set the port of our application
// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 5000;

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the `public` directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

// set the home page route
app.get('/', (request, response) => {
    // ejs render automatically looks in the views folder
    response.render('index');
});

app.listen(port, () => {
    // will echo 'Our app is running on http://localhost:5000 when run locally'
    console.log('Our app is running on http://localhost:' + port);
});

// pings server every 15 minutes to prevent dynos from sleeping
setInterval(() => {
    http.get('http://drp-discobot.herokuapp.com');
}, 900000);

// User to prevent commands from interrupting other commands
var isPlayingClip = false;
var introsEnabled = false;
// Event triggered when a message is sent in a text channel
bot.on('message', message => {
    // Commands are represented by a '!'
    if (message.content.charAt(0) == "!") {
        handleCommand(message);        
    }
    // Queries are represented by a "?"
    else if (message.content.charAt(0) == "?") {
        handleQuery(message);
    }
});

// Event triggered when a user changes voice state - e.g. joins/leaves a channel, mutes/unmutes, etc.
bot.on('voiceStateUpdate', (oldMember, newMember) => {
    let newUserChannel = newMember.voiceChannel;
    let oldUserChannel = oldMember.voiceChannel;

    // User joins channel. This does not handle users joining a voice
    // channel from another voice channel.
    if (introsEnabled && oldUserChannel === undefined && newUserChannel !== undefined) {
        let voiceChannel = newMember.voiceChannel;
        let username = newMember.user.tag;

        // TODO:    Do we want people entering the channel to have their intro songs
        //          interrupt the bot if the bot is already playing a clip? Or just not
        //          play the intro? It is now currently setup so that the bot will not
        //          interrupt.
        if (username == "kyhole#3631" && !isPlayingClip) {
            isPlayingClip = true;
            voiceChannel.join().then(connection => {
                var dispatcher = connection.playFile('./clips/KyleChannelIntro.wav');
                dispatcher.on("end", end => {
                    voiceChannel.leave();
                    isPlayingClip = false;
                });
            }).catch(err => console.log(err.toString()));
        }
        else if (username == "robborg#4693" && !isPlayingClip) {
            isPlayingClip = true;
            voiceChannel.join().then(connection => {
                var dispatcher = connection.playFile('./clips/RobbieHasArrived.mp3');
                dispatcher.on("end", end => {
                    voiceChannel.leave();
                    isPlayingClip = false;
                });
            }).catch(err => console.log(err.toString()));
        }
        else if (username == "Jenkinz94#4030" && !isPlayingClip) {
            isPlayingClip = true;
            voiceChannel.join().then(connection => {
                var dispatcher = connection.playFile('./clips/NickHasArrived.mp3');
                dispatcher.on("end", end => {
                    voiceChannel.leave();
                    isPlayingClip = false;
                });
            }).catch(err => console.log(err.toString()));
        }
        else if (username == "mr.barron#9498" && !isPlayingClip) {
            isPlayingClip = true;
            voiceChannel.join().then(connection => {
                var dispatcher = connection.playFile('./clips/AlexChannelIntro.mp3');
                dispatcher.on("end", end => {
                    voiceChannel.leave();
                    isPlayingClip = false;
                });
            }).catch(err => console.log(err.toString()));
        }
    }

    // User leaves channel
    else if (newUserChannel === undefined) {
        // WE CAN DO WHATEVER HERE
    }
});

var discordKey = process.env.DISCORD_KEY;
bot.login(discordKey);

function playClip(userCommand, voiceChannel) {
    var commandToPlay = commandsService.getCommandByName(userCommand);
    if (!_.isUndefined(commandToPlay)) {
        isPlayingClip = true;
        voiceChannel.join().then(connection => {
            var dispatcher = connection.playFile('./clips/' + commandToPlay.fileName);
            dispatcher.on("end", end => {
                voiceChannel.leave();
                isPlayingClip = false;
            });
        }).catch(err => {
            message.reply(err.toString());
            voiceChannel.leave();
            isPlayingClip = false;
        });
    }
}

function isManlyDanly(textToCheck) {
    var isManlyDanly = true;
    _.every(textToCheck, function (char, index) {
        if (!((index % 3 == 0 && (char == 'm' || char == "d")) || (index % 3 == 1 && char == 'a') || (index % 3 == 2 && char == 'n'))) {
            isManlyDanly = false;
            return false; // (_.every's version of break)
        }
    });
    return isManlyDanly;
}

function handleQuery(message) {
    let userQuery = message.content.split("?")[1].toLowerCase();
    if (isManlyDanly(userQuery)) {
        var manualMessage = "---------------------------------------------------------------------\n" +
            "| :sailboat: Dread Pirate Roberts Custom Discord Bot Manual :sailboat: |\n" +
            "---------------------------------------------------------------------\n" +
            "\n" +
            "QUERIES:\n" +
            "------------\n" +
            "?man - Outputs the DPR Discord Bot Manual (NOTE: This also works with any combination of 'man's and 'dan's)\n" +
            "?list - Outputs the list of sound byte commands\n" +
            "?logs - Outputs the WarcraftLogs from the most recent raid (Assuming we actually remembered to update it!)\n" +
            "\n" +
            "COMMANDS:\n" +
            "-----------------\n" +
            "!cmere - Force the bot to join your voice channel...for whatever reason\n" +
            "!gtfo - Gets the bot the fuck out of your voice channel, in case someone plays !beastmode\n" +
            "!toggleIntros - Toggles ON/OFF intro themes when people join a voice channel";
            
        message.channel.send(manualMessage);
    }
    else if (userQuery === "list") {
        commandsService.outputListToChannel(message.channel);
    }
    else if (userQuery === "logs") {
        // TODO -   this is manual so far. We'll need to manually update an environment variable
        //          each time we raid. It'd be better to hook up to a simple database so we can push logs to it
        //          directly from discord commands
        //          https://elements.heroku.com/addons/mongolab
        message.channel.send("Here's a link to the latest logs: " + latestLogs);
    } else {
        message.channel.send("Invalid query. Try typing ?man for options!")
    }
}

function handleCommand(message) {
    let userCommand = message.content.split("!")[1].toLowerCase();
    let voiceChannel = message.member.voiceChannel;    
    if (userCommand == "cmere") {
        if (voiceChannel != null) {
            // dunno why you'd ever need this
            voiceChannel.join();
        }
    } else if (userCommand == "gtfo") {
        if (voiceChannel != null) {
            voiceChannel.leave();
            isPlayingClip = false;
        }
    } else if (userCommand == "list") {
        message.channel.send("WARNING: !list is deprecated. Please start using the '?' operator for queries! (e.g. '?list')");
        commandsService.outputListToChannel(message.channel);
    } else if (userCommand == "toggleintros") {
        var toggleMessage = "Toggling intro sounds: ";
        var onOrOff = introsEnabled ? "OFF" : "ON";
        message.channel.send(toggleMessage + onOrOff);
        introsEnabled = !introsEnabled;
    } else if (!isPlayingClip) { // Don't play another clip if the bot is already playing a clip
        if (voiceChannel != null) {
            playClip(userCommand, voiceChannel);
        }
    } else {
        // TODO - this doesn't work because playClip checks for the validity of the command :\
        message.channel.send("Invalid command. Try typing ?man for options!")   
    }
}
