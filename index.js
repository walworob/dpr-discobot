const { Client, Intents, Guild } = require('discord.js');
const {
  createAudioPlayer,
  createAudioResource,
  entersState,
  getVoiceConnection,
  joinVoiceChannel,
  AudioPlayerStatus,
  StreamType,
  VoiceConnectionStatus
} = require('@discordjs/voice');

// Create the bot
const bot = new Client({
  intents: [
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_VOICE_STATES
  ]
});

// Create the audio player
const audioPlayer = createAudioPlayer();

const express = require('express');
const _ = require('underscore');
const http = require('http');
const app = express();

var commandsService = require('./service/commandsService');
var latestLogs = process.env.LATEST_LOGS_URL;

// set the port of our application
// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 5000;

app.listen(port, () => {
  // will echo 'Our app is running on http://localhost:5000 when run locally'
  console.log('Our app is running on http://localhost:' + port);
});

// pings server every 15 minutes to prevent dynos from sleeping
setInterval(() => {
  http.get('http://drp-discobot.herokuapp.com');
}, 900000);

// User to prevent commands from interrupting other commands
var introsEnabled = true;
var channel;

bot.once('ready', () => {
  console.log('Ready!');
});

// Event triggered when the audio player goes idle (i.e. not playing anything)
audioPlayer.on(AudioPlayerStatus.Idle, () => {
  const connection = getVoiceConnection(channel.guild.id);
  connection.destroy();
});

// Event triggered when there is an error with the audio player
audioPlayer.on('error', (error) => {
  console.error(
    'Error:',
    error.message,
    'with track',
    error.resource.metadata.title
  );
});

// Event triggered when a message is sent in a text channel
bot.on('messageCreate', async (message) => {
  // Commands are represented by a '!'
  if (message.content.charAt(0) == '!') {
    await handleCommand(message);
  }
  // Queries are represented by a "?"
  else if (message.content.charAt(0) == '?') {
    handleQuery(message);
  }
});

// Event triggered when a user changes voice state - e.g. joins/leaves a channel, mutes/unmutes, etc.
bot.on('voiceStateUpdate', async (oldState, newState) => {
  // Grab the new channel the user joined
  channel = newState.channel;

  // User joins channel. This does not handle users joining a voice
  // channel from another voice channel.
  if (
    introsEnabled &&
    oldState.channel === null &&
    channel !== null &&
    audioPlayer.state.status === AudioPlayerStatus.Idle
  ) {
    // Grab the username of the user who joined
    const username = newState.member.user.tag;

    // Play a clip based on the username
    if (username == 'kyhole#3631') {
      playClip('shutUpKyle.mp3');
    } else if (username == 'robborg#4693') {
      playClip('RobbieHasArrived.mp3');
    } else if (username == 'Jenkinz94#4030') {
      playClip('NickHasArrived.mp3');
    } else if (username == 'mr.barron#9498') {
      playClip('AlexHasArrived.mp3');
    } else if (username == 'Snapps#5034') {
      playClip('SAMMMMM.mp3');
    } else if (username === 'bryborg#3434') {
      playClip('thebryansong.mp3');
    } else if (username === 'Dru#7852') {
      playClip('Dr_Dru.mp3');
    }
  }
});

var discordKey = process.env.DISCORD_KEY;
bot.login(discordKey);

async function playClip(clipName) {
  // Connect the bot to the channel
  const connection = await connectToChannel(channel);

  // Subscribe to the audio player
  connection.subscribe(audioPlayer);

  // Create the audio resource
  const resource = createAudioResource('./clips/' + clipName, {
    inputType: StreamType.Arbitrary
  });

  // Play the clip
  audioPlayer.play(resource);

  // Return when the audio player signals it's playing
  return entersState(audioPlayer, AudioPlayerStatus.Playing);
}

async function connectToChannel(channel) {
  // Create the connection to the voice channel
  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator
  });

  // Return when the voice connection is ready, or destroy it if
  // it never gets to that state
  try {
    await entersState(connection, VoiceConnectionStatus.Ready);
    return connection;
  } catch (error) {
    connection.destroy();
    console.error('Error:', error.message);
  }
}

