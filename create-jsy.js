#!/usr/bin/env node
const {create_jsy} = require('./cjs/create-jsy.js')

function main([template_name, destination]) {
  if (template_name.startsWith('.')) {
    destination = template_name
    template_name = null
  }

  return create_jsy(template_name, destination)
    .catch(err => {
      console.log(err.message)
      process.exit(1)
    })
}

main(process.argv.slice(2))
