<template>
  <div :class="['hubspot-opt-in-fields', { 'logged-out': !account, 'opted-in': optedIn }]">

    <div class="heading">
      {{ heading }}
    </div>

    <div class="message" v-html="description" />

    <LoginButton v-if="!account" />

    <div :class="['form', { hidden: !account }]">

      <div class="row">
        <FieldContainer
          :scaffold="formScaffold.hubspot_opt_in_first_name"
          :force-disabled="optedIn" />
        <FieldContainer
          :scaffold="formScaffold.hubspot_opt_in_last_name"
          :force-disabled="optedIn" />
      </div>

      <FieldContainer
        :scaffold="formScaffold.hubspot_opt_in_email"
        :force-disabled="optedIn" />

    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import LoginButton from '@/components/navigation/button-login'
import FieldContainer from '@/components/form/field-container'

// ====================================================================== Export
export default {
  name: 'HubspotOptInFields',

  components: {
    LoginButton,
    FieldContainer
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      account: 'auth/account'
    }),
    optedIn () {
      return this.account.hubspotOptIn
    },
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
      const optedIn = this.optedIn
      const description = this.content.description
      if (!this.account) { return description.loggedOut }
      return optedIn ? description.optedIn : description.notOptedIn
    }
  },

  watch: {
    account (incoming) {
      this.$nextTick(async () => {
        if (incoming) {
          await this.setHubspotOptInData(incoming)
          this.setFieldValues(incoming)
        }
      })
    }
  },

  methods: {
    ...mapActions({
      setHubspotOptInData: 'account/setHubspotOptInData'
    }),
    setFieldValues (account) {
      const email = !account.hubspotOptIn && account.githubEmail ? account.githubEmail : account.hubspotOptInEmail
      this.$nuxt.$emit('fieldUpdateValue', { fieldId: 'hubspot_opt_in_first_name', value: account.hubspotOptInFirstName || '' })
      this.$nuxt.$emit('fieldUpdateValue', { fieldId: 'hubspot_opt_in_last_name', value: account.hubspotOptInLastName || '' })
      this.$nuxt.$emit('fieldUpdateValue', { fieldId: 'hubspot_opt_in_email', value: email || '' })
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.hubspot-opt-in-fields {
  background-color: rgba($nandor, 0.2);
  padding: 1.5rem 2rem;
  border-radius: 1rem;
  margin-bottom: 3.5rem;
  &.logged-out,
  &.opted-in {
    :deep(.field-container) {
      opacity: 0.5;
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

.form {
  &.hidden {
    display: none;
  }
}

.field-container {
  margin-bottom: 0.75rem;
  &:not(:last-child) {
    margin-bottom: 3.5rem;
  }
}
</style>
