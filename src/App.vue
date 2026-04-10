<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { elements, type ElementCategory, type ElementRecord } from './data/elements';
import { elementNamesZh } from './data/element-names-zh';

type CategoryOption = { value: ElementCategory; labelKey: string };

const categories: CategoryOption[] = [
  { value: 'alkali-metal', labelKey: 'categories.alkaliMetal' },
  { value: 'alkaline-earth-metal', labelKey: 'categories.alkalineEarthMetal' },
  { value: 'lanthanoid', labelKey: 'categories.lanthanoid' },
  { value: 'actinoid', labelKey: 'categories.actinoid' },
  { value: 'transition-metal', labelKey: 'categories.transitionMetal' },
  { value: 'post-transition-metal', labelKey: 'categories.postTransitionMetal' },
  { value: 'metalloid', labelKey: 'categories.metalloid' },
  { value: 'other-nonmetal', labelKey: 'categories.otherNonmetal' },
  { value: 'noble-gas', labelKey: 'categories.nobleGas' },
  { value: 'unknown', labelKey: 'categories.unknown' },
];

const { t, locale } = useI18n();

watchEffect(() => {
  document.title = t('ui.title');
  document.documentElement.lang = locale.value === 'zh' ? 'zh-CN' : 'en';
});

const selectedCategory = ref<ElementCategory | null>(null);
const activeAtomicNumber = ref<number | null>(null);

const dimmed = (element: ElementRecord) =>
  selectedCategory.value !== null && element.category !== selectedCategory.value;

const keyDimmed = (category: ElementCategory) =>
  selectedCategory.value !== null && selectedCategory.value !== category;

const placeholderDimmed = (placeholderType: 'lanthanoid' | 'actinoid') => {
  if (selectedCategory.value === null) {
    return false;
  }

  if (selectedCategory.value === 'lanthanoid') {
    return placeholderType !== 'lanthanoid';
  }

  if (selectedCategory.value === 'actinoid') {
    return placeholderType !== 'actinoid';
  }

  return true;
};

const gapDimmed = computed(
  () => selectedCategory.value !== null && !['lanthanoid', 'actinoid'].includes(selectedCategory.value),
);

const clearSelections = () => {
  selectedCategory.value = null;
  activeAtomicNumber.value = null;
};

const toggleElement = (atomicNumber: number) => {
  activeAtomicNumber.value = activeAtomicNumber.value === atomicNumber ? null : atomicNumber;
};

const electronStyle = (electronIndex: number, electronTotal: number) => ({
  transform: `rotate(${(electronIndex / electronTotal) * 360}deg)`,
});

const localizedElementName = (element: ElementRecord) =>
  locale.value === 'zh' ? elementNamesZh[element.atomicNumber] ?? element.name : element.name;

const elementNameStyle = (element: ElementRecord) => {
  const name = localizedElementName(element);
  const normalizedLength = name.replace(/[\s-]/g, '').length;

  let fontSize = '0.7vw';
  if (normalizedLength >= 11 && normalizedLength <= 12) {
    fontSize = '0.62vw';
  } else if (normalizedLength >= 13 && normalizedLength <= 14) {
    fontSize = '0.54vw';
  } else if (normalizedLength >= 15 && normalizedLength <= 16) {
    fontSize = '0.48vw';
  } else if (normalizedLength >= 17 && normalizedLength <= 18) {
    fontSize = '0.43vw';
  } else if (normalizedLength >= 19) {
    fontSize = '0.38vw';
  }

  return { fontSize };
};
</script>

<template>
  <div class="wrapper" @click="clearSelections">
    <div class="periodic-table" :class="{ 'has-active': activeAtomicNumber !== null }">
      <div
        v-for="element in elements"
        :key="element.atomicNumber"
        class="element"
        :class="[element.category, `c${element.column}`, `r${element.row}`, { active: activeAtomicNumber === element.atomicNumber, dimmed: dimmed(element) }]"
      >
        <button
          class="activate"
          type="button"
          :aria-label="t('ui.openElement', { name: localizedElementName(element) })"
          @click.stop="toggleElement(element.atomicNumber)"
        />
        <div class="overlay" @click.stop="clearSelections" />
        <div class="square">
          <div class="model">
            <div v-for="(electronCount, shellIndex) in element.shells" :key="shellIndex" class="orbital">
              <span
                v-for="electronIndex in electronCount"
                :key="`${shellIndex}-${electronIndex}`"
                class="electron"
                :style="electronStyle(electronIndex - 1, electronCount)"
              />
            </div>
          </div>

          <div class="atomic-number">{{ element.atomicNumber }}</div>
          <div class="label">
            <div class="symbol">{{ element.symbol }}</div>
            <div class="name" :style="elementNameStyle(element)">{{ localizedElementName(element) }}</div>
          </div>
          <div class="atomic-mass">{{ element.atomicMass }}</div>
          <ul class="atomic-weight">
            <li v-for="(shell, shellIndex) in element.shells" :key="shellIndex">{{ shell }}</li>
          </ul>
        </div>
      </div>

      <div class="placeholder lanthanoid c3 r6" :class="{ dimmed: placeholderDimmed('lanthanoid') }">
        <div class="square">57-71</div>
      </div>
      <div class="placeholder actinoid c3 r7" :class="{ dimmed: placeholderDimmed('actinoid') }">
        <div class="square">89-103</div>
      </div>
      <div class="gap c3 r8" :class="{ dimmed: gapDimmed }" />
      <div class="language-switch" @click.stop>
        <button class="lang-btn" :class="{ active: locale === 'en' }" type="button" @click.stop="locale = 'en'">EN</button>
        <button class="lang-btn" :class="{ active: locale === 'zh' }" type="button" @click.stop="locale = 'zh'">中文</button>
      </div>

      <div class="key">
        <div class="row">
          <label
            v-for="category in categories"
            :key="category.value"
            :class="[category.value, { dimmed: keyDimmed(category.value), active: selectedCategory === category.value }]"
            @click.stop="selectedCategory = category.value"
          >
            {{ t(category.labelKey) }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
