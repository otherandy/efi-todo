import { defineStore } from 'pinia';
import type { AtListState } from './state';

export const useAtListStore = defineStore('at-list', {
  state: (): AtListState => ({
    lists: [],
  }),
  getters: {
    initialize() {
        this.lists.push({
            id: 1,
            order: 0,
            title: 'Bryce List',
            color: '#0000FF',
            halfSize: false,
            hidden: false,
            items: [
                {
                    id: 1,
                    order: 0,
                    text: 'Bryce Item',
                    checked: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    color: '#0000FF'
                }
            ]
        });
    }
  },
  actions: {
  }
});
