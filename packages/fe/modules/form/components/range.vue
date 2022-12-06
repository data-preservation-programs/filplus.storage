<template>
  <div :class="['range-track', state, { focused }]">

    <div
      ref="thumb"
      class="thumb-container"
      :style="thumbPosition">
      <slot name="thumb" />
    </div>

    <div
      :style="progressBarWidth"
      class="progress-bar-container">
      <slot name="progress-bar" :tick="tick" />
    </div>

    <input
      :id="fieldKey"
      ref="input"
      :name="fieldKey"
      :value="value"
      :min="min"
      :max="max"
      step="500000000"
      :style="rangeStyling"
      :class="['range', state]"
      :disabled="disabled"
      type="range"
      @focus="focused = true"
      @blur="focused = false"
      @input="$emit('updateValue', $event.target.value)" />

  </div>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'FieldRange',

  props: {
    field: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      focused: false,
      thumbDimensions: {
        x: 0,
        y: 0
      },
      format: false
    }
  },

  computed: {
    fieldKey () {
      return this.field.field_key
    },
    disabled () {
      return this.field.disabled
    },
    pre () {
      return this.field.pre
    },
    value () {
      return this.field.value
    },
    min () {
      return this.field.min
    },
    max () {
      return this.field.max
    },
    state () {
      return this.field.state
    },
    tick () {
      return (this.value / this.max) * 100
    },
    thumbPosition () {
      const tick = this.tick >= 100 ? 100 : this.tick
      const thumbHeight = this.thumbDimensions.h
      return `left: calc(${tick}% - ${thumbHeight * (tick / 100)}px)`
    },
    progressBarWidth () {
      const tick = this.tick >= 100 ? 100 : this.tick
      const thumbHeight = this.thumbDimensions.h
      return `width: calc(${tick}% - ${thumbHeight * (tick / 100)}px + ${thumbHeight}px)`
    },
    rangeStyling () {
      const thumbDimensions = this.thumbDimensions
      const width = this.format === 'line' ? thumbDimensions.h : thumbDimensions.w
      return `--thumb-dimension-x: ${width}px; --thumb-dimension-y: ${thumbDimensions.h}px;`
    }
  },

  mounted () {
    this.$nextTick(() => {
      const thumb = this.$refs.thumb
      this.thumbDimensions = {
        w: thumb.offsetWidth,
        h: thumb.offsetHeight
      }
      this.format = this.thumbDimensions.w === this.thumbDimensions.h ? 'square' : 'line'
    })
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.range-track {
  position: relative;
  width: 100%;
  box-sizing: content-box;
}

.thumb-container {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 10;
}

.progress-bar-container {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  pointer-events: none;
  z-index: 5;
}

@mixin thumb {
  appearance: none;
  position: relative;
  top: 50%;
  left: 0;
  width: var(--thumb-dimension-x);
  height: var(--thumb-dimension-y);
  transform: translateY(-50%);
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
}

@mixin track {
  appearance: none;
  width: 100%;
  height: 100%;
  border-color: transparent;
  color: transparent;
  cursor: pointer;
}

.range {
  position: relative;
  display: block;
  appearance: none;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 15;
  &:focus {
    outline: none;
  }
  &::-webkit-slider-thumb {
    @include thumb;
  }
  &::-moz-range-thumb {
    @include thumb;
  }
  &::-ms-thumb {
    @include thumb;
  }
  &::-webkit-slider-runnable-track {
    @include track;
  }
  &::-moz-range-track {
    @include track;
  }
  &::-ms-track {
    @include track;
  }
}
</style>
