<template>
  <div :class="['hubspot-opt-in-fields', { 'opted-in': optedIn }]">

    <template v-if="optedIn">
      <div class="heading">
        {{ heading }}
      </div>
      <div class="message">
        {{ description }}
      </div>
    </template>

    <FieldContainer
      :scaffold="formScaffold.hubspot_opt_in"
      :force-disabled="optedIn"
      field-key="hubspot_opt_in"
      form-id="filplus_application"
      class="checkbox" />

    <div class="row">
      <FieldContainer
        :scaffold="formScaffold.hubspot_opt_in_first_name"
        :force-disabled="optedIn"
        field-key="hubspot_opt_in_first_name"
        form-id="filplus_application" />
      <FieldContainer
        :scaffold="formScaffold.hubspot_opt_in_last_name"
        :force-disabled="optedIn"
        field-key="hubspot_opt_in_last_name"
        form-id="filplus_application" />
    </div>

    <FieldContainer
      :scaffold="formScaffold.hubspot_opt_in_email"
      :force-disabled="optedIn"
      field-key="hubspot_opt_in_email"
      form-id="filplus_application" />

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import FieldContainer from '@/components/form/field-container'

// ====================================================================== Export
export default {
  name: 'HubspotOptInFields',

  components: {
    FieldContainer
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      account: 'auth/account'
    }),
    content () {
      return this.siteContent.general.hubspot
    },
    formScaffold () {
      return this.content.opt_in_fields
    },
    heading () {
      return this.content.opted_in_heading
    },
    description () {
      return this.content.opted_in_description
    },
    optedIn () {
      return this.account.hubspotOptIn
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.hubspot-opt-in-fields {
  &.opted-in {
    :deep(.field-container) {
      opacity: 0.5;
      &.checkbox {
        .field-label {
          display: none;
        }
      }
    }
  }
}

.row {
  display: flex;
  flex-direction: row;
  .field-container {
    flex: 1;
    &:first-child {
      margin-right: 2rem;
    }
  }
}

.heading {
  font-size: 1.25rem;
  font-weight: 500;
}

.message {
  margin-top: 0.5rem;
  margin-bottom: 2rem;
}

.field-container {
  margin-bottom: 3.5rem;
}
</style>
