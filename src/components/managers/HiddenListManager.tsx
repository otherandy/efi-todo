import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/utils/db";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { AddListButton } from "@/components/managers/ListManager";

import classes from "@/styles/managers/HiddenListManager.module.css";

export function HiddenListManager() {
  const lists = useLiveQuery(() =>
    db.lists.where("hidden").equals(1).toArray(),
  );

  const handleSetUnhidden = (listId: number) => {
    db.lists
      .update(listId, {
        hidden: 0,
      })
      .catch((error) => console.error(error));
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="hidden-lists" className={classes.container}>
        <div className={classes.header}>
          <AccordionTrigger>Lists</AccordionTrigger>
          <AddListButton />
        </div>
        <AccordionContent className={classes.lists}>
          {lists?.map((list) => (
            <button key={list.id} onClick={() => handleSetUnhidden(list.id)}>
              {list.title}
            </button>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
