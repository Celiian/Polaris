
var assert = require('assert');
var Point = require('point2d');
var Hexcell = require('..');

function objEqual (obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

describe('Hexcell', function () {
  it('should construct properly without data', function () {
    var point = new Point(2, 3);
    var cell = new Hexcell(point);
    assert(cell.point.equals(point));
    assert(objEqual(cell.data, {}));
  });

  it('should construct properly with data', function () {
    var point = new Point(2, 3);
    var cell = new Hexcell(point, { stuff: 2 });
    assert(cell.point.equals(point));
    assert(objEqual(cell.data, { stuff: 2 }));
  });
});