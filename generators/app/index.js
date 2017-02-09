'use strict';

var path = require('path');
var chalk = require('chalk');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var path = require('path');

var ActiPackage = yeoman.Base.extend({
    info: function() {
        this.log(chalk.green('building app...'));
    },
    generateBasic: function() {
        this.directory('dev', 'dev');
    },
    generateClient: function() {
        this.sourceRoot(path.join(__dirname, 'templates'));
        this.destinationPath('./');
    },
    install: function() {
        this.installDependencies({
            skipInstall: this.options['skip-install']
        });
    },
    end: function() {
        this.log(yosay('app created successfully!'));
    }
});

module.exports = ActiPackage;