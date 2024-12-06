import { Group } from "@/types";

type GroupProps = Group & {
  children: React.ReactNode;
  handleDeleteGroup: () => void;
};

export function GroupComponent({ children, handleDeleteGroup }: GroupProps) {
  return (
    <li>
      <ul>
        {children}
        <button onClick={handleDeleteGroup}>Delete Group</button>
      </ul>
    </li>
  );
}
