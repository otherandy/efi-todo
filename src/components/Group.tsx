import { Category, Group } from "@/types";
import classes from "@/styles/Group.module.css";

type GroupProps = Group & {
  category: Category;
  children: React.ReactNode;
  handleDeleteGroup: () => void;
};

export function GroupComponent({
  category,
  children,
  handleDeleteGroup,
}: GroupProps) {
  return (
    <div
      className={classes.container}
      style={{
        borderColor: category.color,
      }}
    >
      <div
        className={classes.category}
        style={{
          borderColor: category.color,
        }}
      >
        <div>{category.icon}</div>
        <div>{category.name}</div>
      </div>
      {children}
      {Array.isArray(children) && children.length > 1 && (
        <button onClick={handleDeleteGroup}>Delete</button>
      )}
    </div>
  );
}
