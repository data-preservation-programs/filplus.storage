<template>
  <div id="form-toolbar">

    <div class="pie-chart">
      <div
        :style="{
          background: `conic-gradient(#B7F651 ${percentCompletion}deg, #304742 ${percentCompletion}deg)`,
          color: 'black'
        }"
        class="circle" />
    </div>

    <div class="toolbar">
      <div class="state">
        Question {{ formStats.completed }} / {{ formStats.mounted }}
      </div>
      <!-- <div class="buttons">
        <button class="nav-button prev">
          Previous
        </button>
        <button class="nav-button next">
          Next
        </button>
      </div> -->
    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
// ====================================================================== Export
export default {
  name: 'FormToolbar',

  computed: {
    formStats () {
      return this.$form.getFieldStats('filplus_application')
    },
    percentCompletion () {
      const formStats = this.formStats
      if (formStats.mounted === 0) { return 0 }
      return Math.ceil((formStats.completed / formStats.mounted) * 360)
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#form-toolbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  position: fixed;
  bottom: 2rem;
  right: calc((100vw - #{$containerWidth}) / 2);
  height: toRem(70);
  background-color: $outerSpace;
  border: 2px solid $nandor;
  border-radius: toRem(10);;
  box-shadow: 0px 4px 34px 3px rgba(0, 0, 0, 0.25);
  z-index: 10000;
}

// /////////////////////////////////////////////////////////////////// Pie Chart
.pie-chart {
  padding: 0 1rem;
  .circle {
    width: toRem(30);
    height: toRem(30);
    background-color: #304742;
    border-radius: 50%;
  }
}

// ///////////////////////////////////////////////////////////////////// Toolbar
.toolbar {
  padding-right: 1rem;
}

.state {
  font-weight: 500;
  line-height: 1;
}

.buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: toRem(8);
}

.nav-button {
  font-size: toRem(13);
  line-height: 1;
  color: rgba($titanWhite, 0.8);
  &:hover {
    text-decoration: underline;
  }
}
</style>
