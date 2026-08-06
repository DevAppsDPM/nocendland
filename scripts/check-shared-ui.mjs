import {readdir, readFile} from 'node:fs/promises'
import {extname, join, relative, resolve, sep} from 'node:path'
import {fileURLToPath} from 'node:url'

const repositoryRoot = fileURLToPath(new URL('../', import.meta.url))
const appDirectory = join(repositoryRoot, 'src', 'app')
const sharedUiDirectory = join(appDirectory, 'shared', 'ui')
const sharedPrimitivesPath = join(repositoryRoot, 'src', 'styles', 'components.scss')
const cataloguePath = join(repositoryRoot, 'docs', 'Catálogo técnico.md')
const tsconfigPath = join(repositoryRoot, 'tsconfig.json')
const violations = []

const [appFiles, sharedUiFiles, styleFiles, catalogue, tsconfig] = await Promise.all([
  collectFiles(appDirectory, '.ts'),
  collectFiles(sharedUiDirectory, '.ts'),
  collectFiles(join(repositoryRoot, 'src'), '.scss'),
  readFile(cataloguePath, 'utf8'),
  readFile(tsconfigPath, 'utf8'),
])

const reusableModules = sharedUiFiles
  .filter(file => !file.endsWith('.spec.ts') && /\.(?:component|service)\.ts$/.test(file))
const publicEntrypoints = new Set(
  [...tsconfig.matchAll(/"(@shared\/ui\/[^"]+)"\s*:/g)].map(match => match[1]),
)

for (const reusableModule of reusableModules) {
  const sourcePath = normalizePath(relative(repositoryRoot, reusableModule))
  if (!catalogue.includes(`\`${sourcePath}\``)) {
    violations.push(`${sourcePath} no está registrado en el catálogo técnico`)
  }
}

for (const file of sharedUiFiles.filter(file => !file.endsWith('.spec.ts'))) {
  const content = await readFile(file, 'utf8')
  const sourcePath = normalizePath(relative(repositoryRoot, file))

  if (/\bany\b/.test(content)) violations.push(`${sourcePath} contiene el tipo any`)
  if (/getNestedProperty/.test(content)) violations.push(`${sourcePath} utiliza rutas de propiedades como texto`)
}

for (const file of appFiles.filter(file => !isInside(file, sharedUiDirectory))) {
  const content = await readFile(file, 'utf8')
  const imports = [...content.matchAll(/from\s+['"](@shared\/ui(?:\/[^'"]+)?)['"]/g)].map(match => match[1])
  for (const importedModule of imports) {
    if (!publicEntrypoints.has(importedModule)) {
      violations.push(`${normalizePath(relative(repositoryRoot, file))} importa ${importedModule}, que no es un entrypoint público`)
    }
  }
}

for (const file of styleFiles.filter(file => resolve(file) !== resolve(sharedPrimitivesPath))) {
  const content = await readFile(file, 'utf8')
  if (/^\s*\.ui-[a-z0-9-]+(?::[a-z-]+)?\s*(?:,|\{)/im.test(content)) {
    violations.push(`${normalizePath(relative(repositoryRoot, file))} redefine una primitiva .ui-* fuera del sistema central`)
  }
}

if (violations.length > 0) {
  console.error('La superficie reutilizable de shared UI incumple su contrato:')
  violations.forEach(violation => console.error(`- ${violation}`))
  process.exitCode = 1
} else {
  console.log('Shared UI está tipado, centralizado y sincronizado con el catálogo técnico.')
}

async function collectFiles(directory, extension) {
  const entries = await readdir(directory, {withFileTypes: true})
  const files = await Promise.all(entries.map(entry => {
    const entryPath = join(directory, entry.name)
    if (entry.isDirectory()) return collectFiles(entryPath, extension)
    return extname(entry.name) === extension ? [entryPath] : []
  }))

  return files.flat()
}

function isInside(file, directory) {
  return resolve(file).startsWith(`${resolve(directory)}${sep}`)
}

function normalizePath(path) {
  return path.split(sep).join('/')
}
