<template>
  <IdentifierStatus v-slot="{ identifier }">

    <Identifier v-if="identifier" :identifier="identifier" />

    <ButtonA
      v-else
      :to="$config.githubOAuthLink"
      tag="a"
      class="auth-button">
      <GithubIcon class="icon-github" />
      <span>Login or Register</span>
    </ButtonA>

  </IdentifierStatus>
</template>

<script>
// ===================================================================== Imports
import ButtonA from '@/components/buttons/button-a'
import IdentifierStatus from '@/components/auth/identifier-status'
import Identifier from '@/components/auth/identifier'

import GithubIcon from '@/components/icons/github'

// ====================================================================== Export
export default {
  name: 'SiteHeader',

  components: {
    IdentifierStatus,
    Identifier,
    ButtonA,
    GithubIcon
  }
}
</script>

<style lang="scss" scoped>
// ////////////////////////////////////////////////////////////// Authentication
.auth-button {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
}

::v-deep .icon-github {
  width: 1rem;
  margin-right: 0.5rem;
  path {
    fill: $aztec;
  }
}
</style>
