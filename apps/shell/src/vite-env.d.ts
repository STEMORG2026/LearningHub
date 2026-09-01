/// <reference types="vite/client" />

// Side-effect CSS imports (e.g. `import './styles/main.css'`) are resolved by
// Vite at build time. These declarations keep strict tsc typechecking happy.
declare module '*.css';
