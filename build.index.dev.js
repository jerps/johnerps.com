const { execSync } = require('child_process');
const path = require('path');

try {

  exec('webpack --config webpack.config.index.js');

  exec('cp -v ' + path.resolve(__dirname, 'dist', 'index.min.js') + ' ' + path.resolve(__dirname, 'js'));

  function exec(cmd) {
    let stdout = '';
    console.log('EXEC: ' + cmd + ' . . . ')
    try {
      stdout = execSync(cmd);
    } catch (err) {
      console.log('ERROR\nSTDOUT:\n' + String(err.stdout));
      console.log('ERROR Status: ' + err.status + '\nMessage: ' + err.message);
      throw new Error('');
    }
    console.log('OK\n' + String(stdout));
  }

} catch(e) {e}
