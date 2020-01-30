import rpi_resolve from '@rollup/plugin-node-resolve'

const configs = []
export default configs

const external = [
  ... require('module').builtinModules,
]
const plugins = [ rpi_resolve() ]

add('create-jsy')


function add(name) {
  configs.push({
    input: `lib/${name}.js`,
    output: [
      { file: `cjs/${name}.js`, format: 'cjs', exports:'named' },
      { file: `esm/${name}.mjs`, format: 'es' },
    ],
    plugins, external })
}

