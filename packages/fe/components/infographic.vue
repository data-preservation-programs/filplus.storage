<template>
  <div :class="['infographic-container', { 'with-fil-plus': withFilPlus }]">
    <div class="title-wrapper">
      <h2 class="title">
        With Fil+
      </h2>
      <button
        :class="['infographic-toggle', { 'with-fil-plus': withFilPlus }]"
        type="button"
        @click="toggleInfographic">
        <span class="toggle-switch" />
      </button>

      <h2 class="title">
        Without Fil+
      </h2>

    </div>

    <svg
      viewBox="0 0 905 655"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="infographic browser">
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
            href="../assets/images/infographic/mobile-small-coin.png" />
          <image
            x="759.681"
            y="58"
            width="45"
            height="45"
            transform="rotate(18.2891 769.681 118)"
            href="../assets/images/infographic/mobile-small-coin.png" />
          <image
            x="747.572"
            y="107.719"
            width="45"
            height="45"
            transform="rotate(-38.2219 696.572 156.719)"
            href="../assets/images/infographic/mobile-small-coin.png" />
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
            SP gets significantly more reward from
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
            href="../assets/images/infographic/mobile-small-coin.png"
            class="small-coin" />
          <image
            x="770.078"
            y="148.645"
            width="45"
            height="45"
            transform="rotate(-26.33 770.078 148.645)"
            href="../assets/images/infographic/mobile-small-coin.png"
            class="small-coin" />
          <image
            x="774.466"
            y="87.4828"
            width="45"
            height="45"
            transform="rotate(14.1649 774.466 87.4828)"
            href="../assets/images/infographic/mobile-small-coin.png"
            class="small-coin" />
          <image
            x="807"
            y="168"
            width="45"
            height="45"
            href="../assets/images/infographic/mobile-small-coin.png"
            class="small-coin" />
          <image
            x="729.573"
            y="164.963"
            width="45"
            height="45"
            href="../assets/images/infographic/mobile-small-coin.png"
            class="small-coin" />
          <image
            x="742.573"
            y="130.963"
            width="45"
            height="45"
            href="../assets/images/infographic/mobile-small-coin.png"
            class="small-coin" />
          <image
            x="685.423"
            y="163.423"
            width="45"
            height="45"
            transform="rotate(-16.8415 685.423 163.423)"
            href="../assets/images/infographic/mobile-small-coin.png"
            class="small-coin" />
          <image
            x="700.569"
            y="130.756"
            width="45"
            height="45"
            transform="rotate(-29.492 700.569 130.756)"
            href="../assets/images/infographic/mobile-small-coin.png"
            class="small-coin" />
          <image
            x="644"
            y="139.788"
            width="45"
            height="45"
            transform="rotate(-15.6857 644 139.788)"
            href="../assets/images/infographic/mobile-small-coin.png"
            class="small-coin" />
          <image
            x="782.476"
            y="243.812"
            width="45"
            height="45"
            transform="rotate(-49.0083 782.476 243.812)"
            href="../assets/images/infographic/mobile-small-coin.png"
            class="small-coin" />
          <image
            x="803"
            y="108"
            width="45"
            height="45"
            href="../assets/images/infographic/mobile-small-coin.png"
            class="small-coin" />
          <image
            x="709.735"
            y="81.716"
            width="45"
            height="45"
            transform="rotate(-28.1525 709.735 81.716)"
            href="../assets/images/infographic/mobile-small-coin.png"
            class="small-coin" />
          <image
            x="675"
            y="216.005"
            width="45"
            height="45"
            transform="rotate(-5.29554 675 216.005)"
            href="../assets/images/infographic/mobile-small-coin.png"
            class="small-coin" />
          <image
            x="679.573"
            y="92.9629"
            width="45"
            height="45"
            href="../assets/images/infographic/mobile-small-coin.png"
            class="small-coin" />
          <image
            x="769.681"
            y="173.38"
            width="45"
            height="45"
            transform="rotate(18.2891 769.681 173.38)"
            href="../assets/images/infographic/mobile-small-coin.png"
            class="small-coin" />
          <image
            x="696.572"
            y="212.099"
            width="45"
            height="45"
            z-index="10"
            transform="rotate(-38.2219 696.572 212.099)"
            href="../assets/images/infographic/mobile-small-coin.png"
            class="small-coin" />
        </g>
      </g>

      <text class="text">
        <tspan x="0" y="78.42">
          Toggle back to see how storage works without Filecoin Plus
        </tspan>
      </text>

    </svg>

    <svg
      viewBox="0 0 317 344"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="infographic mobile">
      <g class="animating-content">
        <image
          x="217"
          y="179.205"
          width="79"
          height="78"
          href="../assets/images/infographic/mobile-storage-provider.png"
          class="storage-provider" />
        <image
          x="4"
          y="170.205"
          width="83"
          height="83"
          href="../assets/images/infographic/mobile-data-client.png"
          class="data-client" />
        <text class="text">
          <tspan x="126.879" y="243.451">
            stores data
          </tspan>
        </text>
        </text>
        <text class="text">
          <tspan x="14.1753" y="291.775">
            Someone who
          </tspan><tspan x="2.49854" y="308.775">
            wants to store data
          </tspan><tspan x="23.0752" y="325.775">
            on Filecoin
          </tspan>
        </text>
        <text class="image-label">
          <tspan x="15.6641" y="272.1">
            Data Client
          </tspan>
        </text>
        <text class="image-label">
          <tspan x="187.486" y="273.1">
            Storage Provider (SP)
          </tspan>
        </text>
        <text class="text">
          <tspan x="192.56" y="293.775">
            Someone in the Filecoin
          </tspan><tspan x="208.662" y="310.775">
            network providing
          </tspan><tspan x="217.336" y="327.775">
            storage space
          </tspan>
        </text>
        <image
          x="249"
          y="172"
          width="14"
          height="13"
          href="../assets/images/infographic/mobile-down-arrow.png"
          class="down-arrow" />
        <image
          x="105"
          y="218.205"
          width="96"
          height="15"
          href="../assets/images/infographic/mobile-right-arrow.png"
          class="right-arrow" />
      </g>
      <text class="text">
        <tspan x="9" y="12.57">
          Toggle back to see how
        </tspan><tspan x="9" y="29.57">
          storage works with Filecoin
        </tspan><tspan x="9" y="46.57">
          Plus
        </tspan>
      </text>
      <text class="text">
        <tspan x="196.924" y="56.57">
          SP gets rewards from
        </tspan><tspan x="213.284" y="73.57">
          the network for
        </tspan><tspan x="203.079" y="90.57">
          successful storage
        </tspan>
      </text>
      <g class="with-fil-plus-content">
        <image
          x="15"
          y="105"
          width="86"
          height="31"
          href="../assets/images/infographic/mobile-down-right-arrow.png"
          class="down-right-arrow" />
        <image
          x="101"
          y="83"
          width="96"
          height="69"
          href="../assets/images/infographic/mobile-big-coin.png"
          class="big-coin" />
        <text class="text">
          <tspan x="57" y="90.7">
            approves &#10;
          </tspan><tspan x="57" y="102.7">
            DataCap
          </tspan>
        </text>
        <text class="text">
          <tspan x="33" y="135.7">
            Requests&#10;
          </tspan><tspan x="33" y="147.7">
            DataCap
          </tspan>
        </text>
        <text class="image-label">
          <tspan x="128.143" y="168.81">
            Notary
          </tspan>
        </text>
        <g class="small-coins">
          <image
            x="246.087"
            y="149.905"
            width="15.2523"
            height="15.2523"
            href="../assets/images/infographic/mobile-small-coin.png"
            class="small-coin" />
          <image
            x="256.705"
            y="130.071"
            width="14.9533"
            height="14.9533"
            transform="rotate(-26.33 256.705 130.071)"
            href="../assets/images/infographic/mobile-small-coin.png"
            class="small-coin" />
          <image
            x="258.018"
            y="111.78"
            width="15.2523"
            height="14.9533"
            transform="rotate(14.1649 258.018 111.78)"
            href="../assets/images/infographic/mobile-small-coin.png"
            class="small-coin" />
          <image
            x="267.747"
            y="135.86"
            width="15.2523"
            height="14.9533"
            href="../assets/images/infographic/mobile-small-coin.png"
            class="small-coin" />
          <image
            x="244.593"
            y="134.951"
            width="15.2523"
            height="14.9533"
            href="../assets/images/infographic/mobile-small-coin.png"
            class="small-coin" />
          <image
            x="248.479"
            y="124.783"
            width="15.2523"
            height="15.2523"
            href="../assets/images/infographic/mobile-small-coin.png"
            class="small-coin" />
          <image
            x="231.389"
            y="134.491"
            width="15.2523"
            height="14.9533"
            transform="rotate(-16.8415 231.389 134.491)"
            href="../assets/images/infographic/mobile-small-coin.png"
            class="small-coin" />
          <image
            x="235.919"
            y="124.721"
            width="15.2523"
            height="14.9533"
            transform="rotate(-29.492 235.919 124.721)"
            href="../assets/images/infographic/mobile-small-coin.png"
            class="small-coin" />
          <image
            x="219"
            y="127.423"
            width="15.2523"
            height="14.9533"
            transform="rotate(-15.6857 219 127.423)"
            href="../assets/images/infographic/mobile-small-coin.png"
            class="small-coin" />
          <image
            x="260.413"
            y="158.532"
            width="15.2523"
            height="14.9533"
            transform="rotate(-49.0083 260.413 158.532)"
            href="../assets/images/infographic/mobile-small-coin.png"
            class="small-coin" />
          <image
            x="266.551"
            y="117.916"
            width="15.2523"
            height="14.9533"
            href="../assets/images/infographic/mobile-small-coin.png"
            class="small-coin" />
          <image
            x="238.66"
            y="110.055"
            width="14.9533"
            height="14.9533"
            transform="rotate(-28.1525 238.66 110.055)"
            href="../assets/images/infographic/mobile-small-coin.png"
            class="small-coin" />
          <image
            x="228.271"
            y="150.216"
            width="14.9533"
            height="14.9533"
            transform="rotate(-5.29554 228.271 150.216)"
            href="../assets/images/infographic/mobile-small-coin.png"
            class="small-coin" />
          <image
            x="229.639"
            y="113.419"
            width="14.9533"
            height="14.9533"
            href="../assets/images/infographic/mobile-small-coin.png"
            class="small-coin" />
          <image
            x="256.587"
            y="137.469"
            width="14.9533"
            height="14.9533"
            transform="rotate(18.2891 256.587 137.469)"
            href="../assets/images/infographic/mobile-small-coin.png"
            class="small-coin" />
          <image
            x="234.723"
            y="149.048"
            width="15.2523"
            height="14.9533"
            transform="rotate(-38.2219 234.723 149.048)"
            href="../assets/images/infographic/mobile-small-coin.png"
            class="small-coin" />
        </g>
      </g>
      <g class="small-coins without-fil-plus-content">
        <image
          x="245.133"
          y="115.83"
          width="15.925"
          height="15.925"
          href="../assets/images/infographic/mobile-small-coin.png"
          class="small-coin" />
        <image
          x="255.094"
          y="96.8457"
          width="15.6128"
          height="15.6128"
          transform="rotate(18.2891 255.094 92.8457)"
          href="../assets/images/infographic/mobile-small-coin.png"
          class="small-coin" />
        <image
          x="278.215"
          y="100.79"
          width="15.5842"
          height="15.4635"
          transform="rotate(90 260.215 89.79)"
          href="../assets/images/infographic/mobile-small-coin.png"
          class="small-coin" />
      </g>
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
  position: relative;
  border: toRem(35) solid;
  border-image: url(../assets/images/infographic-border.svg) 30;
  height: clamp(toRem(480), vw(755px), toRem(755));
  width: 100%;
  transition: all 250ms ease-in;
  padding: min(toRem(30), 2vw);
  &.with-fil-plus {
    height: clamp(toRem(565), vw(900px), toRem(850));
    transition: all 250ms ease-in;
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
  @include large {
  border-image-slice: 36;
  }
  @include small {
    height: auto;
    border: none;
    padding: 0;
    &.with-fil-plus {
      height: auto;
    }
  }
}

