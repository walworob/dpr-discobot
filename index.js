const Discord = require("discord.js");
const bot = new Discord.Client();

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
    http.get('http://drp-discobot.herokuapp.com');
}, 900000);

bot.on('message', message => {
    if (message.content == "!test") {
        var voiceChannel = message.member.voiceChannel;
        voiceChannel.join().then(connection => {
            dispatcher = connection.playFile('./clips/BEAST_MODE.wav');
            dispatcher.on("end", end => {
                voiceChannel.leave();
            });               
        }).catch(err => console.log(err));
    }     
});

bot.login('NTMyNDM1Mjk5MDM3MzQ3ODQw.Dxccpg.n-OgT2Lx-f3zLxBKxuzKtsqfClQ');

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