<template>
  <div class="custom-text-setting">
    <div class="sm-setting-panel">
      <div class="sm-setting-panel__header">{{ $t('CoordinatesPicker.modeLabel') }}</div>
      <a-select
        class="sm-setting-panel__content"
        :value="mode"
        :options="optionsList"
        :getPopupContainer="triggerNode => triggerNode.parentNode"
        @change="val => handleChange({ mode: val })"
      />
    </div>
    <div class="sm-setting-panel">
      <div class="sm-setting-panel__header">{{ $t('CoordinatesPicker.fontSize') }}</div>
      <div class="sm-setting-panel__content">
        <a-input-number :value="fontSize" @change="value => handleChange({ fontSize: value })" />
        <span class="sm-setting-unit">px</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    mode: String,
    fontSize: [String, Number],
    textColor: String,
    background: String
  },
  data() {
    return {
      optionsList: [
        {
          label: this.$t('CoordinatesPicker.click'),
          value: 'click'
        },
        {
          label: this.$t('CoordinatesPicker.mousemove'),
          value: 'mousemove'
        }
      ]
    };
  },
  methods: {
    handleChange(data) {
      this.$emit('change', data);
    }
  }
};
</script>

<style lang="css" scoped>
.custom-text-setting {
  color: red;
}
.custom-text-setting .ant-input {
  height: 28px;
}
</style>
