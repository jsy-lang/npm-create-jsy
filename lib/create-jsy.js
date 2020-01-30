import { create_from_gh } from 'create-from-gh'

export function create_jsy(template_name='basic', destination) {
  const from = `qabex/jsy/${template_name || 'basic'}`
  return create_from_gh({ from, to: destination })
}

