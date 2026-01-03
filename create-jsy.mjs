#!/usr/bin/env node
import { create_from_gh } from 'create-from-gh'

function create_jsy(template_name='basic', destination) {
  const from = `qabex/jsy/${template_name || 'basic'}`
  return create_from_gh({ from, to: destination })
}

function main([template_name, destination]) {

  if (template_name && template_name.startsWith('.')) {
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
