import { Category, Group } from "@/types";

type GroupProps = Group & {
  category?: Category;
  children: React.ReactNode;
  handleDeleteGroup: () => void;
};

export function GroupComponent({
  category,
  children,
  handleDeleteGroup,
}: GroupProps) {
  return (
    <div>
      {category && <div>{category.name}</div>}
      {children}
      {Array.isArray(children) && children.length > 1 && (
        <button onClick={handleDeleteGroup}>Delete</button>
      )}
    </div>
  );
}
