<template>
  <div :class="['card', `corner-position__${cornerPosition}`, { outline, small }]">

    <div class="panel">
      <svg
        class="corner"
        viewBox="0 0 92 92"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M -1 94 C 62 94 18 94 91 94 V 94 C 91 78 78 65 62 65 L 59 65 C 42 65 28 51 28 34 L 28 32 L 28 30 C 28 14 15 1 -1 1 Z"
          fill="black"
          fill-opacity="0.4"
          stroke="white"
          stroke-width="2" />
      </svg>
    </div>

    <ButtonX @clicked="$emit('clicked', $event)">
      <div v-if="iconText" class="icon-text">
        {{ iconText }}
      </div>
      <div
        :class="['icon', icon]">
        <Arrow v-if="icon === 'arrow'" />
        <Chevron v-if="icon === 'chevron'" />
      </div>
    </ButtonX>

    <div class="content">
      <slot />
    </div>

  </div>
</template>

<script>
// ====================================================================== Import
import ButtonX from '@/components/buttons/button-x'

import Arrow from '@/components/icons/arrow'
import Chevron from '@/components/icons/chevron'

// ====================================================================== Export
export default {
  name: 'Card',

  components: {
    ButtonX,
    Arrow,
    Chevron
  },

  props: {
    cornerPosition: {
      type: String,
      required: false,
      default: 'top-right',
      validator (val) {
        return ['top-left', 'top-right', 'bottom-right', 'bottom-left'].includes(val)
      }
    },
    variant: {
      type: String,
      required: false,
      default: '',
      validator (val) {
        return ['', 'small', 'tiny'].includes(val)
      }
    },
    icon: {
      type: String,
      required: false,
      default: '',
      validator (val) {
        return ['arrow', 'chevron'].includes(val)
      }
    },
    iconText: {
      type: [String, Boolean],
      required: false,
      default: false
    },
    outline: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
$squigglySizing: 5.75rem;
$squigglySizingSmall: 4.75rem;
$cardRadius: 1.875rem;
$cardRadiusSmall: 1.5625rem;

// ///////////////////////////////////////////////////////////////////// General
.card {
  position: relative;
  &.small {
    .panel {
      &:before {
        height: $squigglySizingSmall;
        width: calc(100% - #{$squigglySizingSmall});
        border-top-left-radius: $cardRadiusSmall;
        border-left: 1px solid $titanWhite;
        border-top: 1px solid $titanWhite;
      }
      &:after {
        top: $squigglySizingSmall;
        height: calc(100% - #{$squigglySizingSmall});
        border-bottom-left-radius: $cardRadiusSmall;
        border-bottom-right-radius: $cardRadiusSmall;
        border: 1px solid white;
        border-top: none;
      }
      .corner {
        width: $squigglySizingSmall;
        height: $squigglySizingSmall;
        path {
          stroke-width: 1px;
        }
      }
    }
    .icon {
      width: toRem(41);
      height: toRem(41);
    }
  }
}

.panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  &:before,
  &:after {
    content: '';
    position: absolute;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 2;
    box-sizing: border-box;
  }
  &:before,
  &:after {
    left: 0;
  }
  &:before {
    top: 0;
    height: $squigglySizing;
    width: calc(100% - #{$squigglySizing});
    border-top-left-radius: $cardRadius;
    border-left: 2px solid $titanWhite;
    border-top: 2px solid $titanWhite;
  }
  &:after {
    top: $squigglySizing;
    height: calc(100% - #{$squigglySizing});
    width: 100%;
    border-bottom-left-radius: $cardRadius;
    border-bottom-right-radius: $cardRadius;
    border: 2px solid white;
    border-top: none;
  }
  .corner {
    width: $squigglySizing;
    height: $squigglySizing;
  }
}

.corner {
  position: absolute;
  top: 0;
  right: 0;
}

.content {
  position: relative;
  z-index: 10;
}

.button {
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  z-index: 20;
}

.icon-text {
  font-size: toRem(24);
}

.icon {
  position: relative;
  width: toRem(54);
  height: toRem(54);
  border-radius: 50%;
  background-color: $greenYellow;
  :deep(svg) {
    position: absolute;
    width: 0.9375rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  &.arrow {
    :deep(path) {
      fill: $temptress;
    }
  }
  &.chevron {
    border: none;
    :deep(path) {
      fill: none;
      stroke: $temptress;
      transform: translateX(1px);
    }
  }
}

// ////////////////////////////////////////////////////// Corner Cutout Variants
// -------------------------------------------------------------------- Top Left
.card.corner-position__top-left {
  .panel {
    transform: scaleX(-1);
  }
  .button {
    flex-direction: row-reverse;
    top: 0;
    left: 0;
  }
  .icon-text {
    padding-left: 2rem;
  }
  .content {
    padding: 3.125rem 3.4375rem 1.875rem 7rem;
  }
}

// ------------------------------------------------------------------- Top Right
.card.corner-position__top-right {
  .button {
    top: 0;
    right: 0;
  }
  .icon-text {
    padding-right: 2rem;
  }
  .content {
    padding: 3.125rem 7rem 1.875rem 3.4375rem;
  }
}

// ---------------------------------------------------------------- Bottom Right
.card.corner-position__bottom-right {
  .panel {
    transform: scaleY(-1);
  }
  .button {
    bottom: 0;
    right: 0;
  }
  .icon-text {
    padding-right: 2rem;
  }
  .content {
    padding: 1.875rem 7rem 3.125rem 3.4375rem;
  }
}

// ----------------------------------------------------------------- Bottom Left
.card.corner-position__bottom-left {
  .panel {
    transform: scale(-1);
  }
  .button {
    flex-direction: row-reverse;
    bottom: 0;
    left: 0;
  }
  .icon-text {
    padding-left: 2rem;
  }
  .content {
    padding: 1.875rem 3.4375rem 3.125rem 7rem;
  }
}

// ---------------------------------------------------------------- Outline Only
.card.outline {
  .panel {
    &:before,
    &:after {
      background-color: transparent;
    }
  }
  .corner {
    path {
      fill: transparent;
    }
  }
}
</style>
