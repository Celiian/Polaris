# hexcell

A hexagon cell for a hexgrid

```sh
npm install hexcell --save
```

## Example

```js
var Point = require('point2d');
var Hexcell = require('hexcell');

var point = new Point(2, 3);
var cell = new Hexcell(point, { extraData: 3 });
```