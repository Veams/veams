/**
 * Utilities for encoding and decoding script tags to safely embed them in the DOM.
 */

/**
 * Escapes script tags to prevent the browser from executing them as actual scripts.
 */
export function scriptEncode(str: string): string {
  return str.replace(/<script/g, '&lt;script').replace(/<\/script>/g, '&lt;/script&gt;');
}

/**
 * Reverses script encoding to restore the original string content.
 */
export function scriptDecode(str: string): string {
  return str.replace(/&lt;script/g, '<script').replace(/&lt;\/script&gt;/g, '</script>');
}
