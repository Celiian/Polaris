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
import { mapActions } from "pinia";
import { useGameStore } from "../store/myStore";

const P2 = (x, y) => ({ x, y });

export default {
  data() {
    return {
      EDGES: 6,
      RADIUS: 65,
      TAU: 2 * Math.PI,
      MAP_SIZE: 27,
      MAP: [],
    };
  },
  computed: {
    EDGE_LEN() {
      return Math.sin(Math.PI / this.EDGES) * this.RADIUS * 2;
    },
    GRID_Y_SPACE() {
      return Math.cos(Math.PI / this.EDGES) * this.RADIUS * 2;
    },
    GRID_Y_OFFSET() {
      return this.GRID_Y_SPACE * 0.5;
    },
    MAP_WIDTH() {
      return (1.75 * this.MAP_SIZE + 2) * Math.round(this.GRID_Y_SPACE);
    },
    MAP_HEIGHT() {
      return (2.05 * this.MAP_SIZE + 2) * Math.round(this.GRID_Y_SPACE);
    },
    GRID_X_SPACE() {
      return this.RADIUS * 2 - this.EDGE_LEN * 0.5;
    },
  },
  mounted() {
    var canvas = document.getElementById("canvas");
    canvas.setAttribute("width", this.MAP_WIDTH + "px");
    canvas.setAttribute("height", this.MAP_HEIGHT + "px");
    this.drawGrid(this.MAP_SIZE, this.createPoly(this.RADIUS, this.EDGES));

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
  watch: {
    MAP(newValue, oldValue) {
      this.onMapChanged();
    },
  },
  methods: {
    ...mapActions(useGameStore, ["getMapById"]),
    onMapChanged() {
      this.drawGrid(this.MAP_SIZE, this.createPoly(this.RADIUS, this.EDGES));
    },
    drawGrid(map_size, hexPoints) {
      const ctx = this.$refs.canvas.getContext("2d");
      ctx.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);
      const center = P2();
      var color = "#FFF0";
      ctx.fillStyle = color;

      for (var hexa in this.MAP) {
        var coord = this.MAP[hexa].coord;
        var planetType = this.MAP[hexa].planet_type;
        var type = this.MAP[hexa].type;

        const hexCenter = this.gridToPixel(coord.y, coord.x, map_size, center);
        if (type == "sun") {
          this.drawPlanet(hexCenter, ctx, type);
        } else if (type == "void") {
          const hexCenter = this.gridToPixel(coord.y, coord.x, map_size, center);
          if (this.distance(coord.x, coord.y) < 3) {
            this.drawPoly(hexCenter, hexPoints, ctx, coord.y, coord.x, type, "#FFF0", planetType);
          } else {
            this.drawPoly(hexCenter, hexPoints, ctx, coord.y, coord.x, type, "#FFF", planetType);
          }
        } else {
          const hexCenter = this.gridToPixel(coord.y, coord.x, map_size, center);
          this.drawPoly(hexCenter, hexPoints, ctx, coord.y, coord.x, type, "#FFF0", planetType);
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
      p.x = (gridX + radius + 1) * this.GRID_X_SPACE;
      p.y = (gridY + radius + 1) * this.GRID_Y_SPACE + gridX * this.GRID_Y_OFFSET;
      return p;
    },
    pixelToGrid(p) {
      var nearest = { d: this.MAP_WIDTH, x: 0, y: 0 };
      const radius = this.MAP_SIZE;
      for (let y = radius; y >= -radius; y--) {
        for (let x = -radius; x <= radius; x++) {
          const o = this.gridToPixel(x, y, radius);
          const dx = p.x - o.x;
          const dy = p.y - o.y;
          const d = dx * dx + dy * dy;
          if (d <= nearest.d) {
            nearest = { d: d, x: x, y: y };
          }
        }
      }
      return nearest;
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
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.textAlign = "center";

      if (type == "void") {
        ctx.fill();
        ctx.fillStyle = color + "0";
      }
      ctx.closePath();

      //ctx.fillText(`(${col},${row})`, 0, 0);
      if (type == "planet") {
        this.drawPlanet(p, ctx, planetType);
      } else if (type == "asteroid") {
        this.drawAsteroids(p, ctx);
      }
    },

    drawAsteroids(p, ctx) {
      var asteroidNumber = Math.floor(Math.random() * 4) + 3;
      var i = 0;

      while (i < asteroidNumber) {
        var maxX = p.x + this.GRID_X_SPACE / 2;
        var minX = p.x - this.GRID_X_SPACE / 2;
        var maxY = p.y + this.GRID_Y_SPACE / 2;
        var minY = p.y - this.GRID_Y_SPACE / 2;

        var randX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
        var randY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
        var gridRand = this.pixelToGrid(P2(randX, randY));
        var grid = this.pixelToGrid(P2(p.x, p.y));
        var distance = this.distance(gridRand.x, gridRand.y, grid.x, grid.y);
        console.log(distance);
        while (distance != 0) {
          randX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
          randY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
          gridRand = this.pixelToGrid(P2(randX, randY));
          grid = this.pixelToGrid(P2(p.x, p.y));
          distance = this.distance(gridRand.x, gridRand.y, grid.x, grid.y);
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

    drawPlanet(p, ctx, type) {
      var size = Math.floor(Math.random() * 20) + -10;
      if (type == "agri") {
        var planet = new Image();
        planet.src =
          "https://static.vecteezy.com/system/resources/previews/013/528/882/original/pixel-art-planet-earth-png.png";

        ctx.drawImage(planet, -50, -50, 100 + size, 100 + size);
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
      } else if (type == "atmo") {
        var planet = new Image();
        planet.src =
          "https://static.vecteezy.com/system/resources/thumbnails/013/519/069/small_2x/pixel-art-fictional-planet-png.png";

        ctx.drawImage(planet, -50, -50, 100 + size, 100 + size);
      } else if (type == "sun") {
        var planet = new Image();
        planet.src =
          "https://cdn.gamedevmarket.net/wp-content/uploads/20210802130653/3ccfc304882f325fd8fabc14e6b7162f.png";

        ctx.drawImage(planet, -250, -140, 500, 500);
      }
    },

    createPoly(radius, sides, points = []) {
      const step = this.TAU / sides;
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
    },
  },
  async created() {
    var response = await this.getMapById("yAWecbpov6mh9bY0IiSO");
    this.MAP = response.map;
    this.MAP_SIZE = response.size;
    console.log("map changed");
  },
};
</script>
