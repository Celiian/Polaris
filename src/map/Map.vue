<template>
  <div>
    <canvas ref="canvas" width="1000" height="1000" style="border: 1px solid #000000" @click="handleHexClick"></canvas>
  </div>
</template>
<script>
const P2 = (x, y) => ({ x, y });
const EDGES = 6;
const RADIUS = 100;
const TAU = 2 * Math.PI;
const EDGE_LEN = Math.sin(Math.PI / EDGES) * RADIUS * 2;
const GRID_Y_SPACE = Math.cos(Math.PI / EDGES) * RADIUS * 2;
const GRID_X_SPACE = RADIUS * 2 - EDGE_LEN * 0.5;
const GRID_Y_OFFSET = GRID_Y_SPACE * 0.5;
const COLS = "=#3c2f18,#01335f,#3f0e77,#204a73,#511d94,#fe1f00,#0060fd,#fe7603,#f0ca1d,#b085e8,#e9cafa".split(",");
const rndItem = (arr) => arr[(Math.random() * arr.length) | 0];

export default {
  mounted() {
    this.drawGrid(1, 1, 20, 20, this.createPoly(EDGES));
  },
  methods: {
    drawGrid(x, y, w, h, points) {
      const ctx = this.$refs.canvas.getContext("2d");
      const p = P2();
      var gy, gx;
      for (gy = y; gy < y + h; gy++) {
        for (gx = x; gx < x + w; gx++) {
          ctx.fillStyle = rndItem(COLS);
          this.drawPoly(this.gridToPixel(gx, gy, p), points, ctx);
        }
      }
    },
    gridToPixel(gx, gy, p = {}) {
      p.x = gx * GRID_X_SPACE;
      p.y = gy * GRID_Y_SPACE + (gx % 2 ? GRID_Y_OFFSET : 0);
      return p;
    },
    drawPoly(p, points, ctx) {
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
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";
      const hex = this.getHexFromPixel(P2(p.x, p.y));

      ctx.fillText(`(${hex.x},${hex.y})`, 0, 0);
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
    getHexFromPixel(p) {
      const q = P2(((p.x * Math.sqrt(3)) / 3 - p.y / 3) / RADIUS, ((2 / 3) * p.y) / RADIUS);
      const r = P2(Math.round(q.x), Math.round(q.y));
      const diff = P2(q.x - r.x, q.y - r.y);
      if (Math.abs(diff.x) + Math.abs(diff.y) <= 1) {
        return r;
      }
      const dx = Math.abs(diff.x);
      const dy = Math.abs(diff.y);
      if (dx > dy) {
        return P2(diff.x > 0 ? r.x + 1 : r.x - 1, r.y);
      } else {
        return P2(r.x, diff.y > 0 ? r.y + 1 : r.y - 1);
      }
    },
    handleHexClick(event) {
      const rect = event.target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const clickedHex = this.getHexFromPixel(P2(x, y));
      console.log(`Clicked hex: (${clickedHex.x},${clickedHex.y})`);
    },
  },
};
</script>
