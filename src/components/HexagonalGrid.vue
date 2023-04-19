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
const MAP_SIZE = 27;
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
    this.drawGrid(MAP_SIZE, this.createPoly(RADIUS, EDGES));

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

          var color = "#FFF0";
          ctx.fillStyle = color;
          color = "#FFF";

          var planetType = "none";
          var type = "void";

          if (this.distance(x, y) > 4) {
            color = "#FFFF";
            planetType = "none";
            const random_number = Math.floor(Math.random() * 100) + 1;
            type = "void";
            if (random_number < 85) {
            } else if (random_number < 95) {
              type = "planet";
              const rand = Math.floor(Math.random() * 100) + 1;
              if (rand < 15) {
                planetType = "indu";
              } else if (rand < 45) {
                planetType = "athmo";
              } else if (rand < 65) {
                planetType = "mine";
              } else {
                planetType = "agri";
              }
            } else {
              type = "asteroid";
            }
          }
          if (this.distance(x, y) < 3) {
            color = "#FFF0";
          }
          if (y == 0 && x == 0) {
            const hexCenter = this.gridToPixel(y, x, radius, center);
            this.drawPlanet(hexCenter, RADIUS * 2.1, ctx, "sun");
          } else {
            const hexCenter = this.gridToPixel(y, x, radius, center);
            this.drawPoly(hexCenter, hexPoints, ctx, y, x, type, color, planetType);
          }
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
    gridToPixel(gridX, gridY, radius, p = {}, color) {
      p.x = (gridX + radius + 1) * GRID_X_SPACE;
      p.y = (gridY + radius + 1) * GRID_Y_SPACE + gridX * GRID_Y_OFFSET;
      return p;
    },
    pixelToGrid(p) {
      var near = [];
      const radius = MAP_SIZE;
      for (let y = radius; y >= -radius; y--) {
        for (let x = -radius; x <= radius; x++) {
          const o = this.gridToPixel(x, y, radius);
          const dx = p.x - o.x;
          const dy = p.y - o.y;
          const d = dx * dx + dy * dy;
          if (d < RADIUS * RADIUS) {
            near.push([x, y]);
          }
        }
      }
      return near;
    },
    drawPoly(p, points, ctx, col, row, type, color, planetType) {
      // p.x, p.y is center
      ctx.setTransform(1, 0, 0, 1, p.x, p.y);
      var i = 0;
      ctx.beginPath();
      while (i < points.length) {
        const p2 = points[i++];
        ctx.lineTo(p2.x, p2.y);
      }
      ctx.closePath();
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.textAlign = "center";

      if (type == "void") {
        ctx.fill();
        ctx.fillStyle = color;
      }

      //ctx.fillText(`(${col},${row})`, 0, 0);
      if (type == "planet") {
        this.drawPlanet(p, RADIUS - 30, ctx, planetType);
      } else if (type == "asteroid") {
        this.drawAsteroids(p, RADIUS / 6, ctx);
      }
    },

    drawAsteroids(p, radius, ctx) {
      var asteroidNumber = Math.floor(Math.random() * 6) + 4;
      var i = 0;
      console.log(asteroidNumber);
      while (i < asteroidNumber) {
        var maxX = p.x + GRID_X_SPACE / 2;
        var minX = p.x - GRID_X_SPACE / 2;
        var maxY = p.y + GRID_Y_SPACE / 2;
        var minY = p.y - GRID_Y_SPACE / 2;

        var randX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
        var randY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
        var gridRand = this.pixelToGrid(P2(randX, randY))[0];
        var grid = this.pixelToGrid(P2(p.x, p.y))[0];
        var distance = this.distance(gridRand[0], gridRand[1], grid[0], grid[1]);
        while (distance != 0) {
          randX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
          randY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
          gridRand = this.pixelToGrid(P2(randX, randY))[0];
          grid = this.pixelToGrid(P2(p.x, p.y))[0];
          distance = this.distance(gridRand[0], gridRand[1], grid[0], grid[1]);
        }

        var size = Math.floor(Math.random() * 20) + -10;

        this.drawCube(size, randX, randY, ctx);
        i++;
      }
    },

    drawCube(size, x, y, ctx) {
      ctx.setTransform(1, 0, 0, 1, x, y);
      var asteroids = new Image();
      asteroids.src = "https://pixelartmaker-data-78746291193.nyc3.digitaloceanspaces.com/image/dcf613a5c64cc75.png";
      ctx.drawImage(asteroids, -30, -30, 30 + size, 30 + size);
    },

    drawPlanet(p, radius, ctx, type) {
      var size = Math.floor(Math.random() * 20) + -10;
      if (type == "agri") {
        var planet = new Image();
        planet.src =
          "https://static.vecteezy.com/system/resources/previews/013/528/882/original/pixel-art-planet-earth-png.png";

        ctx.drawImage(planet, -50, -50, 100 + size, 100 + size);
      } else if (type == "sun") {
        var planet = new Image();
        planet.src =
          "https://cdn.gamedevmarket.net/wp-content/uploads/20210802130653/3ccfc304882f325fd8fabc14e6b7162f.png";

        ctx.drawImage(planet, -250, -140, 500, 500);
      } else if (type == "mine") {
        var planet = new Image();
        planet.src =
          " https://static.vecteezy.com/system/resources/previews/013/519/073/original/pixel-art-fictional-planet-png.png";

        ctx.drawImage(planet, -50, -50, 100 + size, 100 + size);
      } else if (type == "indu") {
        var planet = new Image();
        planet.src =
          "https://static.vecteezy.com/system/resources/previews/013/519/075/original/pixel-art-fictional-planet-png.png";

        ctx.drawImage(planet, -50, -50, 100 + size, 100 + size);
      } else if (type == "athmo") {
        var planet = new Image();
        planet.src =
          "https://static.vecteezy.com/system/resources/thumbnails/013/519/069/small_2x/pixel-art-fictional-planet-png.png";

        ctx.drawImage(planet, -50, -50, 100 + size, 100 + size);
      }

      /*else {
        var points = this.createPoly(radius, 12);
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
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.fillStyle = color;
      }*/
    },

    createPoly(radius, sides, points = []) {
      const step = TAU / sides;
      var ang = 0,
        i = sides;
      while (i--) {
        points.push(P2(radius * Math.cos(ang), radius * Math.sin(ang)));
        ang += step;
      }
      return points;
    },
    handleHexClick(event) {
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
