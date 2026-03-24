// Prevent expo winter runtime from trying to use import.meta
Object.defineProperty(global, '__ExpoImportMetaRegistry', {
  get: () => ({ resolve: () => '' }),
  configurable: true,
});
