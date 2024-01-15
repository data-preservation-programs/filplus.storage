<template>
  <div :class="['field field-range', state]">

    <Range
      ref="range"
      :field="field"
      v-on="$listeners">

      <template #thumb>
        <div class="thumb" />
      </template>

      <template #progress-bar>
        <div ref="progressBar" class="progress-bar">
          <div class="tick-list">
            <div
              v-for="line in numTicks"
              :key="line"
              class="line" />
          </div>
        </div>
      </template>

      <template #tick-list="{ getPosition, getTick, updateValue }">
        <div class="positions">
          <ButtonX
            v-for="label in labels"
            :key="label.slug"
            :class="`position ${label.slug}`"
            :style="{ left: `${getTick(getPosition(label.value))}%` }"
            @clicked="selectPosition($event, label.value, updateValue)">
            {{ label.text }}
          </ButtonX>
        </div>
      </template>

    </Range>

  </div>
</template>

<script>
// ===================================================================== Imports
import Range from '@/modules/form/fields/range'
import ButtonX from '@/components/buttons/button-x'

// ====================================================================== Export
export default {
  name: 'FieldRange',

  components: {
    Range,
    ButtonX
  },

  props: {
    field: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      focused: false,
      numTicks: 0,
      labels: [
        { slug: 'tib-1', text: '1 TiB', value: 1099511627776 },
        { slug: 'tib-100', text: '100 TiB', value: 109951162777600 },
        { slug: 'pib-5', text: '5 PiB', value: 5629499534213120 },
        { slug: 'pib-15', text: '15 PiB', value: 16888498602639360 }
      ]
    }
  },

  computed: {
    scaffold () {
      return this.field.scaffold
    },
    name () {
      return this.scaffold.name
    },
    placeholder () {
      return this.scaffold.placeholder || 'Enter a value...'
    },
    disabled () {
      return this.scaffold.disabled
    },
    pre () {
      return this.scaffold.pre
    },
    validationMessage () {
      return this.scaffold.validationMessage
    },
    value () {
      return this.field.value
    },
    originalValue () {
      return this.field.originalValue
    },
    state () {
      return this.field.state
    }
  },

  mounted () {
    this.$nextTick(() => {
      this.numTicks = Math.ceil(this.$refs.range.$el.clientWidth / 3)
    })
  },

  methods: {
    selectPosition (e, value, updateValue) {
      e.preventDefault()
      updateValue(value, true) // true === do not apply transformation, just funnel the exact value
    }
  }
}
</script>

<style lang="scss" scoped>
$trackHeight: 1.875rem;
$thumbWidth: 4px;
$borderWidth: 2px;

// ///////////////////////////////////////////////////////////////////// General
.field-range {
  // &.in-progress,
  // &.error {
  //   :deep(.range-track) {
  //     &:before {
  //       transition: 150ms ease-in;
  //     }
  //   }
  // }
  // &.in-progress {
  //   :deep(.range-track) {
  //     &:before {
  //       background-color: $mandysPink;
  //     }
  //   }
  // }
  // &.error {
  //   :deep(.range-track) {
  //     &:before {
  //       background-color: $flamingo;
  //     }
  //   }
  // }
}

// /////////////////////////////////////////////////////////////////////// Track
:deep(div.range-track) {
  position: relative;
  left: calc(#{math.div(-$trackHeight, 2)} + #{math.div($thumbWidth, 2)});
  height: $trackHeight;
  width: calc(100% + #{$trackHeight} - #{math.div($thumbWidth, 1)});
  margin-bottom: $borderWidth;
  &:before {
    content: '';
    position: absolute;
    top: 100%;
    left: calc(#{math.div($trackHeight, 2)} - #{math.div($thumbWidth, 2)});
    width: calc(100% - #{$trackHeight} + #{math.div($thumbWidth, 1)});
    height: $borderWidth;
    background-color: $titanWhite;
    transition: all 150ms ease;
  }
  &:hover,
  &:focus-within {
    .thumb {
      &:after {
        height: 0.75rem;
      }
    }
  }
  #total_datacap_size_range {
    &:focus-visible {
      + .thumb-container {
        .thumb {
          &:before {
            height: calc(100% + 1rem);
            @include focusBoxShadow;
          }
          &::after {
            height: 1rem;
          }
        }
      }
    }
  }
  &:active {
    .thumb {
      background-color: $mandysPink;
      &::after {
        background-color: $mandysPink;
        height: 1rem;
      }
    }
  }
  &.disabled {
    cursor: no-drop;
    border-bottom-color: rgba(246, 245, 255, 0.25);
  }
}

// /////////////////////////////////////////////////////////////////////// Thumb
.thumb {
  position: relative;
  left: calc(#{math.div($trackHeight, 2)} - #{math.div($thumbWidth, 2)});
  top: 0;
  width: $thumbWidth;
  height: $trackHeight;
  background-color: $titanWhite;
  z-index: 5;
  transition: all 150ms linear;

  &:after {
    content: '';
    position: absolute;
    bottom: 100%;
    height: 0.5rem;
    left: 0;
    width: 100%;
    pointer-events: inherit;
    background-color: inherit;
    transition: all 150ms linear;
  }
  &:before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: calc(100% + 0.5rem);
    width: 100%;
  }
}

// //////////////////////////////////////////////////////////////// Progress Bar
.progress-bar {
  position: relative;
  left: calc(#{math.div($trackHeight, 2)} - #{math.div($thumbWidth, 2)});
  width: calc(100% - #{$trackHeight} + #{math.div($thumbWidth, 1)});
  height: 100%;
  overflow: hidden;
}

.tick-list {
  display: flex;
  flex-direction: row;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
}

.line {
  background-color: $titanWhite;
  width: 1px;
  height: 100%;
  &:not(:last-child) {
    margin-right: 2px;
  }
}

// /////////////////////////////////////////////////////////////////// Positions
.positions {
  position: relative;
  margin-top: 0.5rem;
}

:deep(.position) {
  position: absolute;
  top: 0;
  margin-top: 0.375rem;
  transition: 150ms ease-out;
  &:hover,
  &:focus-visible {
    transition: 150ms ease-in;
    transform: scale(1.1);
    &:before {
      transition: 150ms ease-in;
      opacity: 1;
    }
  }
  &:focus-visible {
    @include focusOutlineWithOffset;
    border-radius: toRem(3);
  }
  &:before {
    content: '';
    position: absolute;
    top: toRem(-3);
    left: toRem(-3);
    width: calc(100% + toRem(3 * 2));
    height: calc(100% + toRem(3 * 2));
    background-color: rgba(246, 245, 255, 0.2);
    border-radius: toRem(3);
    opacity: 0;
    transition: 150ms ease-out;
  }
  &:not(.gib-32) {
    transform: translateX(-50%);
    &:hover {
      transform: translateX(-50%) scale(1.1);
    }
  }
  &.pib-15 {
    transform: translateX(calc(-100% + toRem(9))); // remove width of '+' icon
    &:hover {
      transform: translateX(calc(-100% + toRem(9))) scale(1.1); // remove width of '+' icon
    }
    .button-content {
      &:after {
        content: '+';
        position: absolute;
        top: toRem(-1);
        right: toRem(-9);
        font-size: 90%;
        font-weight: 500;
        transform: scale(0.5);
        opacity: 0;
        transition: 150ms ease-out;
      }
    }
  }
  .button-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: toRem(14);
    white-space: nowrap;
    line-height: 1;
  }
}
</style>
