const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const nconf = require('nconf');
const console = require('console');

nconf.argv().env({
  lowerCase: true,
  separator: '__',
});

const profile = nconf.get('profile') || 'development';
const configFile = nconf.get('configFile') || path.join(__dirname, './app.yml');
const configContents = yaml.load(fs.readFileSync(configFile));

if (!(profile in configContents)) {
  // не найден конфиг для указанного профиля
  console.error('В файле %s не найдена конфигурация для указанного профиля (%s)', configFile, profile);
  process.exit(1);
}

// добавляем настройки из указанного профиля в указанном конфигурационном
// файле
nconf.add('file', { type: 'literal', store: configContents[profile], });

nconf.defaults({
  client: {
    use_logging: false,
    logging_url: './',
  },
  inject_polyfills: true,
  use_hash_in_js_filenames: true,
  public_path: '/',
  use_hot_reload: false,
  minimize_js: false,
  use_hash_in_static_filenames: true,
  debug_reactjs: false,
  generate_compressed_files: false,
  webpack_devtool: null,
  enable_dedup: false,
});

module.exports = nconf;
