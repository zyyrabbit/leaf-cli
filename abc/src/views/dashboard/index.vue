<template>
<view-container class="dashboard">
  <div class="dashboard--welcome">
    Hello world! 
  </div>
</view-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Dashboard extends Vue {
}
</script>

<style lang="scss">
  .dashboard {
    &--welcome {
      display: flex;
      height: 100%;
      font-size: 25px;
      justify-content: center;
      align-items: center;
    }
  }
</style>