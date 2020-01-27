const __doc__ = `JSY & Rollup basic config`

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
const external = []
const plugins = [rpi_jsy()]

// Allow Node module resolution -- https://github.com/rollup/plugins/tree/master/packages/node-resolve#readme
/// import rpi_resolve from '@rollup/plugin-node-resolve'
/// plugins.push(rpi_resolve())


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

const npm_dependencies = null
const npm_dev_dependencies = 'rollup rollup-plugin-jsy-lite'

Object.assign(exports, {
  __doc__,
  pkg_default, rollup_config, gitignore,
  source_files: {
    'code/index.jsy': code_index,
  },
  npm_dependencies,
  npm_dev_dependencies,
})
