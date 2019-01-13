const Discord = require("discord.js");
const bot = new Discord.Client();

const express = require('express');
const _ = require("underscore");
const app = express();

// const sys = require('sys');
// const exec = require('child_process').exec;

// exec("pwd", function(error, stdout, stderr) {
//     sys.print('stdout: ' + stdout);
//     sys.print('stderr: ' + stderr);
//     if (error !== null) {
//         console.log('exec error: ' + error);
//     }
// });

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

var populateCommandsList = function() {
    var files = fs.readdirSync('./clips')
    return _.chain(files)
        .map(fileWithExtension => { return fileWithExtension.split(".")[0]; }) // remove extension
        .sortBy(fileNameOnly => { return fileNameOnly.toLowerCase(); }) // sort by lowercase
        .value();
};

var commands = {
    // TODO - it would be useful if this ended up as a list of objects like below. That would help clean up the code that plays files
    // {
    //      command: "beastMode"
    //      fileName: "beastMode.wav"
    // }
    list: [], // e.g: [beastMode, 4ThumbsDown]
    output: function(message) {
        var commandsMessage = "Available soundbytes: [";
        var index = 0;
        this.list.forEach(command => {
            commandsMessage = commandsMessage.concat("!").concat(command);

            if (index != this.list.length - 1) {
                commandsMessage = commandsMessage.concat(", ");
            }
            index++;
        });
        commandsMessage = commandsMessage.concat("]");
        message.channel.send(commandsMessage);
    },
    populate: function() {
        this.list = populateCommandsList();
    }
}
commands.populate();

// User to prevent commands from interrupting other commands
var isPlayingClip = false;

