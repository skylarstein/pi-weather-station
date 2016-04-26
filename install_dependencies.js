const os   = require('os');
const exec = require('child_process').exec;

if(os.type() === 'Linux') {

  const linuxPackages = ['i2c', 'onoff'];

  for(var packageName of linuxPackages) {

    var cmd = 'npm install ' + packageName;
    console.log('exec(\'' + cmd + '\')');

    exec(cmd, function(error, stdout, stderr) {
      console.log(cmd + ' stdout: ' + stdout);
      console.log(cmd + ' stderr: ' + stderr);
      console.log(cmd + ' error: ' + error);
    });
  }
}
