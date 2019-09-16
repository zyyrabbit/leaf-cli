---
extend: './plugin/cli-service/generator/template/src/views/dashboard/index.vue'
replace: !!js/regexp /<script>[^]*?<\/script>/
---

<%# REPLACE %>
<script lang="ts">
<%_ if (!options.classComponent) { _%>
import Vue from 'vue';

export default Vue.extend({
  name: 'Dashboard',
})

<%_ } else { _%>
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Dashboard extends Vue {
}
<%_ } _%>
</script>
<%# END_REPLACE %>