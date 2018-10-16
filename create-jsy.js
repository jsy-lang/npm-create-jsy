#!/usr/bin/env node

const mx = require('./npm_create_utils.js')
const variantsByName = require('./src/index.js')

module.exports = exports = create_jsy.create_jsy = create_jsy
async function create_jsy(variant, package_json_filename='package.json') {
  if ('string' === typeof variant)
    variant = variantsByName[variant]
  else if (!variant)
    variant = variantsByName.basic

  if (! variant) throw new TypeError('Expected valid package init variant')

  await mx.read_file(package_json_filename, 'utf-8')
    .then(data => data ? JSON.parse(data) : null)
    .then(existing => Object.assign(existing || {}, variant.pkg_default, existing))
    .then(package_json => mx.output_file(package_json_filename, package_json))

  await (variant.initialize || initialize)(variant)
  await (variant.validate || validate)(variant)
}

async function initialize(variant) {
  const {gitignore, rollup_config, source_files} = variant

  if (gitignore) {
    await mx.output_file('.gitignore', gitignore)
    await mx.output_file('.hggitignore', 'syntax: glob\n\n'+gitignore)
  }

  if (rollup_config)
    await mx.output_file('rollup.config.js', rollup_config)

  if (source_files) {
    for (let [dst_path, src_code] of Object.entries(source_files)) {
      if ('function' === typeof src_code)
        src_code = src_code(dst_path, variant)

      await mx.output_file(dst_path, await src_code)
    }
  }

  const {npm_dependencies, npm_dev_dependencies} = variant
  if (npm_dependencies)
    await mx.shell_exec(`npm install ${npm_dependencies}`)

  if (npm_dev_dependencies)
    await mx.shell_exec(`npm install -D ${npm_dev_dependencies}`)
}

async function validate(variant) {
  await mx.shell_exec('npm run build')
  await mx.shell_exec('node ./cjs/index.js')
}

function show_help() {
  console.log()
  console.log('Create a JSY project without prompts:')
  console.log()
  console.log('   $ npm init jsy')
  console.log()
  console.log('or:')
  console.log()
  console.log('   $ npm init jsy «variant»')
  console.log()
  console.log('Variants:')
  for (const [name, module] of Object.entries(variantsByName)) {
    if (module.__doc__)
      console.log(`  * '${name}' — ${module.__doc__}`)
    else console.log(`  * '${name}'`)
  }
  console.log()
}

if (module === require.main) {
  const variant = process.argv.slice(2).pop() || 'basic'
  if ('--help' === variant || '-h' === variant || 'help' === variant) {
    show_help()
    process.exit(0)

  } else if (! variantsByName[variant]) {
    console.error(`\nUnknown JSY template variant '${variant}'\n`)
    process.exit(1)

  } else {
    create_jsy(variant, 'package.json')
      .then(() => console.log('\nDone.\n'))
      .catch(console.error)
  }
}

