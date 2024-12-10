import { Category } from "@/types";
import classes from "@/styles/Group.module.css";

interface GroupProps {
  category?: Category;
  children: React.ReactNode;
  handleDeleteGroup: () => void;
}

export function GroupComponent({
  category,
  children,
  handleDeleteGroup,
}: GroupProps) {
  const c = category ?? { name: "", color: "", icon: "" };

  return (
    <div
      className={classes.container}
      style={{
        borderColor: c.color,
      }}
    >
      <div
        className={classes.category}
        style={{
          borderColor: c.color,
        }}
      >
        <div>{c.icon}</div>
        <input className={classes.text} value={c.name} />
      </div>
      {children}
      {Array.isArray(children) && children.length > 1 && (
        <button onClick={handleDeleteGroup}>Delete</button>
      )}
    </div>
  );
}
