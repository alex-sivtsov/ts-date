[![Build Status](https://travis-ci.org/standy/ts-date.svg?branch=master)](https://travis-ci.org/standy/ts-date)
[![Coverage Status](https://coveralls.io/repos/github/standy/ts-date/badge.svg?branch=master)](https://coveralls.io/github/standy/ts-date?branch=master)
[![dependencies Status](https://david-dm.org/standy/ts-date/status.svg)](https://david-dm.org/standy/ts-date)
[![MIT License](https://img.shields.io/npm/l/ts-date.svg)](https://github.com/standy/ts-date/blob/master/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/ts-date.svg)](https://www.npmjs.com/package/ts-date)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

[![Build Status](https://saucelabs.com/browser-matrix/standy.svg)](https://saucelabs.com/beta/builds/5fe7f4ad4e9c4f87842ea80e0a497eb5)
 
**ts-date** is a `Date` library which shine in Typescript enviroment  

Main difference from most javascript `Date` libraries is:
   * if you strictly follow types, you will never get `"Invalid Date"`  
   * literally no overhead under native `Date`, take a look at [benchmarks](https://github.com/standy/ts-date/tree/master/benchmark)  
   * written in Typescript, provides tree-shakeable API
   
## How?
All this is possible thanks to `ValidDate` type (not a class) – the immutable wrapper under `Date`, actually `ValidDate` becomes a `Date` after compile  

`ValidDate` creation occurs through methods which will return `null` instead of `Date("Invalid Date")`, and `null` is a valid argument for every method where required `ValidDate`  
```js
import { parseIso, format } from 'ts-date/locale/en';
const d = parseIso('2021-12-21'); // ValidDate | null
format(d, 'Do MMMM YYYY'); // Type is 'string | null'
if (d) {
    d; // ValidDate
    format(d, 'Do MMMM YYYY'); // Type is 'string'
    // no "Invalid Date" option here
} else {
    d; // null
    format(null, 'Do MMMM YYYY'); // Type is 'null'
}
```
Since `ValidDate` is `Date`, you can use some `Date` methods:  
```js
const d = parseIso('2021-12-21');
if (d) {
    d.getDate() // 21
}
```
To make `ValidDate` immutable, all methods for `Date` mutation are banned in type:
```js
d.setDate(0) // Typescript will warn here
```
 

##### Compare with momentjs
With `momentjs` you have no warnings here:  
```js
import * as moment from 'moment';
function someDateProcessing(isoDate: string): string {
  const m = moment(isoDate);  
  return m.format('YYYY-MM-DD'); // "Invalid date"
}
someDateProcessing('The Day After Tomorrow');
```

With **ts-date** you forced to make checks or add a `null` as posible result 
```js
import { format, parseIso } from 'ts-date';
function dateProcessingWithSafetyBelt(pleaseIsoDate: string): string {
  const d = parseIso(pleaseIsoDate); // Type is 'ValidDate | null'
  
  // Warning here:   
  return format(d, 'YYYY-MM-DD'); // Type is 'string | null'
  // TS2322:Type 'string | null' is not assignable to type 'string'.
  
  // To avoid warning do what you should to do:
  // change function type to 'string | null', 
  // throw error,
  // or return another magic string explicitly
  if (d === null) {
    throw new TypeError(`ISO 8601 format expected`);
  }
  d; // Type is 'ValidDate'
  return format(d, 'YYYY-MM-DD'); // Type is 'string'
}
```

## Locales
For now there is only 2 locales: `en`, `ru`

```js
import { parse, format, addMonth } from 'ts-date/locale/en';
const d = parse('1st August 2017', 'Do MMMM YYYY');
const f = format(addMonth(d, 1), 'Do MMMM YYYY'); // 1st September 2017
```

:warning: Directly `ts-date` exports without any locale 



## ES6 modules and CommonJS
To get full benefit from [tree shaking](https://webpack.js.org/guides/tree-shaking/) 
you probably want to use library in [ES6 Modules](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Statements/export) syntax

This library have few entry points for different locales, and unfortunately [pkg.module](https://github.com/rollup/rollup/wiki/pkg.module) supports only single one.  
But you can import as `ES6 Modules` from `esm` folder
```js
import {parse, format, addMonth} from 'ts-date/esm/locale/en';
```
You may also use [resolve.alias](https://webpack.js.org/configuration/resolve/#resolve-alias) for Webpack, 
or [rollup-plugin-alias](https://github.com/rollup/rollup-plugin-alias) for Rollup 


## Type system
`ValidDate` type equals `Date` without `Date("Invalid Date")`. 
Abusing that knowledge you may be sure about correct result when you pass `ValidDate` to any method
 
Every method who accepts `ValidDate`, will also accept `Date` and `null`  

Methods which returns primitives (like `format` of `diffYears`) will always return `null` for any invalid value, but not for `ValidDate`  
In example below result is absolutely same, but type is different 
```js
const validDate = newValidDate(); // Type: ValidDate
const date = validDate as Date; // Type: Date

formatDateIso(validDate); // Type: string
formatDateIso(date); // Type: string | null
```


Method for date manipulation (like `addMinutes` or `resetSeconds`) returns result of same type as input
```js
addMinutes(validDate, 5); // Type: ValidDate
addMinutes(date, 5); // Type: Date
addMinutes(null, 5); // Type: null
```



## Browser support
Should work fine without polyfills in every modern browser and IE9+  
Chrome 5+, Edge, Firefox 4.0+, IE 9+, Opera 12+, Safari 5+


## Api

### Date creation

**parse**  
Parse date by template in `momentjs` style
```js
parse(date: string, template: string): ValidDate | null
```

**parseIso**  
Parse most of ISO 8601 formats
```js
parseIso(dateIso: string): ValidDate | null
```

**fromDate**  
Create from `Date` object
```js
fromDate(date: Date | number): ValidDate | null
```

**newValidDate**  
Create `ValidDate` in `new Date(...)` style
```js
newValidDate(): ValidDate
newValidDate(timestamp: number): ValidDate | null
newValidDate(year: number, month: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number): ValidDate | null
```



### Format

**format**  
Format by template in `momentjs` style
```js
format(ValidDate, template: string): string
```

**predefined ISO formats** 
```js
formatDateIso(ValidDate): string // YYYY-MM-DD
formatDateTimeIso(ValidDate): string // YYYY-MM-DD[T]HH:MM
formatLocalIso(ValidDate): string // YYYY-MM-DD[T]HH:MM:SS.sss
```


### Add
Adding fixed amount of units.  
First argument should be `ValidDate`, `null` or either. Result will be same type as input 

```js
addMilliseconds(ValidDate, number): ValidDate 
addSeconds(ValidDate, number): ValidDate
addMinutes(ValidDate, number): ValidDate
addHours(ValidDate, number): ValidDate
addDate(ValidDate, number): ValidDate
addMonth(ValidDate, number): ValidDate
addYear(ValidDate, number): ValidDate
```

### Reset
Reset to default all units after method's name unit
```js
resetYear(ValidDate): ValidDate
resetMonth(ValidDate): ValidDate
resetISOWeek(ValidDate): ValidDate
resetDate(ValidDate): ValidDate
resetHours(ValidDate): ValidDate
resetMinutes(ValidDate): ValidDate
resetSeconds(ValidDate): ValidDate
```
Example: 
```js
resetYear(newValidDate(2017, 5, 30, 12, 30)) // == new Date(2017, 0, 1)
```

### Diff
Subtract second date from first  
In case one of arguments is `null` or `Date("Invalid Date")`, result is `null`
```js
diffMilliseconds(ValidDate, ValidDate): number
diffSeconds(ValidDate, ValidDate): number
diffMinutes(ValidDate, ValidDate): number
diffHours(ValidDate, ValidDate): number
diffDate(ValidDate, ValidDate): number
diffMonth(ValidDate, ValidDate): number
diffYear(ValidDate, ValidDate): number
```
Example: 
```js
diffMilliseconds(d1, d2) // === d1 - d2
```

### Diff calendar units
Diff like units after method's name unit are reset
```js
diffCalendarDate(ValidDate, ValidDate): number
diffCalendarMonth(ValidDate, ValidDate): number
diffCalendarYear(ValidDate, ValidDate): number
```
Example:
```js
function isToday(d: ValidDate) {
  return diffCalendarDate(d, newValidDate()) === 0;
}
```

### Checking for ValidDate
Type guard for `ValidDate`, return `true` if date is valid 
```js
isValidDate(Date): boolean
```
