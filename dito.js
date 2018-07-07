#!/usr/bin/env node

/**
 * Module dependencies.
 */
var fs = require('fs');
var ncp = require('ncp');
var program = require('commander');
/*
var sys = require('sys');
*/
var exec = require('child_process').exec;

// Vars
var cli_dir = __dirname;
console.log('cli_dir: ' + cli_dir);
var current_working_dir = process.cwd();
console.log('current_working_dir: ' + current_working_dir);

// Args
program
    .version('0.1.0')
    .option('-l, --license', 'Add License');
// .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
// .option('-T, --no-tests', 'ignore test hook');

// commands
// program
//     .command('setup [env]')
//     .description('run setup commands for all envs')
//     .option("-s, --setup_mode [mode]", "Which setup mode to use")
//     .action(function(env, options){
//         var mode = options.setup_mode || "normal";
//         env = env || 'all';
//         console.log('setup for %s env(s) with %s mode', env, mode);
//     });
//
// program
//     .command('exec <cmd>')
//     .alias('ex')
//     .description('execute the given remote cmd')
//     .option("-e, --exec_mode <mode>", "Which exec mode to use")
//     .action(function(cmd, options){
//         console.log('exec "%s" using %s mode', cmd, options.exec_mode);
//     }).on('--help', function() {
//     console.log('  Examples:');
//     console.log();
//     console.log('    $ deploy exec sequential');
//     console.log('    $ deploy exec async');
//     console.log();
// });

function cp(source_dir, target_dir) {
    fs.createReadStream(source_dir)
        .pipe(fs.createWriteStream(target_dir))
}


function clean(current_workdir, filename) {
    console.log('find . -name "' + filename + '" -exec rm -f {} \\;');
    exec('cd ' + current_workdir + ' && find . -name "' + filename + '" -exec rm -f {} \\;')
}

program
    .command('*')
    .action(function (env) {
        console.log('deploying "%s"', env);
        switch (env) {
            case 'license':
                (function () {
                    console.log('Generate license');
                    cp(cli_dir + '/LICENSE', current_working_dir + '/LICENSE')
                })();
                break;

            case 'upgrade':
                (function () {
                    // pull latest commit
                    // install dependencies
                    exec(cli_dir + "/scripts/02_upgrade.sh " + cli_dir, function (error, stdout, stderr) {
                        if (error) {
                            throw error
                        }
                        console.log(stdout);
                        console.error(stderr);
                    });
                })();
                break;
            case 'ignore':
                (function () {
                    console.log('Generate Ignore files');
                    // accept input to be append to the .*ignore file
                    cp(cli_dir + '/src/.gitignore', current_working_dir + '/.gitignore');
                    cp(cli_dir + '/src/.dockerignore', current_working_dir + '/.dockerignore');
                })();
                break;


            case 'github':
                (function () {
                    console.log('Generate Github issue template');
                    // accept input to be append to the .*ignore file
                    console.info('Source Dir ' + cli_dir + '/src/.github');
                    console.info('Destin Dir ' + current_working_dir + '/.github');

                    ncp(cli_dir + '/src/.github', current_working_dir + '/.github');
                })();
                break;

            case 'circle':
                (function(){
                    console.log('Generate Circle config template');
                    ncp(cli_dir + '/src/.circleci', current_working_dir + '/.cirlceci');
                })();
                break;

            case 'make':
                (function () {
                    console.log('Generate Makefile template');
                    cp(cli_dir + '/src/Makefile', current_working_dir + '/Makefile');
                })();

            case 'TODO':
                // TODO: bootstrap file templates here
                break;

            case 'cleanpyc':
                (function () {
                    console.log('Clean pyc: ' + current_working_dir);

                    clean(current_working_dir, '*.pyc')

                })();
                break
        }
    });

program.parse(process.argv);

console.info('.bye');