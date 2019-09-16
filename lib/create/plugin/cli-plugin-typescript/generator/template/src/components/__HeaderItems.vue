---
extend: './plugin/cli-service/generator/template/src/components/__HeaderItems.vue'
replace: !!js/regexp /<script>[^]*?<\/script>/
---
<%# REPLACE %>
<script lang="ts">
<%_ if (!options.classComponent) { _%>
import Vue from 'vue';

export default Vue.extend({
  name: 'HeaderItems',
  data() {
    return {
      userInfo: [
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
    }
  },
  props: {
    msg: String,
  },
  methods: {
    select(val: string) {
      console.log(val);
    },
    loginOut() {
      this.$router.push({ name: 'login'});
    }
  }
});

<%_ } else { _%>
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
<%_ } _%>
</script>
<%# END_REPLACE %>