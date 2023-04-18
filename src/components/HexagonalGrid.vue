<template>
  <div class="container" id="items-container">
    <canvas id="canvas" ref="canvas" width="300" height="300" @click="handleHexClick"></canvas>
  </div>
</template>

<style>
#canvas {
  scrollbar-width: none;
}

.container {
  background: #333;
  display: grid;
  grid-template-columns: auto auto auto;
  padding: 8px;
  box-sizing: border-box;
  height: 100vh;
  overflow: auto;
  cursor: grab;
  scrollbar-width: none;
  background-image: url("../assets/starry.jpg");
}
</style>

<script>
const P2 = (x, y) => ({ x, y });
const EDGES = 6;
const RADIUS = 65;
const MAP_SIZE = 17;
const TAU = 2 * Math.PI;
const EDGE_LEN = Math.sin(Math.PI / EDGES) * RADIUS * 2;
const GRID_Y_SPACE = Math.cos(Math.PI / EDGES) * RADIUS * 2;
const GRID_X_SPACE = RADIUS * 2 - EDGE_LEN * 0.5;
const GRID_Y_OFFSET = GRID_Y_SPACE * 0.5;
const MAP_WIDTH = (1.75 * MAP_SIZE + 2) * Math.round(GRID_Y_SPACE);
const MAP_HEIGHT = (2.05 * MAP_SIZE + 2) * Math.round(GRID_Y_SPACE);

export default {
  mounted() {
    var canvas = document.getElementById("canvas");
    canvas.setAttribute("width", MAP_WIDTH + "px");
    canvas.setAttribute("height", MAP_HEIGHT + "px");
    this.drawGrid(MAP_SIZE, this.createPoly(EDGES));

    /*
  this is an implementation of Wes Bos click & drag scroll algorythm. In his video, he shows how to do the horizontal scroll. I have implemented the vertical scroll for those wondering how to make it as well.

  Wes Bos video:
    https://www.youtube.com/watch?v=C9EWifQ5xqA
*/
    const container = document.querySelector("#items-container");

    let startY;
    let startX;
    let scrollLeft;
    let scrollTop;
    let isDown;

    container.addEventListener("mousedown", (e) => mouseIsDown(e));
    container.addEventListener("mouseup", (e) => mouseUp(e));
    container.addEventListener("mouseleave", (e) => mouseLeave(e));
    container.addEventListener("mousemove", (e) => mouseMove(e));

    function mouseIsDown(e) {
      isDown = true;
      startY = e.pageY - container.offsetTop;
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      scrollTop = container.scrollTop;
      container.style.cursor = "grabbing";
    }
    function mouseUp(e) {
      isDown = false;
      container.style.cursor = "grab";
    }
    function mouseLeave(e) {
      isDown = false;
    }
    function mouseMove(e) {
      if (isDown) {
        e.preventDefault();
        //Move vertcally
        const y = e.pageY - container.offsetTop;
        const walkY = y - startY;
        container.scrollTop = scrollTop - walkY;

        //Move Horizontally
        const x = e.pageX - container.offsetLeft;
        const walkX = x - startX;
        container.scrollLeft = scrollLeft - walkX;
      }
    }
  },
  methods: {
    drawGrid(radius, hexPoints) {
      const ctx = this.$refs.canvas.getContext("2d");
      const center = P2();
      for (let y = radius; y >= -radius; y--) {
        for (let x = -radius; x <= radius; x++) {
          if (x * y > 0 && Math.abs(x) + Math.abs(y) > radius) continue;
          /*var distance = 9 - this.distance(x, y);
          if (distance <= 0) {
            distance = 0;
          }
          console.log(distance);
          var color = "#" + distance + distance + distance;
          */
          var color = "#333A";

          if (y == 0 && x == 0) {
            color = "#FF0C";
          }

          ctx.fillStyle = color;
          const hexCenter = this.gridToPixel(y, x, radius, center);
          this.drawPoly(hexCenter, hexPoints, ctx, y, x);
        }
      }
    },
    distance(xa, ya, xb = 0, yb = 0) {
      var dx = xa - xb;
      var dy = ya - yb;
      const sameSign = dx * dy > 0;
      dx = Math.abs(dx);
      dy = Math.abs(dy);
      if (sameSign) {
        return dx + dy;
      } else {
        return Math.max(dx, dy);
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

      //ctx.fillText(`(${col},${row})`, 0, 0);
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
      console.log("yo");
      const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext("2d");

      ctx.moveTo(1000, 0);

      /*const rect = event.target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;*/
      //const clickedHex = this.getHexFromPixel(P2(x, y));
      //console.log(`Clicked hex: (${clickedHex.x},${clickedHex.y})`);
    },
  },
};
</script>
