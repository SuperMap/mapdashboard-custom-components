<template>
  <div :style="fontStyle" class="custom-component-container">
    <h3 :style="{ color: textColor }">{{ $t('CoordinatesPosition.title') }}</h3>
    <a-button type="primary" :style="{ fontSize }" @click="togglePoints">{{ $t('CoordinatesPosition.btnText') }}</a-button>
  </div>
</template>

<script>
export default {
  name: 'CoordinatesPosition',
  props: {
    fontSize: {
      type: String,
      default: '14px'
    },
    textColor: {
      type: String,
      default: '#fff'
    },
    background: {
      type: String,
      default: '#333'
    }
  },
  data() {
    return {
      lngLat: null,
      pointsLen: 5
    };
  },
  computed: {
    fontStyle() {
      const style = {};
      const { textColor, background, fontSize } = this;
      if (textColor) {
        style.color = textColor;
      }
      if (background) {
        style.background = background;
      }
      if (fontSize) {
        style.fontSize = fontSize;
      }
      return style;
    }
  },
  methods: {
    togglePoints() {
      if (!this.map) {
        this.noneMapTip();
        return;
      }
      const center = [-180 + Math.random() * 360, -85 + Math.random() * 170];
      this.map.flyTo({
        center,
        essential: true
      });
    },
    noneMapTip() {
      alert(this.$t('CoordinatesPosition.unassociatedMap'));
    }
  },
  loaded(map) {
    this.map = map;
  },
  removed() {
    this.map = null;
  }
};
</script>

<style lang="css" scoped>
.custom-component-container {
  padding: 8px;
}

h3 {
  border-bottom: 2px solid #1890ff;
  display: inline-block;
  padding-bottom: 6px;
  font-weight: 600;
}

button {
  display: block;
  margin-top: 10px;
}
</style>
