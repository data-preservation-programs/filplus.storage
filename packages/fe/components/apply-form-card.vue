<template>
  <Card
    :icon-text="submitButtonText"
    :class="{ highlighted: applyFormHighlighted }"
    corner-position="bottom-right"
    icon="arrow"
    @clicked="submitForm">

    <div class="form-heading">
      {{ formHeading }}
    </div>

    <div class="form-subheading">
      {{ formSubheading }}
    </div>

    <form class="form">

      <FieldContainer
        :scaffold="formScaffold.total_datacap_size_range"
        :class="['range-field', { 'max-value-selected': maxValueSelected }]" />

      <div :class="['row', { 'tooltip-visible': maxValueSelected }]" :data-tooltip="tooltipText">
        <FieldContainer
          :scaffold="formScaffold.total_datacap_size_input"
          class="input-field" />
        <FieldContainer
          :scaffold="formScaffold.total_datacap_size_unit"
          class="select-field" />
      </div>

    </form>

  </Card>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import Card from '@/components/card'
import FieldContainer from '@/components/form/field-container'

// ====================================================================== Export
export default {
  name: 'ApplyFormCard',

  components: {
    Card,
    FieldContainer
  },

  data () {
    return {
      maxValueSelected: false
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      applyFormHighlighted: 'general/applyFormHighlighted',
      application: 'account/application'
    }),
    generalPageData () {
      return this.siteContent.general
    },
    form () {
      return this.siteContent.apply.page_content.form
    },
    formScaffold () {
      return this.form.scaffold
    },
    formHeading () {
      return this.form.heading
    },
    formSubheading () {
      return this.form.subheading
    },
    submitButtonText () {
      return this.form.submit_button_text
    },
    formsData () {
      return this.generalPageData.forms
    },
    formsThresholds () {
      return this.formsData.thresholds
    },
    submitThreshold15pib () {
      return this.formsThresholds.pib_15
    },
    tooltipText () {
      return this.formsData.tooltip_greater_than_15pib_text
    },
    rangeField () {
      return this.$field.get('total_datacap_size')
    }
  },

  watch: {
    rangeField (after) {
      if (after.value >= this.submitThreshold15pib && !this.maxValueSelected) {
        this.maxValueSelected = true
      } else if (after.value < this.submitThreshold15pib && this.maxValueSelected) {
        this.maxValueSelected = false
      }
    }
  },

  mounted () {
    this.$nextTick(() => {
      if (this.$route.query.highlight_form) {
        this.$highlightApplyForm()
      }
    })
  },

  methods: {
    async submitForm (e) {
      e.preventDefault()
      await this.$handleFormRedirection(this.rangeField.value, 'stage-apply', this.formsThresholds)
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.form-heading {
  font-size: toRem(24);
  line-height: leading(35, 24);
  font-weight: 500;
  @include mini {
    font-size: toRem(18);
  }
}

.form-subheading {
  margin-top: 0.5rem;
  margin-bottom: 2.5rem;
  font-size: 1rem;
  font-weight: 500;
}

.form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.field-container {
  :deep(.field-label) {
    display: none;
  }
}

:deep(.range-field) {
  width: 100%;
  margin-bottom: 2.5rem;
  &.max-value-selected {
    .position.pib-15 {
      .button-content {
        &:after {
          transition: 150ms ease-in;
          transform: scale(1);
          opacity: 1;
        }
      }
    }
  }
}

.row {
  display: flex;
  flex-direction: row;
  position: relative;
  &:hover {
    &[data-tooltip] {
      &:before,
      &:after {
        transform: none;
        opacity: 0;
      }
    }
  }
  &[data-tooltip] {
    &:before {
      top: 50%;
      left: 100%;
      transform: translate(toRem(13), -50%) rotate(-90deg);
      border-bottom-color: $blueRibbon;
    }
    &:after {
      top: 50%;
      left: 100%;
      width: 20rem;
      transform: translate(1.5rem, -50%);
      white-space: normal;
      border-radius: 0.25rem;
      font-size: toRem(14);
      font-weight: 500;
      padding: 0.25rem 0.75rem;
      background-color: $blueRibbon;
    }
  }
  &.tooltip-visible {
    &[data-tooltip] {
      &:before,
      &:after {
        opacity: 1;
      }
      &:before {
        transform: translate(toRem(5), -50%) rotate(-90deg);
      }
      &:after {
        transform: translate(1rem, -50%);
      }
    }
  }
}

.input-field {
  position: relative;
  width: 6.25rem;
  margin-right: 1.125rem;
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: calc(100% + 0.4375rem);
    width: 0.25rem;
    height: 2px;
    background-color: $titanWhite;
  }
}

.select-field {
  width: 3.75rem;
}
</style>
