/// <reference types="vite/client" />

declare module 'emoji-mart-vue-fast-next/src' {
    import type { DefineComponent } from 'vue';

    export interface EmojiData {
        id: string;
        name: string;
        colons: string;
        native: string;
        unified: string;
        skin: number | null;
        emoticons: string[];
    }

    export interface EmojiCategory {
        id: string;
        name: string;
        emojis: EmojiData[];
    }

    export class EmojiIndex {
        constructor(data: unknown, options?: Record<string, unknown>);
        categories(): EmojiCategory[];
    }

    export const Picker: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
    export const Emoji: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
}

declare module 'emoji-mart-vue-fast-next/data/all.json' {
    const data: unknown;
    export default data;
}

declare module 'emoji-mart-vue-fast-next/css/emoji-mart.css';
