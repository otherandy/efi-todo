import { SketchPicker } from "react-color";

export function ColorPicker({
  color,
  handleChangeColor,
}: {
  color: string;
  handleChangeColor: (color: string) => void;
}) {
  return (
    <SketchPicker
      color={color}
      onChangeComplete={(color: { hex: string }) => {
        handleChangeColor(color.hex);
      }}
    />
  );
}
