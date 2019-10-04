<template>
  <div id="app">
    <CountryCodes></CountryCodes>
    <!-- <PhoneInput></PhoneInput> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CountryCodes from './components/country-codes/CountryCodes.vue';
import PhoneInput from './components/phone-input/PhoneInput.vue';

@Component({
  components: {
    CountryCodes,
    PhoneInput,
  },
})

export default class App extends Vue {}

</script>