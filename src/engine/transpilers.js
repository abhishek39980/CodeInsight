const identityLineMap = (code) => {
  const lineCount = code.split('\n').length
  return Array.from({ length: lineCount }, (_, index) => index + 1)
}

export const transpileToJavaScript = (code, language = 'javascript') => {
  return {
    code,
    lineMap: identityLineMap(code),
    runtimeLanguage: 'javascript',
  }
}
