export interface SearchResult {
  item: Country | undefined;
  index: number;
}

export interface Country {
  name: string;
  iso2: string;
  dialCode: string;
  priority: number;
  areaCodes: string[] | null;
}
