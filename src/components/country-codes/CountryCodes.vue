<template>
  <div class="CountryCodes" tabindex="0" v-on:keyup="onKeypress($event)">
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
           v-for="(country, index) in countries"
           :key="country.iso2"
           @click.prevent="onCountrySelect(country, index)"
           v-bind:class="{'_highlighted': index === highlightedIndex, '_selected': index === selectedIndex }"
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

  private handleOutsideClick: (e: any) => void;
  private selectedIndex: number = null;
  private highlightedIndex: number = null;
  private itemHeight: number = 28;
  private dorpdownHeight: number = 300;
  private defaultCountryIso2: string = 'US';
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
    this._selectDefaultCountry();
  }

  public onCountrySelect(country: Country, index: number) {
    this.selectedIndex = index;
    this.selectedCode = `+${country.dialCode}`;
    this.closeDropdown();
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
    setTimeout(() => {
      this._scrollToSelected();
    });
  }

  public onKeypress(e: KeyboardEvent): any {
    if (!this.dropDownIsShown) {
      return false;
    }
    // On Enter key
    if (e.keyCode === 13) {
      this._selectByIndex(this.highlightedIndex);
      return false;
    }
    // On Down Arrow key
    if (e.keyCode === 40) {
      if (this.highlightedIndex === null && this.selectedIndex !== null) {
        this.highlightedIndex = this.selectedIndex;
      }
      if (this.highlightedIndex < this.countries.length - 1) {
        this.highlightedIndex ++;
      } else {
        this.highlightedIndex = 0;
      }
      this._scrollToIndex(this.highlightedIndex);
      return false;
    }
    // On Up Arrow key
    if (e.keyCode === 38) {
      if (this.highlightedIndex === null && this.selectedIndex !== null) {
        this.highlightedIndex = this.selectedIndex;
      }
      if (this.highlightedIndex !== 0) {
        this.highlightedIndex --;
      } else {
        this.highlightedIndex = this.countries.length - 1;
      }
      this._scrollToIndex(this.highlightedIndex);
      return false;
    }

    // On Other keys
    this._searckByKeyPress(e.key);
  }

  private _searckByKeyPress(key: string) {
    if (!this.searchTimeout) {
      this.searchStr = '';
      this.searchTimeout = setTimeout(() => {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = 0;
      }, 2000);
      this.searchStr += key;
    } else {
      this.searchStr += key;
    }
    const firstMatch  = this._findFirstMatch(this.searchStr, 'name');
    if (firstMatch.item) {
      this.highlightedIndex = firstMatch.index;
      this._scrollToIndex(firstMatch.index);
    }
  }

  private _findFirstMatch(str: string, param: string, exact: boolean = false): SearchResult {
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
    this.highlightedIndex = null;
  }

  private _scrollToIndex(index: number) {
    const ref = this.$refs.dropdownRef as Element;
    if (ref) {
      ref.scrollTop = (index * this.itemHeight) - (this.dorpdownHeight / 2) + (this.itemHeight / 2);
    }
  }

  private _scrollToSelected() {
    if (this.selectedIndex !== null) {
      const country = this.countries[this.selectedIndex];
      if (country) {
        this._scrollToIndex(this.selectedIndex);
      }
    }
  }

  private _selectByIndex(index: number) {
    if (index !== null) {
      const country = this.countries[index];
      if (country) {
        this.onCountrySelect(country, index);
      }
    }
  }

  private _selectDefaultCountry() {
    const match = this._findFirstMatch(this.defaultCountryIso2, 'iso2', true);
    if (match.item) {
      this.onCountrySelect(match.item, match.index);
    }
  }

}
</script>

<style lang="scss" scoped>
  @import "./CountryCodes.scss";
</style>