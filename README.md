# React Character Map

Include a character map in your app using our React Character Map.

It provides a simple interface for users to select a character from a list of categorised characters.

## Installation

```
npm install react-character-map
```

or
```
yarn add react-character-map
```


## Usage

```js
// Import the module into your react app
import {CharacterMap} from 'react-character-map';
```

```js
// Use the element;
<CharacterMap
	characterData={optionalCustomCharacterData}
	onSelect={function(char,el){ console.log(char, el); }}
/>
```


### Properties

* `characterData` is an optional property that overrides the default character map. `characterData` should be provided in the form:
```js
{
    "TAB NAME": [
        { "entity": "&copy;", "hex": "&#00A9;", "name": "COPYRIGHT SIGN", "char": "©" } // char is required
    ],
    "ANOTHER TAB": [
        { MORE CHARACTER DATA }
    ]
}
```
* `onSelect` callback: This is fired when the user clicks on a character, and has two parameters;

```js
onSelect(char, el)
```

`char` is an Object of the character that has been selected, for instance;

```js
{ "hex": "&#263B;", "name": "BLACK SMILING FACE", "char": "☻" }
```
or
```js
{ "char":"ø" }
```

The second parameter `el` is the element that has been selected, this is an anchor.
```html
<button data-hex="&#00D8;" data-entity="&Oslash;" data-char="Ø" data-title="LATIN CAPITAL LETTER O WITH STROKE">Ø</button>
```


### Styling
The package comes with very basic styling, it is recommended that you style it to match your app.


![](http://c.dayjo.me/0I2H0s0M0s2O/Screen%20Recording%202018-01-26%20at%2002.51%20pm.gif)
