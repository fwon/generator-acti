'use strict';

var path = require('path');
var chalk = require('chalk');
var generators = require('yeoman-generator');
var yosay = require('yosay');

console.log(generators.Base);

var ActiPackage = generators.Base.extend({
    info: function() {
        this.log(chalk.green('building app...'));
    },
    writing: function() {
        this.fs.copy(
            this.sourceRoot(),
            this.destinationRoot(),
            {title: 'copy template'}
        );
    },
    // install: function() {
    //     this.installDependencies({
    //         skipInstall: this.options['skip-install']
    //     });
    // },
    end: function() {
        this.log(yosay('app created successfully!'));
    }
});

module.exports = ActiPackage;