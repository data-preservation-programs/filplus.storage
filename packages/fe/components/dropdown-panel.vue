<template>
  <div
    v-click-outside="closePanel"
    :class="['dropdown-panel', `toggle-on-${toggleOn}`]">

    <slot
      name="toggle-button"
      :toggle-panel="togglePanel"
      :panel-open="panelOpen"
      :close-panel="closePanel" />

    <div :class="['panel-container', { open: panelOpen }]">

      <div class="squiggly">
        <svg
          viewBox="0 0 42 42"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <g :clip-path="`url(#${squigglyClipPathId})`">
            <path d="M274 70V710C274 726.016 261.016 739 245 739H-8C-24.0163 739 -37 726.016 -37 710V70C-37 53.9838 -24.0163 41 -8 41H-6.875H0.1875C4.88297 41 9.2263 38.4065 11.4277 34.253C15.3746 26.8059 25.9855 26.643 30.1592 33.9653L30.431 34.4421C32.7421 38.4967 37.0504 41 41.7174 41H48.875H245C261.016 41 274 53.9837 274 70Z" fill="#101A17" stroke="white" stroke-width="2" />
          </g>
          <defs>
            <clipPath :id="squigglyClipPathId">
              <rect width="42" height="42" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>

      <div class="panel">
        <slot
          name="dropdown-panel"
          :close-panel="closePanel" />
      </div>

    </div>

  </div>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'DropdownPanel',

  props: {
    toggleOn: {
      type: String,
      required: false,
      default: 'click'
    }
  },

  data () {
    const self = this
    return {
      panelOpen: false,
      squigglyClipPathId: self.$uuid.v4()
    }
  },

  watch: {
    panelOpen (state) {
      this.$emit('dropdownPanelToggled', state)
    }
  },

  methods: {
    togglePanel () {
      if (this.toggleOn === 'click') {
        this.panelOpen = !this.panelOpen
      }
    },
    closePanel () {
      if (this.toggleOn === 'click') {
        this.panelOpen = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$offset: calc(12px + 2rem);
$squigglyWidth: 40;

// ///////////////////////////////////////////////////////////////////// General
.dropdown-panel {
  &.toggle-on-hover {
    &:hover,
    &:focus-within {
      .panel-container {
        transition: 150ms ease-in;
        transform: translate(-50%, 0);
        opacity: 1;
        visibility: visible;
        pointer-events: all;
      }
    }
  }
}

.squiggly {
  position: absolute;
  top: calc(#{toRem(-$squigglyWidth)} + #{$offset} + 2px);
  left: 50%;
  width: toRem($squigglyWidth);
  height: toRem($squigglyWidth);
  transform: translateX(-50%);
  &:before {
    content: '';
    position: absolute;
    top: 100%;
    width: 100%;
    height: 1px;
    background-color: $racingGreen;
  }
  :deep(svg) {
    display: block;
    width: 100%;
    height: 100%;
    path {
      stroke: $greenYellow;
    }
  }
}

// /////////////////////////////////////////////////////////////////////// Panel
/**
 * .panel width and/or max-height must be set in the parent component as these are
 * custom properties that will differ panel-to-panel
 */

.panel-container {
  position: absolute;
  top: 100%;
  left: 50%;
  padding-top: $offset;
  transform: translateX(-50%);
  filter: drop-shadow(0px 4px 55px #030604);
  transition: 150ms ease-out;
  &:not(.open) {
    transition: 150ms ease-in;
    transform: translate(-50%, 1rem);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }
}

.panel {
  background-color: $racingGreen;
  border: 2px solid $greenYellow;
}
</style>
