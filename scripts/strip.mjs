#!/usr/bin/env node
/**
 * strip.mjs — derive the `guided` and `start` branches from the `solution` source.
 *
 * The solution is the only version anyone hand-writes. The other two are generated,
 * so they can never silently drift out of sync with it.
 *
 * Markers, all written as ordinary comments inside the solution:
 *
 *   // #region solution
 *   ...the real implementation...
 *   // #endregion
 *
 *   // #placeholder throw new Error('Not implemented')
 *      Optional. Overrides what replaces the region. Must sit directly above `#region`.
 *      Several in a row stand for several lines, in order: that is how a stage whose `start`
 *      is a different working version, not a stub, says what the version looks like. One
 *      space separates the marker from the line; any more are the line's own indentation.
 *      A bare `// #placeholder` stands for nothing, so a region can vanish from both.
 *
 *   // #hint 1 Keep the timer id outside the returned function.
 *      Kept (as `// TODO 1:`) in `guided`, removed in `start`.
 *
 *   // #note anything the student should read in every version
 *      Kept everywhere. Use for the brief, never for the answer.
 *
 * Between JSX children a `//` comment renders as text, so every marker also works as a JSX
 * comment on a line of its own — see `markerOf` below.
 *
 * Scope: only the current stage's own files are stripped. Work the student already did in an
 * earlier stage stays solved — `stage.config.json` on the branch says which paths are in scope.
 *
 *   { "stage": "module-5/autocomplete", "strip": ["src/components/autocomplete"] }
 *
 * Usage: node scripts/strip.mjs --mode guided|start [--dir <path>] [--dry]
 */

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, extname } from 'node:path'

const args = process.argv.slice(2)
const getArg = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? fallback : args[i + 1]
}

const mode = getArg('mode')
const dryRun = args.includes('--dry')

const readStageConfig = async () => {
  if (!existsSync('stage.config.json')) return null
  return JSON.parse(await readFile('stage.config.json', 'utf8'))
}

const stageConfig = await readStageConfig()
const explicitDir = getArg('dir')
const roots = explicitDir
  ? [explicitDir]
  : (stageConfig?.strip ?? ['src'])

if (!explicitDir && !stageConfig) {
  console.warn('strip.mjs: no stage.config.json found — falling back to the whole of src/')
}

if (mode !== 'guided' && mode !== 'start') {
  console.error('strip.mjs: --mode must be "guided" or "start"')
  process.exit(1)
}

const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.css'])
const DEFAULT_PLACEHOLDER = "throw new Error('Not implemented')"

/** Files whose content must be identical in all three branches. */
const isProtected = (path) => /\.test\.(ts|tsx|js|jsx)$/.test(path) || path.includes('/fixtures/')

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue
      yield* walk(path)
    } else if (SOURCE_EXTENSIONS.has(extname(entry.name))) {
      yield path
    }
  }
}

const indentOf = (line) => line.slice(0, line.length - line.trimStart().length)

// A marker is a comment on a line of its own: `// #region solution` in code, or the same
// marker as a JSX comment between JSX children, where a `//` line would render as text:
//
//   {/* #placeholder <SearchBox onSearch={setQuery} /> */}
//   {/* #region solution */}
//   <SearchableListings />
//   {/* #endregion */}
//
// A `#hint` or `#note` written as a JSX comment stays a JSX comment in `guided`.
const markerOf = (trimmed) => {
  const line = trimmed.match(/^\/\/\s*(#.*)$/)
  if (line) return { text: line[1], jsx: false }
  const jsx = trimmed.match(/^\{\/\*\s*(#.*?)\s*\*\/\}$/)
  if (jsx) return { text: jsx[1], jsx: true }
  return null
}

const commentLine = (text, jsx) => (jsx ? `{/* ${text} */}` : `// ${text}`)

function transform(source, mode) {
  const lines = source.split('\n')
  const output = []
  let pendingPlaceholder = []
  let inRegion = false
  let changed = false

  for (const line of lines) {
    const marker = markerOf(line.trim())
    const text = marker?.text ?? ''

    if (inRegion) {
      if (marker && /^#endregion\b/.test(text)) inRegion = false
      continue // drop everything inside the region, including the markers
    }

    const placeholderMatch = marker && text.match(/^#placeholder(?:\s(.*))?$/)
    if (placeholderMatch) {
      pendingPlaceholder.push(placeholderMatch[1]?.trimEnd() ?? null)
      continue
    }

    if (marker && /^#region\s+solution\b/.test(text)) {
      inRegion = true
      changed = true
      const standIns = pendingPlaceholder.length ? pendingPlaceholder : [DEFAULT_PLACEHOLDER]
      for (const standIn of standIns) {
        if (standIn !== null) output.push(`${indentOf(line)}${standIn}`)
      }
      pendingPlaceholder = []
      continue
    }

    const hintMatch = marker && text.match(/^#hint\s+(\d+)\s+(.*)$/)
    if (hintMatch) {
      changed = true
      if (mode === 'guided') {
        output.push(`${indentOf(line)}${commentLine(`TODO ${hintMatch[1]}: ${hintMatch[2]}`, marker.jsx)}`)
      }
      continue // `start` gets no hint at all
    }

    const noteMatch = marker && text.match(/^#note\s+(.*)$/)
    if (noteMatch) {
      output.push(`${indentOf(line)}${commentLine(noteMatch[1], marker.jsx)}`)
      continue
    }

    output.push(line)
  }

  if (inRegion) {
    throw new Error('unterminated `#region solution` — every region needs an `#endregion`')
  }

  return { text: output.join('\n'), changed }
}

let touched = 0
let skipped = 0

for (const root of roots) {
  if (!existsSync(root)) {
    console.error(`strip.mjs: "${root}" from stage.config.json does not exist on this branch`)
    process.exit(1)
  }

  for await (const path of walk(root)) {
    const normalized = path.split('\\').join('/')
    if (isProtected(normalized)) {
      skipped++
      continue
    }

    const source = await readFile(path, 'utf8')
    let result
    try {
      result = transform(source, mode)
    } catch (error) {
      console.error(`strip.mjs: ${path}: ${error.message}`)
      process.exit(1)
    }

    if (!result.changed) continue
    touched++
    if (!dryRun) await writeFile(path, result.text, 'utf8')
    console.log(`  ${dryRun ? 'would strip' : 'stripped'}  ${path}`)
  }
}

console.log(
  `strip.mjs: mode=${mode} · scope=${roots.join(', ')} · ${touched} file(s) ${dryRun ? 'to strip' : 'stripped'} · ${skipped} protected file(s) left untouched`,
)
