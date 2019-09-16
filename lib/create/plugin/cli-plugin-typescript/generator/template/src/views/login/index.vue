---
extend: './plugin/cli-service/generator/template/src/views/login/index.vue'
replace: !!js/regexp /<script>[^]*?<\/script>/
---
<%# REPLACE %>
<script lang="ts">

<%_ if (!options.classComponent) { _%>

import Vue from 'vue';

export default Vue.extend({
  name: 'Login',
  data() {
    return {
      loginForm: {
        userAccount: '',
        password: ''
      },
      loading: false,
    }
  },
  methods: {
    onLogin() {
      this.$router.push({name: 'index'});
    }
  }
})

<%_ } else { _%>
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

<%_ } _%>
</script>
<%# END_REPLACE %>