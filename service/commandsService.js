const _ = require('underscore');
var fs = require('fs');
const musicMetadata = require('music-metadata');

// Populate the list of commands when the application starts
var commandsList = [];
// Asynchronous
fs.readdir('./clips', (err, files) => {
  _.each(files, (fileWithExtension) => {
    // Asynchronous
    musicMetadata
      .parseFile('./clips/' + fileWithExtension)
      .then((metadata) => {
        commandsList.push({
          commandName: fileWithExtension.split('.')[0],
          fileName: fileWithExtension,
          description: metadata.common.comment
        });
      })
      .catch((err) => {
        console.error(err.message);
      })
      .then(() => {
        // this calls after parsing each file
        if (commandsList.length == files.length) {
          commandsList = _.sortBy(commandsList, (command) => {
            return command.commandName.toLowerCase();
          });
        }
      })
      .catch((err) => {
        console.error(err.message);
      });
  });
});

module.exports = {
  getCommandByName: function (userCommand) {
    return _.find(commandsList, (aCommand) => {
      return aCommand.commandName.toLowerCase() === userCommand.toLowerCase();
    });
  },
  outputListToChannel: function (channel) {
    var commandsMessage = 'Available soundbytes: \n[ ';
    var index = 0;

    commandsList.forEach((command) => {
      var appendToCommandsMessage = '!'.concat(command.commandName);
      if (!_.isUndefined(command.description)) {
        appendToCommandsMessage = appendToCommandsMessage.concat(
          ' - ',
          command.description
        );
      }

      if (index != commandsList.length - 1) {
        appendToCommandsMessage = appendToCommandsMessage.concat('    |    ');
      }

      if (commandsMessage.length + appendToCommandsMessage.length > 1998) {
        channel.send(commandsMessage);
        commandsMessage = appendToCommandsMessage;
      } else {
        commandsMessage = commandsMessage.concat(appendToCommandsMessage);
      }

      index++;
    });
    commandsMessage = commandsMessage.concat(' ]');

    channel.send(commandsMessage);
  }
};
