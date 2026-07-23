const identityLineMap = (code) => {
  const lineCount = code.split('\n').length
  return Array.from({ length: lineCount }, (_, index) => index + 1)
}

const cleanParamList = (raw) => {
  if (!raw.trim()) {
    return ''
  }

  return raw
    .split(',')
    .map((segment) => {
      const tokens = segment.trim().split(/\s+/)
      return tokens[tokens.length - 1].replace(/\[|\]/g, '')
    })
    .join(', ')
}

const TYPE_PATTERN = '(?:int|long|float|double|short|bool|boolean|char|String|string|auto|void)'

const countChar = (text, char) => {
  let count = 0
  for (let index = 0; index < text.length; index += 1) {
    if (text[index] === char) {
      count += 1
    }
  }
  return count
}

const normalizeCFamily = (code) => {
  const lines = code.split('\n')
  const output = []
  const lineMap = []
  const wrapperDepths = new Set()
  let braceDepth = 0
  let hasMainDefinition = false
  let hasMainInvocation = false

  const push = (line, sourceLine) => {
    output.push(line)
    lineMap.push(sourceLine)
  }

  lines.forEach((line, index) => {
    let next = line
    const sourceLine = index + 1
    const trimmed = next.trim()
    const indent = ' '.repeat(next.search(/\S|$/))

    if (
      /^\s*#/.test(next) ||
      /^\s*using\s+namespace\s+std\s*;/.test(next) ||
      /^\s*import\s+.+;\s*$/.test(next) ||
      /^\s*package\s+.+;\s*$/.test(next)
    ) {
      return
    }

    if (/^\s*(?:public|private|protected)?\s*(?:abstract\s+|final\s+)?(?:class|struct|interface)\s+.+\{\s*$/.test(next)) {
      const delta = countChar(next, '{') - countChar(next, '}')
      if (delta > 0) {
        wrapperDepths.add(braceDepth + 1)
      }
      braceDepth += delta
      return
    }

    if (trimmed === '}' && wrapperDepths.has(braceDepth)) {
      wrapperDepths.delete(braceDepth)
      braceDepth -= 1
      return
    }

    next = next.replace(/System\.out\.println\s*\(/g, 'console.log(')

    const coutMatch = next.match(/std::cout\s*<<\s*(.+?)(?:<<\s*std::endl)?\s*;/)
    if (coutMatch) {
      next = `${next.slice(0, coutMatch.index)}console.log(${coutMatch[1].trim()});`
    }

    next = next.replace(new RegExp(`\\bfor\\s*\\(\\s*${TYPE_PATTERN}\\s+`, 'g'), 'for (let ')

    next = next.replace(
      new RegExp(`(\\b|\\()(?:(?:const\\s+)?${TYPE_PATTERN}(?:\\s*\\[\\s*\\])+)\\s+([A-Za-z_][\\w]*)\\s*=\\s*\\{`, 'g'),
      '$1let $2 = [',
    )

    next = next.replace(
      new RegExp(`(\\b|\\()(?:(?:const\\s+)?${TYPE_PATTERN})\\s+([A-Za-z_][\\w]*)\\s*\\[[^\\]]*\\]\\s*=\\s*\\{`, 'g'),
      '$1let $2 = [',
    )

    next = next.replace(
      new RegExp(`(\\b|\\()(?:(?:const\\s+)?${TYPE_PATTERN}(?:\\s*\\[\\s*\\])*)\\s+([A-Za-z_][\\w]*)\\s*=`, 'g'),
      '$1let $2 =',
    )

    next = next.replace(
      new RegExp(`(\\b|\\()(?:(?:const\\s+)?${TYPE_PATTERN}(?:\\s*\\[\\s*\\])*)\\s+([A-Za-z_][\\w]*)\\s*;`, 'g'),
      '$1let $2;',
    )

    next = next.replace(/new\s+[A-Za-z_][\w<>\[\]]*\s*\{\s*(.*?)\s*\}/g, '[$1]')
    next = next.replace(/new\s+[A-Za-z_][\w<>\[\]]*\s*\[\s*([^\]]+)\s*\]/g, 'new Array($1).fill(null)')
    next = next.replace(/\bnew\s+([A-Z][A-Za-z0-9_]*)\s*\(\s*\)/g, '{}')

    if (/^\s*(?:public|private|protected|static)\s*$/.test(next)) {
      const delta = countChar(next, '{') - countChar(next, '}')
      braceDepth += delta
      return
    }

    const fnRegex = /^\s*(?:(?:public|private|protected|static|final|synchronized|abstract|native)\s+)*(?:[A-Za-z_][\w<>\[\]]*|void)\s+([A-Za-z_][\w]*)\s*\(([^)]*)\)\s*(?:throws\s+[A-Za-z0-9_.,\s]+)?\{\s*$/
    const fnMatch = next.match(fnRegex)
    if (fnMatch) {
      const name = fnMatch[1]
      const params = cleanParamList(fnMatch[2])
      push(`${indent}function ${name}(${params}) {`, sourceLine)
      if (name === 'main') {
        hasMainDefinition = true
      }
      const delta = countChar(next, '{') - countChar(next, '}')
      braceDepth += delta
      return
    }

    if (/^\s*main\s*\(\s*\)\s*\{\s*$/.test(next)) {
      push('function main() {', sourceLine)
      hasMainDefinition = true
      const delta = countChar(next, '{') - countChar(next, '}')
      braceDepth += delta
      return
    }

    if (/^\s*main\s*\(/.test(trimmed)) {
      hasMainInvocation = true
    }

    push(next, sourceLine)
    const delta = countChar(next, '{') - countChar(next, '}')
    braceDepth += delta
  })

  if (hasMainDefinition && !hasMainInvocation) {
    push('main();', lines.length || 1)
  }

  return {
    code: output.join('\n'),
    lineMap,
  }
}

const normalizePythonExpression = (text) => {
  return text
    .replace(/\blen\s*\(\s*([A-Za-z_][\w.]*)\s*\)/g, '$1.length')
    .replace(/\bTrue\b/g, 'true')
    .replace(/\bFalse\b/g, 'false')
    .replace(/\bNone\b/g, 'null')
    .replace(/\band\b/g, '&&')
    .replace(/\bor\b/g, '||')
    .replace(/\bnot\b/g, '!')
}

const normalizePython = (code) => {
  const lines = code.replace(/\t/g, '    ').split('\n')
  const output = []
  const lineMap = []
  const indentStack = [0]

  const push = (line, sourceLine) => {
    output.push(line)
    lineMap.push(sourceLine)
  }

  lines.forEach((raw, index) => {
    const sourceLine = index + 1
    const trimmed = raw.trim()

    if (!trimmed || trimmed.startsWith('#')) {
      return
    }

    const indent = raw.match(/^\s*/)?.[0].length || 0

    while (indent < indentStack[indentStack.length - 1]) {
      indentStack.pop()
      push('}', sourceLine)
    }

    if (trimmed.startsWith('elif ')) {
      if (indentStack.length > 1) {
        indentStack.pop()
        push('}', sourceLine)
      }
      const condition = normalizePythonExpression(trimmed.slice(5, -1).trim())
      push(`else if (${condition}) {`, sourceLine)
      indentStack.push(indent + 4)
      return
    }

    if (trimmed === 'else:') {
      if (indentStack.length > 1) {
        indentStack.pop()
        push('}', sourceLine)
      }
      push('else {', sourceLine)
      indentStack.push(indent + 4)
      return
    }

    const defMatch = trimmed.match(/^def\s+([A-Za-z_][\w]*)\s*\(([^)]*)\)\s*:\s*$/)
    if (defMatch) {
      push(`function ${defMatch[1]}(${defMatch[2].trim()}) {`, sourceLine)
      indentStack.push(indent + 4)
      return
    }

    const ifMatch = trimmed.match(/^if\s+(.+)\s*:\s*$/)
    if (ifMatch) {
      push(`if (${normalizePythonExpression(ifMatch[1])}) {`, sourceLine)
      indentStack.push(indent + 4)
      return
    }

    const whileMatch = trimmed.match(/^while\s+(.+)\s*:\s*$/)
    if (whileMatch) {
      push(`while (${normalizePythonExpression(whileMatch[1])}) {`, sourceLine)
      indentStack.push(indent + 4)
      return
    }

    const forRangeMatch = trimmed.match(/^for\s+([A-Za-z_][\w]*)\s+in\s+range\(([^)]*)\)\s*:\s*$/)
    if (forRangeMatch) {
      const iter = forRangeMatch[1]
      const parts = forRangeMatch[2].split(',').map((part) => normalizePythonExpression(part.trim()))
      const start = parts.length > 1 ? parts[0] : '0'
      const end = parts.length > 1 ? parts[1] : parts[0]
      push(`for (let ${iter} = ${start}; ${iter} < ${end}; ${iter} = ${iter} + 1) {`, sourceLine)
      indentStack.push(indent + 4)
      return
    }

    const forInMatch = trimmed.match(/^for\s+([A-Za-z_][\w]*)\s+in\s+(.+)\s*:\s*$/)
    if (forInMatch) {
      const iter = forInMatch[1]
      const iterable = normalizePythonExpression(forInMatch[2].trim())
      const indexVar = `__iter_${sourceLine}`
      push(`for (let ${indexVar} = 0; ${indexVar} < ${iterable}.length; ${indexVar} = ${indexVar} + 1) {`, sourceLine)
      push(`let ${iter} = ${iterable}[${indexVar}];`, sourceLine)
      indentStack.push(indent + 4)
      return
    }

    if (/^if\s+__name__\s*==\s*['"]__main__['"]\s*:\s*$/.test(trimmed)) {
      push('if (true) {', sourceLine)
      indentStack.push(indent + 4)
      return
    }

    let jsLine = trimmed
    if (jsLine.startsWith('print(') && jsLine.endsWith(')')) {
      jsLine = `console.log${jsLine.slice(5)}`
    }

    jsLine = normalizePythonExpression(jsLine)

    if (!/[;{}]$/.test(jsLine)) {
      jsLine = `${jsLine};`
    }

    push(jsLine, sourceLine)
  })

  while (indentStack.length > 1) {
    indentStack.pop()
    push('}', lines.length || 1)
  }

  return {
    code: output.join('\n'),
    lineMap,
  }
}

export const transpileToJavaScript = (code, language) => {
  if (language === 'javascript') {
    return {
      code,
      lineMap: identityLineMap(code),
      runtimeLanguage: 'javascript',
    }
  }

  if (language === 'python') {
    const normalized = normalizePython(code)
    return {
      ...normalized,
      runtimeLanguage: 'javascript',
    }
  }

  if (language === 'java' || language === 'cpp') {
    const normalized = normalizeCFamily(code)
    return {
      ...normalized,
      runtimeLanguage: 'javascript',
    }
  }

  throw new Error(`Unsupported language: ${language}`)
}