.infographic.browser {
  @include small {
    display: none;
  }
}

.infographic.mobile {
  display: none;
  @include small {
    display: block;
  }
}

.animating-content {
  transform: translateY(-7rem);
  transition: transform 250ms ease-in;
  @include small {
    transform: translateY(-2rem);
  }
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
  @include small {
    margin-left: 1rem;
    padding-bottom: .5rem;
  }
  @include mini {
    margin-left: 0.5rem;
  }
}

.title {
  white-space: nowrap;
  font-size: toRem(35);
  font-weight: 500;
  @include mini {
    font-size: toRem(18);
  }
  @include tiny {
    font-size: toRem(14);
  }
}

.text {
  fill: white;
  font-size: toRem(16);
  font-style: italic;
  @include small {
    font-size: toRem(10);
  }
}

.image-label {
  fill: white;
  font-size: toRem(20);
  font-weight: 500;
  @include small {
    font-size: toRem(13);
  }
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
  margin: 0 toRem(15);
  background-color: $mineralGreen;
  border: 2px solid $greenYellow;
  transition: all 250ms ease-in;
  &.with-fil-plus {
    .toggle-switch {
      transform: translateX(0);
    }
  }
  @include mini {
    width: toRem(60);
    height: toRem(30);
  }
}

.toggle-switch {
  display: block;
  width: toRem(27);
  height: toRem(27);
  border-radius: 50%;
  background-color: $greenYellow;
  border: 3px solid $greenYellow;
  margin: 0 toRem(5);
  transform: translateX(2.5rem);
  box-shadow: inset -3px -4px 4px #CCFD7C, inset 3px 4px 4px #9AD933;
  transition: all 250ms ease-in;
  @include mini {
    width: toRem(20);
    height: toRem(20);
    margin: 0 toRem(2);
    transform: translateX(toRem(32));
  }
}

</style>
