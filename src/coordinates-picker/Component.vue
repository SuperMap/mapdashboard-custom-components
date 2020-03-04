<template>
  <div :style="fontStyle" class="custom-component-container">
    <h3 :style="{ color: textColor }">经纬度信息demo:</h3>
    <div v-if="lngLat" class="coordinate-holder">
      <div class="coordinate-item">
        <label> 触发模式：</label>
        <span>{{ optionsList[mode] }}</span>
      </div>
      <div class="coordinate-item">
        <label> 经度：</label>
        <span>{{ lngLat.lng }}</span>
      </div>
      <div class="coordinate-item">
        <label> 纬度：</label>
        <span>{{ lngLat.lat }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CoordinatesPicker',
  props: {
    mode: {
      type: String,
      default: 'mousemove'
    },
    fontSize: {
      type: String,
      default: '18px'
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
      optionsList: {
        click: '点击',
        mousemove: '鼠标移动'
      },
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
  watch: {
    mode() {
      this.triggerMapEvent();
    }
  },
  methods: {
    showCoors({ lngLat }) {
      this.lngLat = Object.assign({}, lngLat);
    },
    triggerMapEvent() {
      if (this.mode && this.map) {
        if (this.mode === 'click') {
          this.map.off('mousemove', this.showCoors);
        } else {
          this.map.off('click', this.showCoors);
        }
        this.map.on(this.mode, this.showCoors);
      }
    }
  },
  loaded(map) {
    this.map = map;
    map.on(this.mode, this.showCoors);
  },
  removed() {
    this.map.off(this.mode, this.showCoors);
    this.map = null;
    this.lngLat = null;
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
.coordinate-holder {
  padding: 0 10px;
}
.coordinate-item {
  margin: 10px 0;
  display: flex;
}

.coordinate-item label {
  width: 35%;
}

.coordinate-item span {
  flex: 1;
}
</style>
