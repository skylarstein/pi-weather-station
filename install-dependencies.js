"use strict";
/*
  install-dependencies.js

  We have some hardware-dependent npm modules for device access on the Raspberry Pi that
  do not compile on all platforms. This script is called during the 'npm install' process
  and will only install the package.json 'linuxDependencies' modules on the target platform.
  Yes, I'm laying on a bit of anti-pattern on here since failures are not bubbled up.
*/

const path        = require('path');
const deviceUtils = require(path.join(__dirname, './devices/device-utils.js'));
const packageJson = require(path.join(__dirname, 'package.json'));
const execSync    = require('child_process').execSync;
const colors      = require('colors/safe');

if(deviceUtils.isRaspberryPi() && packageJson.linuxDependencies) {

  for(let pkg of Object.keys(packageJson.linuxDependencies)) {

    let cmd = 'npm install ' + pkg + '@' + packageJson.linuxDependencies[pkg];
    console.log(colors.cyan.bold('exec(\'' + cmd + '\')'));

    let result = execSync(cmd, { encoding: 'utf8' });

    console.log(colors.black.bgYellow(cmd));
    console.log(result);
  }
}
