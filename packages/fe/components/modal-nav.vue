<template>
  <div class="nav-toggle-wrapper">

    <div class="squiggle-container"></div>

    <div class="button-list">
      <ButtonX
        tag="button">
        <div class="nav-detail"></div>
      </ButtonX>
    </div>

    <nav id="site-nav-mobile">

    </nav>

  </div>
</template>

<script>
// ====================================================================== Import
import ButtonX from '@/components/buttons/button-x'

// ====================================================================== Export
export default {
  name: 'ModalNav'
}
</script>

<style lang="scss" scoped>
.nav-toggle-wrapper {
  position: relative;
  height: toRem(60);
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

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

.button-list {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.nav-detail {
  position: relative;
  left: -1.25rem;
  top: 1px;
  width: 1rem;
  height: 0.625rem;
  border-top: 2px solid white;
  border-bottom: 2px solid white;
  &:before,
  &:after {
    content: '';
    position: absolute;
    top: -2px;
    height: 100%;
    border: inherit;
  }
  &:before {
    width: 0.5rem;
    left: -0.75rem;
  }
  &:after {
    width: 0.25rem;
    left: -1.25rem;
  }
}
</style>
