import { terser as rpi_terser } from 'rollup-plugin-terser'

const is_watch = process.argv.includes('--watch')

export default [
  { plugins: [], input: 'timeids.js', output: { file: 'esm/timeids.js', format: 'es' }},
  is_watch
    ? { plugins: [ rpi_terser() ], input: 'timeids.js', output: { file: 'esm/timeids.min.js', format: 'es' }}
    : null,
  ].filter(Boolean)

