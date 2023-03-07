const chalk = require('chalk');
if(process.env.lul !== 'hehe') {
  console.log(chalk.red('[ Repl ] Fork Detected...'));
  process.exit();
}

console.log(chalk.yellow('Boot '+ chalk.cyan('Nodemon') + '     [ ' + chalk.red(1) + chalk.yellow(' ]')));
console.log(chalk.yellow('Boot ' + chalk.cyan('Node ') + '       [ '+ chalk.red(2) + chalk.yellow(' ]')));

console.log(chalk.blue('\n[ Select ] \n'));
