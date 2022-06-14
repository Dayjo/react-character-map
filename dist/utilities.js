'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = deleteCharPaletteData;
/**
 * Utility function to programatically delete character palette
 * local storagee data.
 */
function deleteCharPaletteData() {
  localStorage.removeItem('tenupISCcharPalette');
}