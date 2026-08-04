import type { Color } from './color.model';

export interface List {
    id: number;
    order: number;
    title: string;
    color: Color;
    halfSize: boolean;
    hidden: boolean;
}