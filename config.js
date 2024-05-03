const path = require("path");
module.exports = {
  CommandKit: {
    client,
    commandsPath: path.join(__dirname, 'Commands'),
    eventsPath: path.join(__dirname, 'Events'),
    devGuildIds: ['964473061913030696'],
    devUserIds: ['922419431508938773'],
    bulkRegister: true,
  }
}