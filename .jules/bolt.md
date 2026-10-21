## 2025-05-18 - Heavy Markdown Parsing & Re-rendering in Medical Courseware
**Learning:** Custom line-by-line Markdown renderers without memoization re-parse large curriculum documents on every render and state change, causing main thread blocking during interactive user sessions (e.g. quiz answers, tab switches).
**Action:** Always pre-compile RegExp objects outside the parser and wrap custom Markdown renderer components in `React.memo` with internal AST/JSX `useMemo`.
