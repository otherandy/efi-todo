import type { ActivityStatus } from './activity-status.enum';
import type { Color } from './color.model';
import type { PriorityStatus } from './priority.enum';

export interface ListItem {
    id: number;
    order: number;

    text: string;
    checked: boolean;
    priorityStatus?: PriorityStatus;
    activityStatus?: ActivityStatus;

    emoji?: string;
    color?: Color;
    
    createdAt: Date;
    updatedAt: Date;
}