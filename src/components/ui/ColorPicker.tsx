import { TwitterPicker } from "react-color";

export function ColorPicker({
  color,
  onChange,
}: {
  color: string;
  onChange: (color: string) => void;
}) {
  return (
    <TwitterPicker
      color={color}
      onChangeComplete={(color: { hex: string }) => onChange(color.hex)}
    />
  );
}
