import { useEffect, useState } from "react";
import { useDatabaseService } from "@/hooks/useDatabaseService";
import { getReadableTextColor } from "@/utils/color";
import type { List } from "@/types/index.types";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";

import classes from "@/styles/managers/HiddenListManager.module.css";

export function HiddenListManager() {
  const db = useDatabaseService();
  const [lists, setLists] = useState<List[] | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    db.getLists()
      .then((data) => {
        if (mounted) setLists(data.filter((list) => list.hidden));
      })
      .catch((error) => console.error(error));
    return () => {
      mounted = false;
    };
  }, [db]);

  const handleSetUnhidden = (listId: number) => {
    db.updateList(listId, { hidden: 0 })
      .then(() => {
        setLists((prev) => prev?.filter((list) => list.id !== listId));
      })
      .catch((error) => console.error(error));
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="hidden-lists" className={classes.container}>
        <div className={classes.header}>
          <AccordionTrigger>Lists</AccordionTrigger>
          {/* <AddListButton /> */}
        </div>
        <AccordionContent className={classes.lists}>
          {lists?.map((list) => (
            <button
              key={list.id}
              onClick={() => handleSetUnhidden(list.id)}
              style={{
                backgroundColor: list.color,
                color: getReadableTextColor(list.color),
              }}
            >
              {list.title}
            </button>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
