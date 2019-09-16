---
extend: './plugin/cli-service/generator/template/src/views/error-page/error.vue'
replace: !!js/regexp /<script>[^]*?<\/script>/
---

<%# REPLACE %>
<script lang="ts">

<%_ if (!options.classComponent) { _%>

import Vue from 'vue';
export default Vue.extend({
  name: 'Error',
  data() {
    return {
      type: '',
      message: '',
    }
  },
  methods: {
    goIndex() {
      this.$router.push({
        name: 'index'
      })
    },
    getImgUrl(){
      return require(`@/assets/img/${this.type}.png`);
    }
  },
  watch: {
    '$route': function(newVal) {
      let { meta: { message, type } } = newVal;
      this.message = message;
      this.type = type;
    }
  }
})
<%_ } else { _%>
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
<%_ } _%>
</script>
<%# END_REPLACE %>