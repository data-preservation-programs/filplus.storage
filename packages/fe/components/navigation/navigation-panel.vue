<template>
  <div id="navigation-panel">
    <DropdownPanel @dropdownPanelToggled="dropdownPanelToggled">

      <!-- =================================================== Toggle button -->
      <template #toggle-button="{ togglePanel, panelOpen }">
        <button
          :class="['navigation-toggle-button', { 'panel-open': panelOpen }]"
          @click="togglePanel">
          <div class="navigation-toggle-button-inner-container">
            <IconCloseThick class="icon close" />
            <div class="hamburger" />
          </div>
        </button>
      </template>

      <!-- =========================================================== Panel -->
      <template #dropdown-panel>

        <ButtonX
          v-for="(link, index) in links"
          :key="index"
          :to="link.href"
          :selected="$isRouteCurrent($route, link.href)"
          :tag="link.type"
          :target="link.target"
          class="site-nav-link">
          <div class="text" v-html="link.label" />
        </ButtonX>

      </template>

    </DropdownPanel>
  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import DropdownPanel from '@/components/dropdown-panel'
import ButtonX from '@/components/buttons/button-x'

import IconCloseThick from '@/components/icons/close-thick'

// ====================================================================== Export
export default {
  name: 'ProfilePanel',

  components: {
    DropdownPanel,
    ButtonX,
    IconCloseThick
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent'
    }),
    links () {
      return this.siteContent.general.navigation.header
    }
  },

  methods: {
    dropdownPanelToggled (state) {
      this.$emit('dropdownPanelToggled', { panel: 'navigation', state })
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#navigation-panel {
  position: relative;
  z-index: 2000;
}

.navigation-toggle-button {
  display: block;
  width: toRem(35);
  height: toRem(35);
  border-radius: 50%;
  border: 2px solid $greenYellow;
  background-color: $greenYellow;
  overflow: hidden;
  transition: 150ms ease-out;
  &:hover,
  &.panel-open {
    transition: 150ms ease-in;
    transform: scale(1.15);
  }
  &:hover {
    &.panel-open {
      :deep(.icon) {
        &.close {
          transform: translateY(0) rotate(90deg);
        }
      }
    }
  }
  &.panel-open {
    .hamburger {
      transition: 150ms ease-in;
      opacity: 0;
      transform: translateY(-100%);
    }
    :deep(.icon) {
      transition: 150ms ease-in;
      transform: translateY(0);
      opacity: 1;
    }
  }
}

.navigation-toggle-button-inner-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.hamburger,
.icon {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}

.hamburger {
  width: 1rem;
  height: 0.5rem;
  z-index: 20;
  transition: 150ms ease-out;
  &:before,
  &:after {
    content: '';
    position: absolute;
    left: 0;
    height: toRem(2);
    width: 100%;
    background-color: $aztec;
    transition: 150ms ease-out;
  }
  &:before {
    top: 0;
  }
  &:after {
    bottom: 0;
  }
}

:deep(.panel) {
  border-radius: toRem(18);
}

:deep(.icon) {
  display: block;
  width: toRem(12);
  opacity: 0;
  transform: translateY(100%);
  transition: 150ms ease-out;
  path {
    fill: $aztec;
  }
}

.site-nav-link {
  display: block;
  padding: toRem(2) 1rem;
  &:hover {
    .text {
      transition: 150ms ease-in;
      color: $greenYellow;
    }
  }
  &:first-child {
    padding-top: toRem(10);
  }
  &:last-child {
    padding-bottom: toRem(10);
  }
  .text {
    font-size: 1rem;
    font-weight: 500;
    line-height: leading(35, 18);
    transition: 150ms ease-out;
  }
}
</style>
