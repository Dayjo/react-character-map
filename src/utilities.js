/**
 * Utility function to programatically delete character palette
 * local storagee data.
 */
export default function deleteCharPaletteData() {
	localStorage.removeItem('tenupISCcharPalette');
}
