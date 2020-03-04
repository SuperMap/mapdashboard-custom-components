<template>
  <div class="custom-text-setting">
    <div class="sm-setting-panel">
      <div class="sm-setting-panel__header">触发模式：</div>
      <a-select
        class="sm-setting-panel__content"
        :value="mode"
        :options="optionsList"
        :getPopupContainer="triggerNode => triggerNode.parentNode"
        @change="val => handleChange({ mode: val })"
      />
    </div>
    <div class="sm-setting-panel">
      <div class="sm-setting-panel__header">字体大小：</div>
      <div class="sm-setting-panel__content has-unit">
        <a-input :value="fontSize" @change="e => handleChange({ fontSize: e.target.value })" />
        <span class="sm-text-setting__input-unit">像素</span>
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
          label: '点击',
          value: 'click'
        },
        {
          label: '鼠标移动',
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
