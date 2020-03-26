<template>
  <div class="leaf-login-wrapper">
    <strong class="leaf-login-wrapper--caption">登录</strong>
    <el-form size="big">
      <el-form-item>
        <el-input v-model="loginForm.userAccount" placeholder="账户/手机号码">
          <template slot="prepend">
            <svg-icon name="user"></svg-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          type="password"
          @keyup.enter.native="onLogin"
          v-model="loginForm.password"
          placeholder="密码"
        >
          <template slot="prepend">
            <svg-icon name="lock"></svg-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          size="big"
          class="btn-login"
          :loading="loading"
          type="primary"
          @click="onLogin"
        >登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Login extends Vue {
  private loginForm = {
    userAccount: '',
    password: ''
  }

  private loading = false;

  private async onLogin() {
    this.$router.push({name: 'index'});
  }
}

</script>

<style lang="scss" scoped>
.leaf-login-wrapper {
  position: absolute;
  top: 20%;
  right: 40px;
  padding: 32px;
  border-radius: 3px;
  background-color: #fff;

  &--caption {
    display: block;
    padding-bottom: 24px;
    font-size: 24px;
    color: #666;
    font-style: normal;
  }

  .el-form-item {
    margin-bottom: 8px;
    ::v-deep {
      .el-input {
        &__inner {
          height: 40px;
          line-height: 40px;
        }
      }
      .el-button {
        padding: 12px 20px;
      }
      .el-input__suffix {
        display: none;
      }
    }
  }

  .el-button {
    &.btn-forget {
      padding: 0;
    }

    &.btn-login {
      margin-top: 24px;
      display: block;
      width: 100%;
    }
  }
}
</style>