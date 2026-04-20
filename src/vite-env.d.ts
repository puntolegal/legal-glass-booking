/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Meta Events Manager → Probar eventos (ej. TEST53498). Solo dev/staging. */
  readonly VITE_META_TEST_EVENT_CODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
