import { SketchPicker } from "react-color";

export function ColorPicker({
  color,
  setDisplayColorPicker,
  handleChangeColor,
}: {
  color: string;
  setDisplayColorPicker: (display: boolean) => void;
  handleChangeColor: (color: string) => void;
}) {
  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "0px",
          right: "0px",
          bottom: "0px",
          left: "0px",
        }}
        onClick={() => setDisplayColorPicker(false)}
      />
      <div style={{ position: "absolute", zIndex: 10 }}>
        <SketchPicker
          color={color}
          onChangeComplete={(color: { hex: string }) => {
            handleChangeColor(color.hex);
            setDisplayColorPicker(false);
          }}
        />
      </div>
    </>
  );
}
