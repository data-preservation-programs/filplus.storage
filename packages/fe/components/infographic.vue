<template>
  <div :class="['infographic-container', { 'with-fil-plus': withFilPlus }]">
    <div class="title-wrapper">
      <button
        :class="['infographic-toggle', { 'with-fil-plus': withFilPlus }]"
        type="button"
        @click="toggleInfographic">
        <span class="toggle-switch" />
      </button>

      <h2 class="title">
        {{ title }}
      </h2>

    </div>

    <svg
      viewBox="0 0 905 655"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="infographic">
      <g class="animating-content">
        <image
          x="655"
          y="309"
          width="216"
          height="215"
          href="../assets/images/infographic/storage-provider.png"
          class="storage-provider" />
        <text class="image-label">
          <tspan x="668.258" y="556.4">
            Storage Provider (SP)
          </tspan>
        </text>
        <text class="text">
          <tspan x="643.219" y="591.92">
            Someone in the Filecoin  network
          </tspan><tspan x="675.914" y="615.92">
            providing storage space
          </tspan>
        </text>
        <image
          x="25"
          y="291"
          width="215"
          height="215"
          href="../assets/images/infographic/data-client.png"
          class="data-client" />
        <text class="image-label">
          <tspan x="75.4375" y="556.4">
            Data Client
          </tspan>
        </text>
        <text class="text">
          <tspan x="45.375" y="590.92">
            Someone who wants to
          </tspan><tspan x="51.8906" y="614.92">
            store data on Filecoin
          </tspan>
        </text>
        <image
          x="743"
          y="276"
          width="30"
          height="34"
          href="../assets/images/infographic/down-arrow.png"
          class="down-arrow" />
        <image
          x="268"
          y="396.125"
          width="394"
          height="55"
          href="../assets/images/infographic/right-arrow.png"
          class="right-arrow" />
        <text class="text without-fil-plus-content">
          <tspan x="412.156" y="458.04">
            stores data
          </tspan>
        </text>
        <text class="text with-fil-plus-content">
          <tspan x="322.414" y="463.42">
            stores data using allocated DataCap
          </tspan>
        </text>
      </g>

      <g class="without-fil-plus-content">
        <text class="text">
          <tspan x="640.023" y="19.92">
            SP gets rewards from the network
          </tspan><tspan x="683.727" y="43.92">
            for successful storage
          </tspan>
        </text>
        <g class="small-coins">
          <image
            x="734.573"
            y="92.583"
            width="45"
            height="45"
            href="../assets/images/infographic/small-coin.png" />
          <image
            x="759.681"
            y="58"
            width="45"
            height="45"
            transform="rotate(18.2891 769.681 118)"
            href="../assets/images/infographic/small-coin.png" />
          <image
            x="747.572"
            y="107.719"
            width="45"
            height="45"
            transform="rotate(-38.2219 696.572 156.719)"
            href="../assets/images/infographic/small-coin.png" />
        </g>
      </g>

      <g class="with-fil-plus-content">
        <text class="image-label">
          <tspan x="424.182" y="341.4">
            Notary
          </tspan>
        </text>
        <text class="text">
          <tspan x="166.32" y="264.42">
            requests DataCap
          </tspan>
        </text>
        <text class="text">
          <tspan x="222.336" y="194.42">
            approves DataCap
          </tspan>
        </text>
        <text class="text">
          <tspan x="624.547" y="18.045">
            SP gets significantly more reward from the network
          </tspan>
          <tspan x="639.242" y="42.045">
            the network for successful storage
          </tspan>
        </text>
        <image
          x="325"
          y="128"
          width="262"
          height="191"
          href="../assets/images/infographic/big-coin.png"
          class="big-coin" />
        <image
          x="97"
          y="191.125"
          width="262"
          height="93"
          href="../assets/images/infographic/down-right-arrow.png"
          class="down-right-arrow" />
        <g class="small-coins">
          <image
            x="734.573"
            y="214.963"
            width="45"
            height="45"
            href="../assets/images/infographic/small-coin.png"
            class="small-coin" />
          <image
            x="770.078"
            y="148.645"
            width="45"
            height="45"
            transform="rotate(-26.33 770.078 148.645)"
            href="../assets/images/infographic/small-coin.png"
            class="small-coin" />
          <image
            x="774.466"
            y="87.4828"
            width="45"
            height="45"
            transform="rotate(14.1649 774.466 87.4828)"
            href="../assets/images/infographic/small-coin.png"
            class="small-coin" />
          <image
            x="807"
            y="168"
            width="45"
            height="45"
            href="../assets/images/infographic/small-coin.png"
            class="small-coin" />
          <image
            x="729.573"
            y="164.963"
            width="45"
            height="45"
            href="../assets/images/infographic/small-coin.png"
            class="small-coin" />
          <image
            x="742.573"
            y="130.963"
            width="45"
            height="45"
            href="../assets/images/infographic/small-coin.png"
            class="small-coin" />
          <image
            x="685.423"
            y="163.423"
            width="45"
            height="45"
            transform="rotate(-16.8415 685.423 163.423)"
            href="../assets/images/infographic/small-coin.png"
            class="small-coin" />
          <image
            x="700.569"
            y="130.756"
            width="45"
            height="45"
            transform="rotate(-29.492 700.569 130.756)"
            href="../assets/images/infographic/small-coin.png"
            class="small-coin" />
          <image
            x="644"
            y="139.788"
            width="45"
            height="45"
            transform="rotate(-15.6857 644 139.788)"
            href="../assets/images/infographic/small-coin.png"
            class="small-coin" />
          <image
            x="782.476"
            y="243.812"
            width="45"
            height="45"
            transform="rotate(-49.0083 782.476 243.812)"
            href="../assets/images/infographic/small-coin.png"
            class="small-coin" />
          <image
            x="803"
            y="108"
            width="45"
            height="45"
            href="../assets/images/infographic/small-coin.png"
            class="small-coin" />
          <image
            x="709.735"
            y="81.716"
            width="45"
            height="45"
            transform="rotate(-28.1525 709.735 81.716)"
            href="../assets/images/infographic/small-coin.png"
            class="small-coin" />
          <image
            x="675"
            y="216.005"
            width="45"
            height="45"
            transform="rotate(-5.29554 675 216.005)"
            href="../assets/images/infographic/small-coin.png"
            class="small-coin" />
          <image
            x="679.573"
            y="92.9629"
            width="45"
            height="45"
            href="../assets/images/infographic/small-coin.png"
            class="small-coin" />
          <image
            x="769.681"
            y="173.38"
            width="45"
            height="45"
            transform="rotate(18.2891 769.681 173.38)"
            href="../assets/images/infographic/small-coin.png"
            class="small-coin" />
          <image
            x="696.572"
            y="212.099"
            width="45"
            height="45"
            z-index="10"
            transform="rotate(-38.2219 696.572 212.099)"
            href="../assets/images/infographic/small-coin.png"
            class="small-coin" />
        </g>
      </g>

      <text class="text">
        <tspan x="0" y="78.42">
          Toggle back to see how storage works without Filecoin Plus
        </tspan>
      </text>

    </svg>

  </div>
