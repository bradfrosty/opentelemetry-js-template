const fse = require('fs-extra');

if (fse.existsSync('./dist')) {
  fse.rmSync('./dist', { recursive: true });
}
fse.copySync('./public', './dist');
