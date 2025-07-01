interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  // añade aquí otras VITE_… que uses
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}