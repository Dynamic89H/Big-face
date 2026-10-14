// Minimal typings for bad-words@1.6.3 (CommonJS, ships without types).
declare module 'bad-words' {
  export interface FilterOptions {
    emptyList?: boolean;
    list?: string[];
    placeHolder?: string;
    regex?: RegExp;
    replaceRegex?: RegExp;
    splitRegex?: RegExp;
  }
  declare class Filter {
    constructor(options?: FilterOptions);
    isProfane(value: string): string | false;
    clean(value: string): string;
    addWords(...words: string[]): void;
    removeWords(...words: string[]): void;
  }
  export default Filter;
}