function isManlyDanly(textToCheck) {
  var isManlyDanly = true;
  _.every(textToCheck, function (char, index) {
    if (
      !(
        (index % 3 == 0 && (char == 'm' || char == 'd')) ||
        (index % 3 == 1 && char == 'a') ||
        (index % 3 == 2 && char == 'n')
      )
    ) {
      isManlyDanly = false;
      return false; // (_.every's version of break)
    }
  });
  return isManlyDanly;
}

function handleQuery(message) {
  let userQuery = message.content.split('?')[1].toLowerCase();
  if (isManlyDanly(userQuery)) {
    var manualMessage =
      '---------------------------------------------------------------------\n' +
      '| :sailboat: Dread Pirate Roberts Custom Discord Bot Manual :sailboat: |\n' +
      '---------------------------------------------------------------------\n' +
      '\n' +
      'QUERIES:\n' +
      '------------\n' +
      "?man - Outputs the DPR Discord Bot Manual (NOTE: This also works with any combination of 'man's and 'dan's)\n" +
      '?list - Outputs the list of sound byte commands\n' +
      '?logs - Outputs the WarcraftLogs from the most recent raid (Assuming we actually remembered to update it!)\n' +
      '\n' +
      'COMMANDS:\n' +
      '-----------------\n' +
      '!cmere - Force the bot to join your voice channel...for whatever reason\n' +
      '!gtfo - Gets the bot the fuck out of your voice channel, in case someone plays !beastmode\n' +
      '!toggleIntros - Toggles ON/OFF intro themes when people join a voice channel';

    message.channel.send(manualMessage);
  } else if (userQuery === 'list') {
    commandsService.outputListToChannel(message.channel);
  } else if (userQuery === 'logs') {
    // TODO -   this is manual so far. We'll need to manually update an environment variable
    //          each time we raid. It'd be better to hook up to a simple database so we can push logs to it
    //          directly from discord commands
    //          https://elements.heroku.com/addons/mongolab
    message.channel.send("Here's a link to the latest logs: " + latestLogs);
  } else {
    message.channel.send('Invalid query. Try typing ?man for options!');
  }
}

async function handleCommand(message) {
  const userCommand = message.content.split('!')[1].toLowerCase();
  channel = message.member?.voice.channel;

  if (channel) {
    if (userCommand == 'cmere') {
      const connection = await connectToChannel(channel);
      connection.subscribe(audioPlayer);
    } else if (userCommand == 'gtfo') {
      // Stop the audio player if it's playing. This will cause the bot
      // to disconnect from the voice channel as well
      if (audioPlayer.state.status == AudioPlayerStatus.Playing) {
        audioPlayer.stop(true);

        // Return when the audio player signals it's idle
        return entersState(audioPlayer, AudioPlayerStatus.Idle);
      } else {
        // If not playing anything, simply disconnect from the voice channel
        const connection = getVoiceConnection(channel.guild.id);
        connection.destroy();
      }
    } else if (userCommand == 'list') {
      message.channel.send(
        "WARNING: !list is deprecated. Please start using the '?' operator for queries! (e.g. '?list')"
      );
      commandsService.outputListToChannel(message.channel);
    } else if (userCommand == 'toggleintros') {
      const toggleMessage = 'Toggling intro sounds: ';
      const onOrOff = introsEnabled ? 'OFF' : 'ON';
      message.channel.send(toggleMessage + onOrOff);
      introsEnabled = !introsEnabled;
    } else {
      // Grab the command from commandsService
      const command = commandsService.getCommandByName(userCommand);

      // Determine if the command is valid
      if (command !== undefined) {
        // Play the commanded clip if the audio player is ready
        if (audioPlayer.state.status === AudioPlayerStatus.Idle) {
          const connection = await connectToChannel(channel);
          connection.subscribe(audioPlayer);
          playClip(command.fileName);
        }
      } else {
        message.channel.send('Invalid command. Try typing ?man for options!');
      }
    }
  }
}
