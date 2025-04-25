export function getReadableTextColor(hexColor: string): "white" | "black" {
  const hex = hexColor.replace(/^#/, "");

  if (hex.length !== 6) {
    throw new Error(
      "Invalid hex color format. Expected a 6-character hex value.",
    );
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? "black" : "white";
}
