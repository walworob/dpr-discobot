const _ = require("underscore");
var fs = require('fs');
const musicMetadata = require('music-metadata');

var populateCommandsList = function() {
    var files = fs.readdirSync('./clips')


    return _.chain(files)
        .map(fileWithExtension => {
            return {
                commandName: fileWithExtension.split(".")[0],
                fileName: fileWithExtension
            };
        }).sortBy(fileObject => { return fileObject.commandName.toLowerCase(); }) // sort by lowercase
        .value();
};

// This should function as a private variable. Nothing outside of commandsService should deal with this commands object
// Clients of commandService should instead call methods defined in the module.exports at the bottom1
var commands = {
    list: [], // e.g: [beastMode, 4ThumbsDown]
    output: function(channel) {
        var commandsMessage = "Available soundbytes: [";
        var index = 0;
        this.list.forEach(command => {
            commandsMessage = commandsMessage.concat("!").concat(command.commandName);

            if (index != this.list.length - 1) {
                commandsMessage = commandsMessage.concat(", ");
            }
            index++;
        });
        commandsMessage = commandsMessage.concat("]");
        channel.send(commandsMessage);
    },
    populate: function() {
        this.list = populateCommandsList();
    }
}
commands.populate();

module.exports = {
    getCommandByName: function(userCommand) {
        return _.find(commands.list, aCommand => {
            return aCommand.commandName.toLowerCase() === userCommand.toLowerCase();
        });
    },
    outputListToChannel: function(channel) {
        commands.output(channel);
    },
    getMetaData: function() {
        musicMetadata.parseFile('./clips/10.mp3').then( metadata => {
            console.log(JSON.stringify(metadata.description));
            // console.log(util.inspect(metadata, {showHidden: false, depth: null}));
        }).catch( err => {
            console.error(err.message);
        });;
    }
}