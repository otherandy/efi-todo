import { EmojiIndex } from 'emoji-mart-vue-fast-next/src';
import emojiData from 'emoji-mart-vue-fast-next/data/all.json';
import LvUpEmblem1Icon from '@assets/icons/lvup_emblem_color1.svg?url';
import MantaDreamsIcon from '@assets/icons/manta_dreams.svg?url';
import FracturedCoreIcon from '@assets/icons/fractured_core.svg?url';

const custom = [
    {
      id: 'lvup1',
      short_names: ['lvup'],
      keywords: ['LvUp 1', 'LvUp Emblem 1', 'LvUp Emblem Color 1'],
      imageUrl: LvUpEmblem1Icon,
    },
    {
      id: 'manta',
      short_names: ['manta'],
      keywords: ['Manta', 'Manta Dreams'],
      imageUrl: MantaDreamsIcon,
    },
    {
      id: 'fractured',
      short_names: ['fractured'],
      keywords: ['Fractured', 'Fractured Core'],
      imageUrl: FracturedCoreIcon,
    }
];

export const emojiIndex = new EmojiIndex(emojiData, {
    custom
});
export const EMOJI_SET = 'twitter';

// Custom emojis are always appended last by EmojiIndex, so move the
// "custom" category to right after "Frequently Used" (or to the front
// if there's no recent history yet).
const categories = emojiIndex.categories();
const customCategoryIndex = categories.findIndex((category) => category.id === 'custom');
if (customCategoryIndex > -1) {
    const [customCategory] = categories.splice(customCategoryIndex, 1);
    const recentCategoryIndex = categories.findIndex((category) => category.id === 'recent');
    categories.splice(recentCategoryIndex > -1 ? recentCategoryIndex + 1 : 0, 0, customCategory);
}
