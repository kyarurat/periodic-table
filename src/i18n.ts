import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    ui: {
      title: 'Periodic Table',
      language: 'Language',
      all: 'All',
      openElement: 'Open {name}',
    },
    categories: {
      alkaliMetal: 'Alkali Metals',
      alkalineEarthMetal: 'Alkaline Earth Metals',
      lanthanoid: 'Lanthanoids',
      actinoid: 'Aktinoids',
      transitionMetal: 'Transition Metals',
      postTransitionMetal: 'Post-Transition Metals',
      metalloid: 'Metalloids',
      otherNonmetal: 'Other Nonmetals',
      nobleGas: 'Noble Gasses',
      unknown: 'Unknown',
    },
  },
  zh: {
    ui: {
      title: '元素周期表',
      language: '语言',
      all: '全部',
      openElement: '查看 {name}',
    },
    categories: {
      alkaliMetal: '碱金属',
      alkalineEarthMetal: '碱土金属',
      lanthanoid: '镧系元素',
      actinoid: '锕系元素',
      transitionMetal: '过渡金属',
      postTransitionMetal: '后过渡金属',
      metalloid: '类金属',
      otherNonmetal: '其他非金属',
      nobleGas: '稀有气体',
      unknown: '未知',
    },
  },
} as const;

const browserLocale =
  typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';

export const i18n = createI18n({
  legacy: false,
  locale: browserLocale,
  fallbackLocale: 'en',
  messages,
});
