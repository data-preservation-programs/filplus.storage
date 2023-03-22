<template>
  <div :class="squigglieClasses">

    <div
      class="line-before"
      :style="beforeWidth">
    </div>

    <svg
      class="squigglie"
      width="82"
      height="44"
      viewBox="0 0 82 44"
      xmlns="http://www.w3.org/2000/svg"
      :style="squigglieLeft">
      <path stroke="white" stroke-width="2" d="M 81 2 C 80.442 2.0215 80.062 1.9994 79.68 1.9619 C 77.788 1.7755 71.604 1.2606 67.5 2.0215 C 55.0561 4.3287 54.6538 21.7863 42 22.0215 C 29.0368 22.2625 28.2552 4.3472 15.5 2.0215 C 11.2112 1.2395 4.7439 1.7752 2.8132 1.9633 C 2.4374 2 2.0607 2.0215 1.6831 2.0215 L 1 2" />
    </svg>

    <div
      class="line-after"
      :style="afterWidth">
    </div>

  </div>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'Squigglie',

  props: {
    percentLeft: {
      type: Number,
      required: false,
      default: 0
    },
    orientation: {
      type: String,
      required: false,
      default: 'down',
      validator (val) {
        return ['up', 'down'].includes(val)
      }
    },
    anchor: {
      type: String,
      required: false,
      default: 'top',
      validator (val) {
        return ['top', 'bottom'].includes(val)
      }
    },
    color: {
      type: String,
      required: false,
      default: 'white',
      validator (val) {
        return ['white', 'nandor', 'pass-through'].includes(val)
      }
    },
    thick: {
      type: Boolean,
      required: false,
      default: false
    },
    accordionBottomBorder: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  computed: {
    squigglieClasses () {
      return [
        'squigglie-wrapper',
        `orientation-${this.orientation}`,
        `anchor-${this.anchor}`,
        `color-${this.color}`,
        { 'border-thick': this.thick },
        { 'accordion-bottom-border': this.accordionBottomBorder }

      ]
    },
    beforeWidth () {
      return { width: `calc(${this.percentLeft}% - 40px)` }
    },
    squigglieLeft () {
      return { left: `calc(${this.percentLeft}% - 41px)` }
    },
    afterWidth () {
      return { width: `calc(${100 - this.percentLeft}% - 40px)` }
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.squigglie-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.line-before,
.line-after {
  position: absolute;
  height: 2px;
  top: 1px;
  background-color: white;
}

.line-before {
  left: 0;
}

.line-after {
  right: 0;
}

.squigglie {
  position: absolute;
  left: 0;
  top: 0;
  fill: none;
}

// ////////////////////////////////////////////////////////////////// Variations
.squigglie-wrapper {
  &.orientation-up {
    .squigglie {
      transform: scaleY(-1) translateY(40px);
    }
  }
  &.anchor-bottom {
    top: unset;
    bottom: 0;
  }
  &.color-nandor {
    .line-before,
    .line-after {
      background-color: $nandor;
    }
    .squigglie {
      path {
        stroke: $nandor;
      }
    }
  }
  &.color-pass-through {
    .line-before,
    .line-after {
      opacity: 0.4;
    }
    .squigglie {
      opacity: 0.4;
    }
  }
  &.border-thick {
    .line-before,
    .line-after {
      top: 0;
      height: 3px;
    }
    .squigglie {
      transform: translateY(-0.5px);
      path {
        stroke-width: 3;
      }
    }
    &.orientation-up {
      .squigglie {
        transform: scaleY(-1) translateY(40.5px);
        path {
          stroke-width: 3;
        }
      }
    }
  }
  &.accordion-bottom-border {
    left: -3px;
    width: calc(100% + 6px);
    .line-before,
    .line-after {
      border-bottom: 3px solid $nandor;
      height: 10px;
      top:unset;
      bottom: -3px;
      background-color: transparent;
    }
    .line-before {
      border-left: 3px solid $nandor;
      border-bottom-left-radius: toRem(10);
    }
    .line-after {
      border-right: 3px solid $nandor;
      border-bottom-right-radius: toRem(10);
    }
    .squigglie {
      transform: scaleY(-1) translateY(40.5px);
      path {
        stroke-width: 3;
      }
    }
  }
}
</style>
