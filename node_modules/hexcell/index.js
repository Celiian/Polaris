
/**
 * A hexagon cell for a hexgrid
 * @param {Point} point A point2d point
 * @param {Object} data Arbitrary data that can be attached to this cell
 */
function Hexcell (point, data) {
  this.point = point;
  this.data = data || {};
}

module.exports = Hexcell;