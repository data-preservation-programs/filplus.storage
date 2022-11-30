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
      <slot name="progress-bar" />
    </div>

    <input
      :id="name"
      ref="input"
      :name="name"
      :value="value"
      :style="`--thumb-dimension-x: ${thumbDimensions.w}px; --thumb-dimension-y: ${thumbDimensions.h}px;`"
      :class="['range', state]"
      :disabled="disabled"
      type="range"
      @focus="focused = true"
      @blur="focused = false"
      @input="$emit('updateValue', $event.target.value)" />

  </div>
</template>

<script>
// =================================================================== Functions
const preValidate = (instance, val, pre) => {
  if (typeof pre !== 'string') { return }
  const regex = new RegExp(pre)
  let value = parseInt(val.replace(regex, ''))
  if (isNaN(value)) {
    value = 0
  } else if (value <= 0) {
    value = 0
  } else if (value > 100) {
    value = 100
  }
  instance.$emit('updateValue', value)
}

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
      }
    }
  },

  computed: {
    name () {
      return this.field.name
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
    state () {
      return this.field.state
    },
    thumbPosition () {
      const tick = this.value
      return `left: calc(${tick}% - ${this.thumbDimensions.w * (tick / 100)}px)`
    },
    progressBarWidth () {
      const tick = this.value
      const thumbWidth = this.thumbDimensions.w
      return `width: calc(${tick}% - ${thumbWidth * (tick / 100) - (thumbWidth / 2)}px)`
    }
  },

  watch: {
    value (value) {
      preValidate(this, value + '', this.pre)
    }
  },

  mounted () {
    this.$nextTick(() => {
      const thumb = this.$refs.thumb
      this.thumbDimensions = {
        w: thumb.offsetWidth,
        h: thumb.offsetHeight
      }
    })
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.range-track {
  position: relative;
  width: 100%;
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
  @include inputRange('thumb') {
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
  @include inputRange('track') {
    appearance: none;
    width: 100%;
    height: 100%;
    border-color: transparent;
    color: transparent;
    cursor: pointer;
  }
}
</style>
