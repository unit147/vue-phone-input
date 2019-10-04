<template>
  <div class="PhoneInput" id="app">
    <CountryCodes></CountryCodes>
    <input class="PhoneInput-Input" type="text">
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CountryCodes from './components/country-codes/CountryCodes.vue';

@Component({
  components: {
    CountryCodes,
  },
})

export default class App extends Vue {}

</script>


<style lang="scss" scoped>
  @import "./App.scss";
</style>