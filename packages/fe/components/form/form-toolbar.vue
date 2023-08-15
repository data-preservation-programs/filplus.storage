<template>
  <div id="form-toolbar">

    <div class="pie-chart">
      <div
        :style="{
          background: `conic-gradient(#B7F651 ${percentCompletion}deg, #304742 ${percentCompletion}deg)`,
          color: 'black'
        }"
        :class="['circle', { 'display-checkmark': formCompleted }]">
        <IconFormCompletedCheckmark class="icon-checkmark" />
      </div>
    </div>

    <div :class="['toolbar', { 'saved-state-drawer-open': formSavedState }]">
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

    <button
      :class="['saving-drawer', formSavedState, { hidden: !formSavedState }]"
      @click="scrollToSubmitButton">
      <div class="save-state-icons">
        <div class="track">
          <IconFieldInProgress class="icon saving" />
          <IconFieldComplete class="icon saved" />
          <IconFormRestored class="icon restored" />
          <IconGithub class="icon github" />
        </div>
      </div>
      <div class="save-state-text">
        {{ buttonTextMap[formSavedState] }}
      </div>
    </button>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapActions } from 'vuex'

import IconFormCompletedCheckmark from '@/components/icons/form/checkmark'
import IconFieldInProgress from '@/components/icons/form/in-progress'
import IconFieldComplete from '@/components/icons/form/complete'
import IconFormRestored from '@/components/icons/form/restored'
import IconGithub from '@/components/icons/github'

// ====================================================================== Export
export default {
  name: 'FormToolbar',

  components: {
    IconFormCompletedCheckmark,
    IconFieldInProgress,
    IconFieldComplete,
    IconFormRestored,
    IconGithub
  },

  props: {
    formId: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      buttonTextMap: {
        saving: 'Saving',
        saved: 'Saved',
        restored: 'Restored',
        completed: 'Ready'
      }
    }
  },

  computed: {
    formStats () {
      return this.$form.getFieldStats('filplus_application')
    },
    percentCompletion () {
      const formStats = this.formStats
      if (formStats.mounted === 0) { return 0 }
      return Math.ceil((formStats.completed / formStats.mounted) * 360)
    },
    formSavedState () {
      return this.$form.getSavedState(this.formId)
    },
    formCompleted () {
      const formStats = this.formStats
      return formStats.completed === formStats.mounted
    }
  },

  mounted () {
    this.$nextTick(() => {
      const form = this.$ls.get(`form__${this.formId}`)
      if (form) {
        const formStats = this.$form.getFieldStats(this.formId)
        const state = formStats.completed === formStats.mounted ? 'completed' : 'restored'
        this.setFormSaveState({ id: this.formId, state })
      }
    })
  },

  methods: {
    ...mapActions({
      setFormSaveState: 'form/setFormSaveState'
    }),
    scrollToSubmitButton (e) {
      e.preventDefault()
      if (this.formSavedState === 'completed') {
        let button = document.querySelector('.submit-button')
        if (!button) {
          button = document.querySelector('#form .buttons.bottom .login-button')
        }
        this.$scrollToElement(button, 250, -300)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#form-toolbar {
  display: flex;
  flex-direction: row;
  position: fixed;
  bottom: 4rem;
  right: calc((100vw - #{$containerWidth}) / 2);
  height: toRem(70);
  border: 2px solid $nandor;
  border-radius: toRem(10);
  box-shadow: 0px 4px 34px 3px rgba(0, 0, 0, 0.25);
  z-index: 10000;
}

.pie-chart,
.toolbar,
.saving-drawer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: $outerSpace;
}

// /////////////////////////////////////////////////////////////////// Pie Chart
@keyframes checkmark-check {
  0% {
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.pie-chart {
  padding: 0 1rem;
  border-top-left-radius: toRem(8);
  border-bottom-left-radius: toRem(8);
  .circle {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: toRem(30);
    height: toRem(30);
    border-radius: 50%;
    &.display-checkmark {
      .icon-checkmark {
        animation: checkmark-check 75ms 200ms cubic-bezier(0.4, 0, 0.23, 1) forwards;
      }
    }
  }
  .icon-checkmark {
    width: toRem(11);
    opacity: 0;
  }
}

// ///////////////////////////////////////////////////////////////////// Toolbar
.toolbar {
  padding-right: 1rem;
  border-top-right-radius: toRem(8);
  border-bottom-right-radius: toRem(8);
  &.saved-state-drawer-open {
    border-radius: 0;
  }
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

// ////////////////////////////////////////////////////////////////// Save state
@keyframes pending {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.saving-drawer {
  align-items: center;
  position: relative;
  width: toRem(75);
  border-left: 2px solid $mineralGreen;
  border-top-right-radius: toRem(8);
  border-bottom-right-radius: toRem(8);
  z-index: -1;
  overflow: hidden;
  cursor: default;
  transition: 150ms ease-out;
  &.hidden {
    margin-left: toRem(-75);
  }
  &.saving {
    .track {
      transform: translateX(0);
    }
    .icon.saving {
      opacity: 1;
    }
    .save-state-text {
      animation: pending 750ms linear infinite alternate-reverse;
    }
  }
  &.saved {
    .track {
      transform: translateX(calc(#{toRem(-18)} - 0.25rem));
    }
    .icon.saved {
      opacity: 1;
    }
  }
  &.restored {
    .track {
      transform: translateX(calc(#{toRem(-18 * 2)} - 0.75rem));
    }
    .icon.restored {
      opacity: 1;
    }
  }
  &.completed {
    cursor: pointer;
    .track {
      transform: translateX(calc(#{toRem(-18 * 3)} - 1.25rem));
    }
    .icon.github {
      opacity: 1;
    }
  }
}

.save-state-icons {
  position: relative;
  width: toRem(18);
  height: toRem(18);
}

.track {
  display: flex;
  flex-direction: row;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  transition: 150ms ease-in;
}

:deep(.icon) {
  height: 100%;
  opacity: 0;
  transition: 150ms ease-out;
  &:not(:last-child) {
    margin-right: 0.5rem;
  }
}

.save-state-text {
  font-size: toRem(13);
  line-height: 1;
  margin-top: toRem(8);
}
</style>
