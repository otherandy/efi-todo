import { defineStore } from 'pinia';
import type { AtListState } from './state';
import { PriorityStatus } from '@/models/priority.enum';
import { ActivityStatus } from '@/models/activity-status.enum';

export const useAtListStore = defineStore('at-list', {
  state: (): AtListState => ({
    lists: [],
  }),
  getters: {
  },
  actions: {
    initialize() {
        this.lists.push(
            {
                id: 1,
                order: 0,
                title: 'Groceries',
                color: '#0000FF',
                halfSize: false,
                hidden: false,
                items: [
                    {
                        id: 1,
                        order: 0,
                        text: 'Milk',
                        checked: false,
                        priorityStatus: PriorityStatus.Normal,
                        emoji: '🥛',
                        color: '#0000FF',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        id: 2,
                        order: 1,
                        text: 'Eggs',
                        checked: true,
                        priorityStatus: PriorityStatus.Normal,
                        emoji: '🥚',
                        color: '#0000FF',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        id: 3,
                        order: 2,
                        text: 'Coffee',
                        checked: false,
                        priorityStatus: PriorityStatus.Urgent,
                        emoji: '☕',
                        color: '#0000FF',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                ],
            },
            {
                id: 2,
                order: 1,
                title: 'Work',
                color: '#FF6B00',
                halfSize: true,
                hidden: false,
                items: [
                    {
                        id: 4,
                        order: 0,
                        text: 'Finish quarterly report',
                        checked: false,
                        priorityStatus: PriorityStatus.Starred,
                        activityStatus: ActivityStatus.Progressing,
                        color: '#FF6B00',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        id: 5,
                        order: 1,
                        text: 'Review pull requests',
                        checked: false,
                        activityStatus: ActivityStatus.Paused,
                        color: '#FF6B00',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        id: 6,
                        order: 2,
                        text: 'Reply to emails',
                        checked: true,
                        color: '#FF6B00',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                ],
            },
            {
                id: 3,
                order: 2,
                title: 'Someday',
                color: '#8E44AD',
                halfSize: true,
                hidden: false,
                items: [
                    {
                        id: 7,
                        order: 0,
                        text: 'Learn to surf',
                        checked: false,
                        emoji: '🏄',
                        color: '#8E44AD',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    {
                        id: 8,
                        order: 1,
                        text: 'Repaint the fence',
                        checked: false,
                        color: '#8E44AD',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                ],
            },
        );
    }
  }
});
