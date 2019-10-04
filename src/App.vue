<template>
  <div class="PhoneInput" id="app">
    <CountryCodes @selected="_onCountrySelected"></CountryCodes>
    <div class="PhoneInput-Input-Wrap">
      <div class="PhoneInput-Example" 
           v-if="phoneExample.length"
      >Example: {{phoneExample}}</div>
      <input class="PhoneInput-Input"
            ref="PhoneNumberInput"
            v-on:keyup="_formatInput"
            v-bind:class="{'_valid': isValid }"
            v-model="phoneNumber"
            type="tel">
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
  public isValid: boolean = false;

  private countryCode: CountryCode;
  private selectedCountry: Country;

  private _onCountrySelected( country: Country ) {
    this.selectedCountry = country;
    this.countryCode = this._getCountryCode();
    this.$nextTick(() => {
      const inputRef = this.$refs.PhoneNumberInput as HTMLElement;
      inputRef.focus();
      this.phoneExample = this._phoneNumberExample() as string;
    });
  }

  private _getCountryCode(): CountryCode {
    const coutryCode: CountryCode = this.selectedCountry.iso2.toUpperCase() as CountryCode;
    return coutryCode;
  }

  private _phoneNumberExample() {
    if (this.selectedCountry) {
      const coutryCode: CountryCode = this._getCountryCode();
      const phoneNumber = coutryCode ? getExampleNumber(coutryCode, examples) : null;
      return phoneNumber ? phoneNumber.formatNational() : null;
    } else {
      return null;
    }
  }

  private _formatInput() {
    this.phoneNumber = this._getAsYouTypeFormat(this._getCountryCode(), this.phoneNumber);
    this._emitValues();
  }

  private _getAsYouTypeFormat(countryCode: CountryCode, phoneNumber: string): string {
    const asYouType = new AsYouType(countryCode);
    return asYouType.input(phoneNumber);
  }

  private _emitValues() {
    const result = parsePhoneNumberFromString(this.phoneNumber, this._getCountryCode());
    this.isValid = result ? result.isValid() : false;
    const results = {
      isValid: this.isValid,
      countryCode: this._getCountryCode(),
      phoneNumber: result ? result.formatInternational() : null,
    };
    this.$emit('update', results);
  }
}

</script>


<style lang="scss" scoped>
  @import "./App.scss";
</style>