const Discord = require("discord.js");
const bot = new Discord.Client();

const express = require('express');
const _ = require("underscore");
const app = express();

var commandsService = require('./service/commandsService');

// set the port of our application
// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 5000;
var fs = require('fs');

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
var playClip = function(userCommand, voiceChannel) {
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
            message.reply(err.toString())
            voiceChannel.leave();
            isPlayingClip = false;
        });
    }
};

// Event triggered when a message is sent in a text channel
bot.on('message', message => {
    // Commands are represented by a '!'
    if (message.content.charAt(0) == "!") {
        let userCommand = message.content.split("!")[1];
        let voiceChannel = message.member.voiceChannel;

        // If the user isn't in a voiceChannel, do nothing.
        if (voiceChannel != null) {
            if (userCommand == "cmere") {
                // dunno why you'd ever need this
                voiceChannel.join();
            } else if (userCommand == "gtfo") {
                voiceChannel.leave();
                isPlayingClip = false;
            } else if (userCommand == "list") {
                commandsService.outputListToChannel(message.channel);
            } else if (!isPlayingClip) { // Don't play another clip if the bot is already playing a clip
                playClip(userCommand, voiceChannel);
            }
        }        
    }
});

// Event triggered when a user changes voice state - e.g. joins/leaves a channel, mutes/unmutes, etc.
bot.on('voiceStateUpdate', (oldMember, newMember) => {
    let newUserChannel = newMember.voiceChannel;
    let oldUserChannel = oldMember.voiceChannel;

    // User joins channel. This does not handle users joining a voice
    // channel from another voice channel.
    if (oldUserChannel === undefined && newUserChannel !== undefined) {
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