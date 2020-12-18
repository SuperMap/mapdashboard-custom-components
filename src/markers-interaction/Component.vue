<template>
  <div :style="fontStyle" class="custom-component-container">
    <h3 :style="{ color: textColor }">{{$t('MarkersInteraction.title')}}</h3>
    <div class="btn-opers">
      <a-button type="primary" :style="{ fontSize }" @click="addMarkers">{{ $t('MarkersInteraction.addMarker') }}</a-button>
      <img v-if="showImage" :src="imgUrl" :alt="$t('MarkersInteraction.imgAlt')" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'MarkersInteraction',
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
    const imgHostPrefix = 'https://iportal.supermap.io/iportal/apps/mapdashboard/v2/static/templates/img';
    return {
      imgList: [
        `${imgHostPrefix}/landuse.png`,
        `${imgHostPrefix}/estatemonitor.png`,
        `${imgHostPrefix}/tianditu.png`,
        `${imgHostPrefix}/travel-monitoring.png`,
        `${imgHostPrefix}/business-revenue.png`
      ],
      imgUrl: null,
      showImage: false
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
    addMarkers() {
      if (!this.map) {
        this.noneMapTip();
        return;
      }
      const map = this.map;
      const layerId = 'point-layer';
      const source = map.getSource(layerId);
      const mapBounds = map.getBounds();
      const sourceData = {
        type: 'FeatureCollection',
        features: new Array(5).fill(0).map((item, index) => {
          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [
                this.getRandom(mapBounds.getEast(), mapBounds.getWest()),
                this.getRandom(mapBounds.getSouth(), mapBounds.getNorth())
              ]
            }
          };
        })
      };
      if (!source) {
        this.showImage = true;
        this.addPlusImage(map);
        map.addSource(layerId, {
          type: 'geojson',
          data: sourceData
        });
        map.addLayer({
          id: layerId,
          source: layerId,
          type: 'symbol',
          layout: {
            'icon-image': 'pulsing-dot'
          }
        });
        map.on('click', layerId, this.generateImage);
      }
    },
    addPlusImage(map) {
      if (map) {
        const size = 80;
        const pulsingDot = {
          width: size,
          height: size,
          data: new Uint8Array(size * size * 4),

          onAdd: function() {
            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            this.context = canvas.getContext('2d');
          },

          render: function() {
            const duration = 1000;
            const t = (performance.now() % duration) / duration;

            const radius = (size / 2) * 0.3;
            const outerRadius = (size / 2) * 0.7 * t + radius;
            const context = this.context;

            context.clearRect(0, 0, this.width, this.height);
            context.beginPath();
            context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
            context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
            context.fill();

            context.beginPath();
            context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
            context.fillStyle = 'rgba(255, 100, 100, 1)';
            context.strokeStyle = 'white';
            context.lineWidth = 2 + 4 * (1 - t);
            context.fill();
            context.stroke();

            this.data = context.getImageData(0, 0, this.width, this.height).data;

            map.triggerRepaint();

            return true;
          }
        };

        map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
      }
    },
    generateImage() {
      this.imgUrl = this.imgList[Math.floor(Math.random() * 5)];
    },
    getRandom(start = -100, end = 100, fixed = 2) {
      let differ = end - start;
      let random = Math.random();
      return +(start + differ * random).toFixed(fixed);
    },
    noneMapTip() {
      alert(this.$t('MarkersInteraction.unassociatedMap'));
    }
  },
  loaded(map) {
    this.map = map;
  },
  removed() {
    const layerId = 'point-layer';
    if (this.map.getLayer(layerId)) {
      this.map.getLayer(layerId) && this.map.removeLayer(layerId);
      this.map.getSource(layerId) && this.map.removeSource(layerId);
      this.map.off('click', layerId, this.generateImage);
    }
    this.map.hasImage('pulsing-dot') && this.map.removeImage('pulsing-dot');
    this.showImage = false;
    this.imgUrl = null;
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
.btn-opers {
  margin-bottom: 10px;
}
.btn-opers .ant-btn {
  margin: 10px 8px;
  display: block;
  width: 42%;
  padding: 0;
}
.btn-opers img {
  display: block;
  width: 95%;
  height: 150px;
  margin-left: 8px;
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
