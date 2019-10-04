<template>
  <div class="CountryCodes" tabindex="0" v-on:keyup="searchByKeypress($event)">
    <div class="CountryCodes-Arrow"></div>
    <input class="CountryCodes-Input" 
           readonly 
           type="text" 
           :value="selectedCode" 
           @click.prevent="toggleDropdown()"
           ref="codeInput">
    <div class="CountryCodes-Dropdown"
         ref="dropdownRef"
         v-if="dropDownIsShown"
         v-click-outside="closeDropdown">
      <div class="CountryCodes-Dropdown-Item" 
           v-for="country in countries"
           :key="country.iso2"
           @click.prevent="onCountrySelect(country)"
           v-bind:class="{'_highlighted': country.iso2 === highlightediso2 }"
      >{{country.name}}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { countriesList } from './countriesList';
import { directive } from 'v-click-outside';


interface SearchResult {
  item: Country | undefined;
  index: number;
}

interface Country {
  name: string;
  iso2: string;
  dialCode: string;
  priority: number;
  areaCodes: string[] | null;
}

@Component({
  directives: {
    clickOutside: directive,
  },
})
export default class CountryCodes extends Vue {
  public countries: Country[] = [];
  public selectedCode: string = '';
  public dropDownIsShown: boolean = false;
  public highlightediso2: string = '';
  public selectediso2: string = '';
  public handleOutsideClick: (e: any) => void;

  private itemHeight: number = 28;
  private dorpdownHeight: number = 300;
  private searchStr: string = '';
  private searchTimeout: number;

  public mounted() {
    this.countries = countriesList.map( (country: any[]) => ({
      name: country[0],
      iso2: `${country[1]}`.toUpperCase(),
      dialCode: country[2],
      priority: country[3] || 0,
      areaCodes: country[4] || null,
    })).sort((a, b) => ( a.priority < b.priority) ? 1 : -1);
  }

  public onCountrySelect(country: Country) {
    this.selectedCode = `+${country.dialCode}`;
    this.closeDropdown();
  }

  public searchByKeypress(e: KeyboardEvent): any {
    if (!this.dropDownIsShown) {
      return false;
    }
    if (e.keyCode === 13) {
      this._selectHighlighted();
      return false;
    }
    if (!this.searchTimeout) {
      this.searchStr = '';
      this.searchTimeout = setTimeout(() => {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = 0;
      }, 2000);
      this.searchStr += e.key;
    } else {
      this.searchStr += e.key;
    }
    const firstMatch  = this._findFirtMatch(this.searchStr, 'name');
    if (firstMatch.item) {
      this.highlightediso2 = firstMatch.item.iso2;
      this._scrollToIndex(firstMatch.index);
    }
  }

  public toggleDropdown() {
    this.dropDownIsShown ? this.closeDropdown() : this.showDropdown();
  }

  public closeDropdown() {
    this.dropDownIsShown = false;
    this._resetVars();
  }

  public showDropdown() {
    this.dropDownIsShown = true;
  }

  private _findFirtMatch(str: string, param: string, exact: boolean = false): SearchResult {
    let countryIndex: number = 0;
    let countryMatch;
    this.countries.some((country: any, index: number) => {
      let condition = false;
      if (exact) {
        condition = country[param].toLowerCase() === str.toLowerCase();
      } else {
        condition = country[param].toLowerCase().startsWith(str.toLowerCase());
      }
      if (condition) {
        countryIndex = index;
        countryMatch = country;
      }
      return condition;
    });
    return { item: countryMatch, index: countryIndex} ;
  }

  private _resetVars() {
    this.searchStr = '';
    this.highlightediso2 = '';
  }

  private _scrollToIndex(index: number) {
    const ref = this.$refs.dropdownRef as Element;
    ref.scrollTop = (index * this.itemHeight) - (this.dorpdownHeight / 2) + (this.itemHeight / 2);
  }

  private _selectHighlighted() {
    if (this.highlightediso2 !== '') {
      const highlightedCountry = this._findFirtMatch(this.highlightediso2, 'iso2', true);
      this.selectediso2 = this.highlightediso2;
      if (highlightedCountry.item) {
        this.onCountrySelect(highlightedCountry.item);
      }
    }
  }

}
</script>

<style lang="scss" scoped>
  @import "./CountryCodes.scss";
</style>