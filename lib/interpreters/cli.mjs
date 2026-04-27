// CLI interpreter — stub.
//
// TODO: Resolve canonical tokens into a runtime lookup table the CLI product
// imports for output rendering. Stub for now; populate when the CLI codebase
// is wired up.
//
// Eventual job:
//   - Read tokens/canonical.json.
//   - Resolve dot-notation references (e.g. typography role's `color: "color.text.primary"`)
//     into concrete hex values, glyph chars, and ANSI/OSC escape sequences.
//   - Emit a small, dependency-free runtime module the CLI can import to render
//     output that matches the canonical visual system without re-deriving the
//     reconciliation work from source.
//
// Assumption (stated inline per spec): this module is .mjs rather than .ts so
// the build script can import it without TypeScript compilation. See
// lib/interpreters/figma.mjs for the same note.

/**
 * @param {object} _canonical Parsed contents of tokens/canonical.json.
 * @returns {never}
 */
export function project(_canonical) {
  throw new Error(
    "cli interpreter is a stub. See lib/interpreters/cli.mjs TODO for the eventual contract."
  );
}
