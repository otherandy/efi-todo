import { SketchPicker } from "react-color";
import { Portal } from "@/components/ui/Portal";

export function ColorPicker({
  color,
  pickerPos,
  setDisplayColorPicker,
  handleChangeColor,
}: {
  color: string;
  pickerPos: { top: number; left: number };
  setDisplayColorPicker: (display: boolean) => void;
  handleChangeColor: (color: string) => void;
}) {
  return (
    <Portal>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 9998,
        }}
        onClick={() => setDisplayColorPicker(false)}
      ></div>
      <div
        style={{
          position: "absolute",
          top: pickerPos.top,
          left: pickerPos.left,
          zIndex: 9999,
        }}
      >
        <SketchPicker
          color={color}
          onChangeComplete={(color: { hex: string }) => {
            handleChangeColor(color.hex);
          }}
        />
      </div>
    </Portal>
  );
}
