const fs = require('fs')
const {dirname} = require('path')
const child_process = require('child_process')

function on_enoentry(path, on_absent) {
  return new Promise((resolve, reject) =>
    fs.stat(path, (err, stats) => 
      null == err ? resolve(stats)
      : 'ENOENT' === err.code ? resolve(null)
      : reject(err))
  )
  .then(stat => null === stat && on_absent
    ? on_absent(path) : stat )
}

function output_dir(path) {
  if (! path) return Promise.resolve()

  return on_enoentry(path, () =>
    output_dir(dirname(path))
    .then(() =>
      new Promise((resolve, reject) =>
        fs.mkdir(path, err => err ? reject(err) : resolve(path))))
    .then(() => console.log(`\nMade directory "${path}"`)) )
}

function output_file(path, source, show_source) {
  return output_dir(dirname(path))
    .then(() => output_file_raw(path, source))
    .then(() => {
      if (show_source) {
        console.log(`\nWrote "${path}" with:`)
        console.log(source)
        console.log()
      } else {
        console.log(`\nWrote "${path}"`)
      }
    })
}

function read_file(path, options) {
  return new Promise((resolve, reject) =>
    fs.readFile(path, options,
      (err, data) => err ? resolve() : resolve(data) ))
}

function output_file_raw(path, source) {
  const data = 
    'string' === typeof source ? source
    : Buffer.isBuffer(source) ? source
    : JSON.stringify(source, null, 2)

  return new Promise((resolve, reject) =>
    fs.writeFile(path, data,
      (err) => err ? reject(err) : resolve(source) ))
}

function shell_exec(command) {
  console.log(`\nShell exec: ${command}`)
  return new Promise((resolve, reject) =>
    child_process.spawn(command, {shell: true, stdio: 'inherit'})
    .on('close', code => code ? reject(code) : resolve())
    .on('exit', code => code ? reject(code) : resolve())
    .on('error', reject) )
}

Object.assign(exports, {
  read_file,
  on_enoentry, output_dir,
  output_file, output_file_raw,
  shell_exec,
})
