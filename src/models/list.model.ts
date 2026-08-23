import type { Color } from './color.model';
import type { ListItem } from './list-item.model';

export interface List {
    id: number;
    order: number;
    title: string;
    color: Color;
    halfSize: boolean;
    hidden: boolean;

    items: ListItem[];
}