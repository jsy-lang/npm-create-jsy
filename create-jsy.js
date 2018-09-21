#!/usr/bin/env node

const mx = require('./npm_create_utils.js')

const pkg_default = {
  private: true,
  version: '0.0.0',
  files: [ "cjs/", "esm/", "umd/" ],
  dependencies: {},
  devDependencies: {},
  scripts: {
    "clean": "rm -rf ./cjs/* ./esm/* ./umd/*",
    "build": "rollup --config",
    "watch": "npm -s run build -- --watch",
    "pretest": "npm -s run build",
    "test": "true"
  }
}

const rollup_config = `\
import rpi_jsy from 'rollup-plugin-jsy-lite'

const configs = []
export default configs

const sourcemap = true
const plugins = [rpi_jsy()]
const external = []

// Allow Node module resolution -- https://github.com/rollup/rollup-plugin-node-resolve
/// import rpi_resolve from 'rollup-plugin-node-resolve'
/// plugins.push(rpi_resolve({main: true, browser: true, modules: true}))


add_jsy('index')


function add_jsy(name) {
  configs.push({
    input: \`code/\${name}.jsy\`,
    output: [
      { file: \`cjs/\${name}.js\`, format: 'cjs', exports:'named', sourcemap },
      { file: \`umd/\${name}.js\`, format: 'umd', name, exports:'named', sourcemap },
      { file: \`esm/\${name}.js\`, format: 'es', sourcemap },
    ],
    plugins, external })
}
`

const gitignore = `\
cjs/
esm/
umd/
dist/
node_modules/
npm-debug.log
.hggitignore
`

const code_index = `\
Promise
.resolve @ new Date
.then @ ts => ::
  console.log @
    \`Hello from JSY at \${ts.toISOString()} (generated on ${new Date().toISOString()})!\`
`


module.exports = exports = create_jsy.create_jsy = create_jsy
function create_jsy(package_json_filename='package.json') {
  return mx.read_file(package_json_filename, 'utf-8')

    .then(data => data ? JSON.parse(data) : null)

    .then(existing => Object.assign(existing || {}, pkg_default, existing))

    .then(package_json => mx.output_file(package_json_filename, package_json))

    .then(() => mx.output_file('.gitignore', gitignore))
    .then(() => mx.output_file('.hggitignore', 'syntax: glob\n\n'+gitignore))

    .then(() => mx.output_file('rollup.config.js', rollup_config))

    .then(() => mx.output_file('code/index.jsy', code_index))

    .then(() => mx.shell_exec('npm install -D rollup rollup-plugin-jsy-lite jsy-transpile'))

    .then(() => mx.shell_exec('npm run build'))

    .then(() => mx.shell_exec('node ./cjs/index.js'))
}


if (module === require.main) {
  create_jsy('package.json')
    .then(() => console.log('\nDone.\n'))
    .catch(console.error)
}

