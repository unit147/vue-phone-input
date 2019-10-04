<template>
  <div class="PhoneInput" id="app">
    <CountryCodes @selected="_onCountrySelected"></CountryCodes>
    <div class="PhoneInput-Input-Wrap">
      <div class="PhoneInput-Example" v-if="phoneExample.length">Example: {{phoneExample}}</div>
      <input class="PhoneInput-Input"
            ref="PhoneNumberInput"
            v-on:keyup="_formatInput"
            v-model="phoneNumber"
            type="text">
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { parsePhoneNumberFromString, AsYouType, getExampleNumber, CountryCode } from 'libphonenumber-js';
import examples from 'libphonenumber-js/examples.mobile.json';
import CountryCodes from './components/country-codes/CountryCodes.vue';
import { Country } from './components/country-codes/models';

@Component({
  components: {
    CountryCodes,
  },
})

export default class App extends Vue {
  @Prop() public phone: string;
  public phoneNumber: string = '';
  public phoneExample: string = '';
  private selectedCountry: Country;

  private _onCountrySelected( country: Country ) {
    this.selectedCountry = country;
    this.$nextTick(() => {
      const inputRef = this.$refs.PhoneNumberInput as HTMLElement;
      inputRef.focus();
      this.phoneExample = this._phoneNumberExample() as string;
    });
  }

  private get _countryCode(): CountryCode {
    const coutryCode: CountryCode = this.selectedCountry.iso2.toUpperCase() as CountryCode;
    return coutryCode;
  }

  private _phoneNumberExample() {
    if (this.selectedCountry) {
      const coutryCode: CountryCode = this._countryCode;
      const phoneNumber = coutryCode ? getExampleNumber(coutryCode, examples) : null;
      return phoneNumber ? phoneNumber.formatNational() : null;
    } else {
      return null;
    }
  }

  private _formatInput() {
    this.phoneNumber = this._getAsYouTypeFormat({countryCode: this._countryCode, phoneNumber: this.phoneNumber});
  }

  private _getAsYouTypeFormat(payload: {countryCode: CountryCode, phoneNumber: string}): string {
    const asYouType = new AsYouType(payload.countryCode);
    return asYouType.input(payload.phoneNumber);
  }
}

</script>


<style lang="scss" scoped>
  @import "./App.scss";
</style>