// Event triggered when a message is sent in a text channel
bot.on('message', message => {

    // Commands are represented by a '!'
    if (message.content.charAt(0) == "!") {
        var command = message.content.split("!")[1];
        let voiceChannel = message.member.voiceChannel;

        // If the user isn't in a voiceChannel, do nothing.
        if (voiceChannel != null)
        {
            if (command == "cmere") {
                voiceChannel.join();
            } else if (command == "gtfo") {
                voiceChannel.leave();
                isPlayingClip = false;
            } else if (command == "list") {
                commands.output(message);
            } else if (!isPlayingClip) { // Don't play another clip if the bot is already playing a clip
                fs.readdir('./clips', function(err, files) {
                    files.forEach(function(file, index) {
                        var fileName = file.split(".")[0];
                        if (fileName == command) {
                            isPlayingClip = true;
                            voiceChannel.join().then(connection => {
                                var dispatcher = connection.playFile('./clips/' + file);
                                dispatcher.on("end", end => {
                                    voiceChannel.leave();
                                    isPlayingClip = false;
                                });
                            }).catch(err => message.reply(err.toString()));
                        }
                    });
                });
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
        var username = newMember.user.username + newMember.user.tag;
        console.log(username);
        //newMember.sendMessage(newMember.user.toString());

        // TODO:    Get everyone's username so these can be replaced with newMember.user
        //          instead of newMember.nickname. This makes it so that the bot functions
        //          consistently incase someone changes their nickname.
        // TODO:    Do we want people entering the channel to have their intro songs
        //          interrupt the bot if the bot is already playing a clip? Or just not
        //          play the intro? It is now currently setup so that the bot will not
        //          interrupt.
        if (newMember.nickname == "ManKyledandan" && !isPlayingClip) {
            isPlayingClip = true;
            voiceChannel.join().then(connection => {
                var dispatcher = connection.playFile('./clips/KyleChannelIntro.wav');
                dispatcher.on("end", end => {
                    voiceChannel.leave();
                    isPlayingClip = false;
                });
            }).catch(err => console.log(err.toString()));
        }
        else if (newMember.nickname == "Rectumis" && !isPlayingClip) {
            isPlayingClip = true;
            voiceChannel.join().then(connection => {
                var dispatcher = connection.playFile('./clips/RobbieHasArrived.mp3');
                dispatcher.on("end", end => {
                    voiceChannel.leave();
                    isPlayingClip = false;
                });
            }).catch(err => console.log(err.toString()));
        }
        else if (newMember.nickname == "xKoolaidKam (Nick)" && !isPlayingClip) {
            isPlayingClip = true;
            voiceChannel.join().then(connection => {
                var dispatcher = connection.playFile('./clips/NickHasArrived.mp3');
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

bot.login('NTMyNDM1Mjk5MDM3MzQ3ODQw.Dxccpg.n-OgT2Lx-f3zLxBKxuzKtsqfClQ');

// TODO:    Read the apiKey from a file on the server. Maybe something like this???
//          Is this even a secure way to do it? Probably not...
//var apiKey = fs.readFileSync.toString('key.txt').toString().split("\n")[0];
//bot.login(apiKey);








/*var CommandListString = "";
const Discord = require("discord.js");
const bot = new Discord.Client();
var isReady = true;
var dispatcher;
var commandList = [".chokeme", ".leeroy",".swindled", ".trumpet", ".gotcha", ".pot", ".fuck", ".smd", ".chicken", ".shingus", ".fart", 
".hey", ".whatwant", ".motherfucker", ".rocket", ".bowser", ".buzz", ".fuark", ".bazinga", ".yes", ".jeb", ".alex", ".yall" , ".skyrim", 
".no", ".littleman", ".wife", ".mike", ".wall", ".auye", ".weedlaweed", ".mom", ".booboo", ".gator", ".scream1", ".scream2", ".advil",
".jurassic", ".downsmash", ".rolling", ".dad", ".porkchop", ".man", ".gravy", ".brave", ".bullets", ".butterfinger", ".yabadaba",".bedtime",
".911", ".jurassic2",".goddamn", ".trombone",".nerf", ".pants", ".iwantyou", ".movie", ".impressive", ".jenny", ".class", ".alright", ".coffeepot",
".donaldthebitch", ".innocence1",".innocence2", ".yish",".spiderman",".toad",".win",".turtles",".yay",".mountaindew", ".3am",".king",".bruno",
".cream",".tanaka",".outo",".sorbo", ".nochris", ".black",".gamers",".force",".clap",".baba",".baba2",".fuRandy",
".lick",".tomwhats",".tommyg",".nungent",".ow",".quiet1",".quiet2", ".quiet3", ".quiet4",".fate",".ten",".leo",".basic", ".sad", ".sad2",
".150k",".babypark",".boom",".donkey",".drwahwee",".hey2",".longbowser",".thisisbowser",".megaman",".thps",".void",".metalgear", ".roger", ".foundshit",
".youneedme",".brainblast",".doubtfire", ".baseball",".doot",".squab",".sweetpotato",".lobster",".andre",".xp",".news", 
".lanky", ".wallah", ".wallah2",".gong",".yooo",".slob",".bounce",".shoshon",".scat",".nerf2",".jr",".husband",".ahhh",".heyy",".applejuice",
".christ",".profanity",".man",".love",".horizon",".game",".busrider", ".ya", ".jazz",".burrito",".lose",".corn",".neked",
".trap",".nicenut",".stevens",".freeman",".swapping",".heytetris",".ohboy",".dothis",".trythis",".sleep",".exercise",".healthy",".vitamins",
".america", ".stars1", ".stars2", ".washington", ".usa", ".partyusa", ".taps", ".pledge", ".lugia",".daytona",".godbless",".thisisamerica",".wereworking1",".wereworking2",".yostacey",".god",
".arms",".clownin",".cornchowder",".cunnplease",".eatinass",".gruntparty",".joejuba",".justgo",".lowvolume",".ponyboy",".slimer",".snakeeater",".expecto",".ohno",".fuckme",
".powergame",".slobu",".bootup",".bootup2", ".laurel",".realtalk",".fuckme",".binjo", ".skyrim1", ".skyrim2", ".allen",".realestate",".scotty", ".econ",
".shoots",".lettuce",".nicehorse", ".skills",".chinese",".snake",".bubblebee",".score",".muslims",".dirtydog",".dirtydog2",".partyhorn",".hbd",
".musicbox",".seinfeld",".savage",".bleed",".fightsong",".curb",".corn2",".fuckyou",".woo",".triple",".cowpokez", ".ff", ".ohfuckme", ".nigger",
".fake",".waterlevel",".uwaa",".beef",".beef2",".himawari",".cumming",".cumming2",".alwayshorny",".fightmoney", ".rosh",".sega",".alone",
".steal",".heysara",".snore",".mackle",".chickenfried",".countdown",".countdown2",".rehe", ".oreilly",".isyouis",".cenese",".chilisauce", 
".justice", ".justice2", ".justice3", ".justice4", ".betrayal", ".betrayed", ".slayer", ".swat", ".boo", ".downtown", ".downtown2", ".downtown3", 
".horseman", ".horseman2", ".luigi", ".luigi2", ".luigi3", ".spooky", ".spooky2", ".thankskilling", 
".monstermash",".psycho",".alert",".alert2",".halloween",".residentevil",".humiliation",".holyshit",".playagame",".redrobin",".naruto", ".plusultra",
".myhero", ".gunmorphing", ".wrex", ".shepard", ".humo", ".servbot", ".pianta",".overflow",".nerfbastion",".fightingfor",".speakersdown",".speakersdown2",
".hacker",".sixfigures", ".dragonforce",".laugh",".dontbelieve",".limbo",".poopit",".drdude",".fortnite",".fortnite2",".fortnite3",
".september", ".pasta", ".world",".pheenis",".judge",".obama",".appreciates",".sugarcereals",".dad",".jerkin",".smartalecks",".jared",
".thankyou3d", ".faith", ".pizza", ".pizzatime"];

const unsortedCommandList = commandList.slice(0);
commandList.sort();

const secretList = ['.nigger', '.heyy'];
const naughtyList = ['.bowser', '.gravy', '.brave', '.rocket', '.alright','.nerf','.heyy','.ahhh',".speakersdown"];

const express = require('express');
const app = express();

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
    http.get('http://chokeme.herokuapp.com');
  }, 900000);

bot.on('message', (message) => {
    if (message.content == "!commands"){
        isReady = false;
        CommandListString1 = "";
        CommandListString2 = "";
        message.channel.sendMessage("List of commands:");
        for (var i = 0, len = unsortedCommandList.length / 2; i < len; i++){
            if (secretList.indexOf(unsortedCommandList[i]) == -1){
                CommandListString1 += unsortedCommandList[i] + ", ";
            }
        }
        //for (var i = unsortedCommandList.length / 2, len = unsortedCommandList.length; i < len; i++){ //Old code that's no good
        //    CommandListString2 += unsortedCommandList[i] + ", ";
        //}
        const grickArray = unsortedCommandList.slice((unsortedCommandList.length/2) + 1);
        for (var i = 0, len = grickArray.length; i < len; i++){
            if (secretList.indexOf(grickArray[i]) == -1){
                CommandListString2 += grickArray[i] + ", ";
            }
        }
        message.channel.sendMessage(CommandListString1);
        message.channel.sendMessage(CommandListString2);
        isReady = true;
    }    
    else if(message.content == "!commandsSort"){  //list the commands alphabetized
        isReady = false;
        CommandListString1 = "";
        CommandListString2 = "";
        message.channel.sendMessage("List of commands:");
        for (var i = 0, len = commandList.length / 2; i < len; i++){
            if (secretList.indexOf(commandList[i]) == -1){
                CommandListString1 += commandList[i] + ", ";
            }
        }
        //for (var i = commandList.length / 2, len = commandList.length; i < len; i++){ //Old Code that's no good
        //    CommandListString2 += commandList[i] + ", ";
        //}
        const grickArray = commandList.slice((commandList.length/2) + 1);
        for (var i = 0, len = grickArray.length; i < len; i++){
            if (secretList.indexOf(grickArray[i]) == -1){
                CommandListString2 += grickArray[i] + ", ";
            }
        }
        message.channel.sendMessage(CommandListString1);
        message.channel.sendMessage(CommandListString2);
        isReady = true;
    }
    else if (message.content == "!test"){ //Used for testing shite. Can be removed
        isReady = false;
        CommandListString2 = "";
        message.channel.sendMessage("Here it comes");
        const grickArray = unsortedCommandList.slice((unsortedCommandList.length/2) + 1);
        for (var i = 0, len = grickArray.length; i < len; i++){
            CommandListString2 += grickArray[i] + ", ";
        }
        message.channel.sendMessage(CommandListString2);
        isReady = true;
    }
    else if (message.content == "."){
       dispatcher.end();
    }
    else if ((naughtyList.indexOf(message.content) != -1 ) && (message.member.voiceChannel.parent.name == "🔴 Be Nice We Streaming 🗣")){
            //do nothing because we're nice boys when we stream
    }
    else if((isReady) && (message.member.voiceChannel != null) && (commandList.indexOf(message.content) != -1 )) {
        isReady = false;
        var voiceChannel = message.member.voiceChannel;
        voiceChannel.join().then(connection => {
            var strippedName = message.content.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
            dispatcher = connection.playFile('./clips/' + strippedName + '.wav');
            dispatcher.on("end", end => {
                voiceChannel.leave();
                isReady = true;
            });               
        }).catch(err => console.log(err));  
           
    }
});

bot.login('MzU5Mzg2MDE4NjczMDY1OTk1.DY3zWg.XVJ_iK77AJEvVBih-v6X1FFM5a8');
*/
