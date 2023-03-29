<template>
  <div class="nav-toggle-wrapper">

    <div class="squiggle-container"></div>

    <div class="button-list">
      <Button
        tag="button"
        @clicked="toggleModal">
        <div :class="['nav-detail', { active: modal }]">
          <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              stroke="white"
              stroke-width="2"
              class="top-line" />
            <path
              stroke="white"
              stroke-width="2"
              class="bottom-line" />
          </svg>
        </div>
      </Button>
    </div>

    <NavModal
      :open="modal"
      class="nav-modal">
      <div class="inner-wrapper">

        <Squigglie
          :percent-left="80"
          orientation="up"
          color="nandor" />

        <div class="overflow-container">
          <nav id="site-nav-mobile">

            <div class="cta-button-list">

              <AuthButton />

              <ButtonA
                v-if="cta"
                :to="cta.href"
                tag="button"
                class="site-nav-cta"
                @clicked="highlightApplyForm()">
                <div class="text" v-html="cta.label" />
              </ButtonA>

            </div>

            <ButtonX
              v-for="(link, index) in links"
              :key="`mobile-nav-link-${index}`"
              tag="nuxt-link"
              :to="link.href"
              :selected="isRouteCurrent(link.href)"
              class="site-mobile-nav-link"
              @click.native="toggleModal">
              {{ link.label }}
            </ButtonX>

          </nav>
        </div>

        <Squigglie
          :percent-left="20"
          orientation="down"
          anchor="bottom"
          color="nandor" />

        <div class="cta-wrapper">
          <CircleText class="cta-spinner" />
          <Arrow class="cta-arrow" />
        </div>

      </div>
    </NavModal>

  </div>
</template>

<script>
// ====================================================================== Import
import AuthButton from '@/components/auth-button'
import Button from '@/modules/button/components/button'
import ButtonA from '@/components/buttons/button-a'
import ButtonX from '@/components/buttons/button-x'
import NavModal from '@/components/nav-modal'
import Squigglie from '@/components/squigglie'
import CircleText from '@/components/icons/circle-text'
import Arrow from '@/components/icons/arrow'

// ====================================================================== Export
export default {
  name: 'MobileNav',

  components: {
    AuthButton,
    Button,
    ButtonA,
    ButtonX,
    NavModal,
    Squigglie,
    CircleText,
    Arrow
  },

  props: {
    links: {
      type: Array,
      required: true
    },
    cta: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      modal: false
    }
  },

  methods: {
    toggleModal () {
      this.modal = !this.modal
    },
    isRouteCurrent (href) {
      const route = this.$route
      if (route.path === href) { return true }
      return false
    },
    highlightApplyForm () {
      this.toggleModal()
      this.$highlightApplyForm()
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.nav-toggle-wrapper {
  position: relative;
  height: toRem(60);
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

// ////////////////////////////////////////////////////////////////// Squigglies
.squiggle-container {
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100% + 100vw * 0.041665);
  height: 100%;
  overflow: hidden;
  &:before,
  &:after {
    content: '';
    position: absolute;
    right: 0;
    width: 1200px;
    height: 18px;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='1862' height='18' viewBox='0 0 1862 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M 0 1 H 565 C 565 1 566 1 566 1 C 567 1 571 1 573 1 C 581 3 581 14 589 14 C 597 14 598 3 606 1 C 608 1 612 1 613 1 C 614 1 614 1 614 1 H 1198' stroke='white' stroke-opacity='0.3' stroke-width='2'/%3e%3c/svg%3e ");
  }
  &:before {
    top: 0;
    transform: translateX(480px);
  }
  &:after {
    bottom: 0;
    transform: scaleY(-1) translateX(570px);
  }
}

// ////////////////////////////////////////////////////////////////// Nav Toggle
.button-list {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

:deep(.button) {
  position: relative;
  padding: 0.125rem 0.125rem 0.125rem 1.5rem;
  z-index: 10000;
  @include medium {
    margin-right: 1.125rem;
  }
  @include small {
    margin-right: 1.75rem;
  }
  @include mini {
    margin-right: 2.25rem;
  }
  @include tiny {
    margin-right: 2.75rem;
  }
}

.nav-detail {
  position: relative;
  display: flex;
  &:before,
  &:after {
    content: '';
    position: absolute;
    top: 0.25rem;
    height: 0.5rem;
    border-top: 2px solid white;
    border-bottom: 2px solid white;
    transition: all 200ms ease;
  }
  &:before {
    width: 0.5rem;
    left: calc(-0.75rem + 1px);
  }
  &:after {
    width: 0.25rem;
    left: calc(-1.25rem + 1px);
  }
  .top-line,
  .bottom-line {
    transition: all 200ms ease;
  }
  .top-line {
    d:path('M 15 5 L 1 5')
  }
  .bottom-line {
    d:path('M 15 15 L 1 15')
  }
  svg {
    transition: all 200ms ease;
    transform: none;
  }
  &.active {
    svg {
      transform: translateX(-5px);
    }
    .top-line {
      d:path('M 20 1 L 1 20')
    }
    .bottom-line {
      d:path('M 20 20 L 1 1')
    }
    &:before,
    &:after {
      width: 0;
    }
  }
}

// /////////////////////////////////////////////////////////////////////// Modal
.nav-modal {
  background-color: $aztec;
  padding-top: 11.125rem;
  padding-bottom: toRem(228);
}

.inner-wrapper {
  position: relative;
  height: 100%;
}

.overflow-container {
  width: 100%;
  height: 100%;
  overflow: scroll;
}

#site-nav-mobile {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
}

.cta-button-list {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding: 1.875rem 2rem;
}

.auth-button {
  :deep(.button.login-button) {
    margin-right: 0;
  }
}

.button.site-nav-cta {
  padding: 0.375rem 1rem;
  margin-right: 0;
}

.site-mobile-nav-link {
  padding: toRem(30) toRem(43);
  width: 100%;
  font-size: 1.125rem;
  border-bottom: 2px solid $nandor;
  &:last-child {
    border-bottom: none;
  }
}

.cta-wrapper {
  position: absolute;
  top: calc(100% + 52px);
  right: toRem(40);
  width: toRem(130);
}

.cta-spinner {
  position: relative;
  width: 100%;
  animation: spinning 15s infinite linear reverse;
}

.cta-arrow {
  position: absolute;
  top: calc(50% - 4px);
  left: calc(50% + 1px);
  transform: translate(-50%, -50%);
}

@keyframes spinning {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
