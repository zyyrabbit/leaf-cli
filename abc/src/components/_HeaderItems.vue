<template>
  <div class="item-group">
    <div class="item" title="用户名称">
      <span class="el-dropdown-link">您好，Leaf123</span>
    </div>
    <div class="item menu-hover"  title="修改密码">
      <span class="el-dropdown-link">修改密码</span>
    </div>
    <div class="item menu-hover" @click="loginOut" title="退出登录">
      <span class="el-dropdown-link">退出</span>
    </div>
    <div class="item menu-hover" title="工单详情">
      <span class="el-dropdown-link">工单</span>
    </div>
    <div class="item menu-hover drop-name">
      <el-dropdown  @command="select">
        <span class="el-dropdown-link">
          用户信息
          <i class="el-icon-arrow-down"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item 
            v-for="user in userInfo" 
            :key="user.key" 
            :command="user.value">
            {{user.value}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="item bell" title="消息通知">
      <span class="icon-hover">
        <svg-icon name="bell"></svg-icon>
      </span>
    </div>
    <div class="item" title="帮助中心">
      <span class="icon-hover">
        <svg-icon name="question-circle"></svg-icon>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class HeaderItems extends Vue {

  private userInfo: any[] = [
      {
        key: 1,
        value: '昵称'
      },
      {
        key: 2,
        value: '性别'
      },
      {
        key: 3,
        value: '爱好'
      }
  ]
  private select(val: string) {
    console.log(val);
  }

  private loginOut() {
    this.$router.push({ name: 'login'});
  }
}
</script>
