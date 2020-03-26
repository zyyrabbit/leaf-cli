<template>
  <div class="error">
    <div class="error__svg">
      <img :src="getImgUrl()" alt="页面访问有误" />
    </div>
    <div class="error__message">
      {{message}}
    </div>
    <div class="error__operation">
      <el-button type="primary" size="small" @click="goIndex()">返回首页</el-button>
    </div>
  </div>
</template>


<script lang="ts">

import { Component, Vue, Watch } from 'vue-property-decorator';

@Component
export default class Error extends Vue {
  private type: string = '';
  private message: string = '';

  private goIndex(): void {
    this.$router.push({
      name: 'index'
    })
  }

  @Watch('$route', { immediate: true })
  routeChange(newVal) {
    let { meta: { message, type } } = newVal;
    this.message = message;
    this.type = type;
  }

  getImgUrl(){
    return require(`@/assets/img/${this.type}.png`);
  }
}
</script>


<style scoped lang="scss">
 .error {
    width: 48%;
    height: 100%;
    margin: 0 auto;
    &__svg, &__message, &__operation {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &__svg {
      width: 100%;
      padding-top: 10%;
      ::v-deep {
        .pic {
          width: 100%;
        }
      }
    }
    &__message {
      margin-top: 3.2%;
      font-size: 14px;
      color: #777777;
      text-align: left;
    }
    &__operation {
      margin-top: 3.2%;
    }
 }
</style>
