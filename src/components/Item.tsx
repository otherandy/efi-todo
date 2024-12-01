import { Item } from "../types";

type ItemProps = Item & {
  handleDeleteItem: () => void;
};

export function ItemComponent({ text, handleDeleteItem }: ItemProps) {
  return (
    <li>
      <div>{text}</div>
      <button onClick={handleDeleteItem}>Delete</button>
    </li>
  );
}
