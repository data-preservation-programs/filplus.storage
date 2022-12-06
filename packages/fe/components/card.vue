<template>
  <div :class="['card', `corner-position__${cornerPosition}`]">

    <div :class="['panel', { small }]">
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

      <div
        v-if="icon"
        :class="['icon', icon]">
        <Arrow v-if="icon === 'arrow'" />
        <Chevron v-if="icon === 'chevron'" />
      </div>

    </div>

    <div class="content">
      <slot></slot>
    </div>

  </div>
</template>

<script>
// ====================================================================== Import
import Arrow from '@/components/icons/arrow'
import Chevron from '@/components/icons/chevron'

// ====================================================================== Export
export default {
  name: 'Card',

  components: {
    Arrow,
    Chevron
  },

  props: {
    cornerPosition: {
      type: String,
      required: false,
      default: 'top-right',
      validator (val) {
        return ['top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(val)
      }
    },
    small: {
      type: Boolean,
      required: false,
      default: false
    },
    icon: {
      type: String,
      required: false,
      default: '',
      validator (val) {
        return ['arrow', 'chevron'].includes(val)
      }
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
}

.panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
  .icon {
    width: toRem(54);
    height: toRem(54);
  }
  &.small {
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
    .icon {
      width: toRem(41);
      height: toRem(41);
    }
  }
}

.corner {
  position: absolute;
  right: 0;
  top: 0;
}

.content {
  position: relative;
  padding: 3.125rem 7rem 1.875rem 3.4375rem;
  z-index: 10;
}

.icon {
  position: absolute;
  top: 0;
  right: 0;
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
  .panel,
  .icon {
    transform: scaleX(-1);
  }
  .content {
    padding: 3.125rem 3.4375rem 1.875rem 7rem;
  }
}

// ----------------------------------------------------------------- Bottom Left
.card.corner-position__bottom-left {
  .panel,
  .icon {
    transform: scale(-1);
  }
  .content {
    padding: 1.875rem 3.4375rem 3.125rem 7rem;
  }
}

// ---------------------------------------------------------------- Bottom Right
.card.corner-position__bottom-right {
  .panel,
  .icon {
    transform: scaleY(-1);
  }
  .content {
    padding: 1.875rem 7rem 3.125rem 3.4375rem;
  }
}
</style>
