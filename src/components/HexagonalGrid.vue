<template>
  <div>
    <canvas ref="canvas" width="2000" height="2000" style="border: 1px solid #000000" @click="handleHexClick"></canvas>
  </div>
</template>
<script>
const P2 = (x, y) => ({ x, y });
const EDGES = 6;
const RADIUS = 50;
const TAU = 2 * Math.PI;
const EDGE_LEN = Math.sin(Math.PI / EDGES) * RADIUS * 2;
const GRID_Y_SPACE = Math.cos(Math.PI / EDGES) * RADIUS * 2;
const GRID_X_SPACE = RADIUS * 2 - EDGE_LEN * 0.5;
const GRID_Y_OFFSET = GRID_Y_SPACE * 0.5;

export default {
  mounted() {
    this.drawGrid(5, this.createPoly(EDGES));
  },
  methods: {
    drawGrid(radius, hexPoints) {
      const ctx = this.$refs.canvas.getContext("2d");
      const center = P2();
      for (let y = radius; y >= -radius; y--) {
        for (let x = -radius; x <= radius; x++) {
          if (x * y < 0 && Math.abs(x) + Math.abs(y) > radius) continue;
          ctx.fillStyle = "#000000";
          const hexCenter = this.gridToPixel(y, x, radius, center);
          this.drawPoly(hexCenter, hexPoints, ctx, y, x);
        }
      }
    },
    gridToPixel(gridX, gridY, radius, p = {}) {
      p.x = (gridX + radius + 1) * GRID_X_SPACE;
      p.y = (gridY + radius + 1) * GRID_Y_SPACE + gridX * GRID_Y_OFFSET;
      return p;
    },
    drawPoly(p, points, ctx, col, row) {
      // p.x, p.y is center
      ctx.setTransform(1, 0, 0, 1, p.x, p.y);
      var i = 0;
      ctx.beginPath();
      while (i < points.length) {
        const p2 = points[i++];
        ctx.lineTo(p2.x, p2.y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.stroke();
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "center";

      ctx.fillText(`(${col},${row})`, 0, 0);
    },
    createPoly(sides, points = []) {
      const step = TAU / sides;
      var ang = 0,
        i = sides;
      while (i--) {
        points.push(P2(RADIUS * Math.cos(ang), RADIUS * Math.sin(ang)));
        ang += step;
      }
      return points;
    },
    handleHexClick(event) {
      const rect = event.target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      //const clickedHex = this.getHexFromPixel(P2(x, y));
      //console.log(`Clicked hex: (${clickedHex.x},${clickedHex.y})`);
    },
  },
};
</script>
