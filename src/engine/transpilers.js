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

const normalizeCFamily = (code) => {
  const lines = code.split('\n')
  const output = []
  const lineMap = []

  const push = (line, sourceLine) => {
    output.push(line)
    lineMap.push(sourceLine)
  }

  lines.forEach((line, index) => {
    let next = line
    const sourceLine = index + 1

    if (/^\s*#/.test(next) || /^\s*using\s+namespace\s+std\s*;/.test(next)) {
      return
    }

    if (/^\s*(public|private|protected)\s+class\s+/.test(next) || /^\s*class\s+/.test(next)) {
      return
    }

    next = next.replace(/System\.out\.println\s*\(/g, 'console.log(')

    const coutMatch = next.match(/std::cout\s*<<\s*(.+?)(?:<<\s*std::endl)?\s*;/)
    if (coutMatch) {
      next = `${next.slice(0, coutMatch.index)}console.log(${coutMatch[1].trim()});`
    }

    next = next.replace(/\bfor\s*\(\s*(?:int|long|float|double|short|bool|boolean|char|auto)\s+/g, 'for (let ')

    next = next.replace(
      /(\b|\()(?:(?:const\s+)?(?:int|long|float|double|short|bool|boolean|char|String|string|auto))\s+([A-Za-z_][\w]*)\s*=/g,
      '$1let $2 =',
    )

    next = next.replace(
      /(\b|\()(?:(?:const\s+)?(?:int|long|float|double|short|bool|boolean|char|String|string|auto))\s+([A-Za-z_][\w]*)\s*;/g,
      '$1let $2;',
    )

    const fnRegex = /^\s*(?:public\s+|private\s+|protected\s+|static\s+)*(?:void|int|long|float|double|short|bool|boolean|char|String|string|auto)\s+([A-Za-z_][\w]*)\s*\(([^)]*)\)\s*\{\s*$/
    const fnMatch = next.match(fnRegex)
    if (fnMatch) {
      const name = fnMatch[1]
      const params = cleanParamList(fnMatch[2])
      push(`${' '.repeat(next.search(/\S|$/))}function ${name}(${params}) {`, sourceLine)
      return
    }

    if (/^\s*main\s*\(\s*\)\s*\{\s*$/.test(next)) {
      push('function main() {', sourceLine)
      return
    }

    if (/^\s*(public|private|protected|static)\s*$/.test(next)) {
      return
    }

    push(next, sourceLine)
  })

  return {
    code: output.join('\n'),
    lineMap,
  }
}

const normalizePythonExpression = (text) => {
  return text
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


