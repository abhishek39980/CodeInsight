const plugins = new Map()

export const registerRuntimePlugin = (plugin) => {
  if (!plugin?.id) {
    throw new Error('Runtime plugin requires an id')
  }
  plugins.set(plugin.id, plugin)
}

export const unregisterRuntimePlugin = (id) => {
  plugins.delete(id)
}

export const listRuntimePlugins = () => [...plugins.values()].map((plugin) => ({
  id: plugin.id,
  label: plugin.label || plugin.id,
  supportedLanguages: plugin.supportedLanguages || [],
  synchronous: Boolean(plugin.simulate),
}))

export const selectRuntimePlugin = (language, preferredPluginId = null) => {
  if (preferredPluginId && plugins.has(preferredPluginId)) {
    return plugins.get(preferredPluginId)
  }

  for (const plugin of plugins.values()) {
    if (!plugin.supportedLanguages || plugin.supportedLanguages.includes(language)) {
      return plugin
    }
  }

  return null
}

export const registerPyodidePluginStub = () => {
  if (plugins.has('pyodide')) {
    return
  }

  registerRuntimePlugin({
    id: 'pyodide',
    label: 'Pyodide (Browser Runtime)',
    supportedLanguages: ['python'],
    simulate: null,
    unavailableReason: 'Pyodide runtime not attached in this environment; using deterministic simulator fallback.',
  })
}