</template>

<script>
export default {
  name: 'Infographic',

  data () {
    return {
      withFilPlus: true
    }
  },

  computed: {
    title () {
      return this.withFilPlus ? 'With Filecoin Plus' : 'Without Filecoin Plus'
    }
  },

  methods: {
    toggleInfographic () {
      this.withFilPlus = !this.withFilPlus
    }
  }

}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.infographic-container {
  border: toRem(35) solid;
  border-image: url(../assets/images/infographic-border.svg) 30;
  width: 100%;
  padding: toRem(30);
  &.with-fil-plus{
    .animating-content {
      transform: translateY(0);
    }
    .with-fil-plus-content {
      opacity: 1;
    }
    .without-fil-plus-content {
      opacity: 0;
    }
  }
}

.animating-content {
  transform: translateY(-7rem);
  transition: transform 250ms ease-in;
}

.with-fil-plus-content {
  opacity: 0;
  transition: opacity 250ms ease-in;
}

.without-fil-plus-content {
  opacity: 1;
  transition: opacity 250ms ease-in;

}

.title-wrapper {
  display: flex;
  align-items: center;
}

.title {
  font-size: toRem(35);
  font-weight: 500;
}

.text {
  fill: white;
  font-size: toRem(16);
  font-style: italic;
}

.image-label {
  fill: white;
  font-size: toRem(20);
  font-weight: 500;
}
// ////////////////////////////////////////////////////////////////////// Border
.border {
  position: absolute;
  width: 100%;
}

// ////////////////////////////////////////////////////////////////////// Toggle
.infographic-toggle {
  display: flex;
  align-items: center;
  opacity: 0.6;
  width: toRem(80);
  height: toRem(40);
  border-radius: toRem(70);
  margin-right: toRem(25);
  background-color: $mineralGreen;
  border: 2px solid $axolotl;
  transition: all 250ms ease-in;
  &.with-fil-plus {
    border-color: $greenYellow;
    .toggle-switch {
      transform: translateX(2.5rem);
      background-color: $greenYellow;
      border-color: $greenYellow;
      box-shadow: inset -3px -4px 4px #CCFD7C, inset 3px 4px 4px #9AD933;
    }
  }
}

.toggle-switch {
  display: block;
  width: toRem(27);
  height: toRem(27);
  border-radius: 50%;
  background-color: $axolotl;
  border: 3px solid $axolotl;
  margin: 0 toRem(5);
  box-shadow: inset -3px -4px 4px #557355, inset 3px 4px 4px rgba(0, 0, 0, 0.25);
  transition: all 250ms ease-in;
}

</style>
