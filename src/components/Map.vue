<template>
  <div ref="container"></div>
</template>

<script>
import * as PIXI from "pixi.js";
import { mapActions } from "pinia";
import { useGameStore } from "../store/gameStore.js";

const P2 = (x, y) => ({ x, y });

export default {
  data() {
    return {
      EDGES: 6,
      RADIUS: 65,
      TAU: 2 * Math.PI,
      MAP_SIZE: 0,
      MAP: [],
      VOID: [],
      APP: null,
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
    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x000000,
      resolution: window.devicePixelRatio || 1,
    });
    this.$refs.container.appendChild(app.view);

    const texture = PIXI.Texture.from("/src/assets/starry.jpg");
    const background = new PIXI.Sprite(texture);

    // Set the background's initial position and scale to fit the screen size
    background.anchor.set(0.5);
    background.position.set(window.innerWidth / 2, window.innerHeight / 2);
    background.scale.set(Math.max(window.innerWidth, window.innerHeight) / background.width);

    app.stage.addChild(background);

    window.addEventListener("resize", () => {
      background.position.set(0, 0);
      background.tilePosition.set(0, 0);
      background.scale.set(Math.max(window.innerWidth, window.innerHeight) / background.width);
    });
    app.view.addEventListener("wheel", (e) => {
      e.preventDefault();
      const scaleFactor = 1.1;
      const delta = e.deltaY;
      if (delta < 0) {
        app.stage.scale.set(app.stage.scale.x / scaleFactor);
      } else if (delta > 0) {
        app.stage.scale.set(app.stage.scale.x * scaleFactor);
      }
      background.scale.set(Math.max(window.innerWidth, window.innerHeight) / background.width);
    });

    this.drawMap(app);
    // Enable dragging to scroll on the hexagonal grid map
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    app.view.addEventListener("mousedown", (e) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
      app.view.style.cursor = "grabbing";
    });
    app.view.addEventListener("mouseup", (e) => {
      isDragging = false;
      app.view.style.cursor = "grab";
    });
    app.view.addEventListener("mousemove", (e) => {
      if (isDragging) {
        const deltaX = e.clientX - prevX;
        const deltaY = e.clientY - prevY;
        app.stage.position.x += deltaX;
        app.stage.position.y += deltaY;
        prevX = e.clientX;
        prevY = e.clientY;
      }
    });

    let scale = 1;
    const MIN_SCALE = 0.5;
    const MAX_SCALE = 3;

    app.view.addEventListener("click", (event) => {
      // Convert the mouse position to grid coordinates
      const grid = this.pixelToGrid(event.x, event.y);
      console.log(grid);
    });

    app.view.addEventListener("wheel", (e) => {
      e.preventDefault();
      const scaleFactor = 1.1;
      const delta = e.deltaY;
      if (delta < 0) {
        scale /= scaleFactor;
        if (scale < this.MIN_SCALE) {
          scale = this.MIN_SCALE;
        }
        app.stage.scale.set(scale);
      } else if (delta > 0) {
        scale *= scaleFactor;
        if (scale > this.MAX_SCALE) {
          scale = this.MAX_SCALE;
        }
        app.stage.scale.set(scale);
      }
    });
    this.APP = app;
  },
  watch: {
    MAP(newValue, oldValue) {
      this.onMapChanged();
    },
  },
  methods: {
    ...mapActions(useGameStore, ["getMapById"]),
    onMapChanged() {
      this.drawMap(this.APP);
    },
    drawMap(app) {
      const hexPoints = this.createPoly(this.EDGES, []);
      const center = { x: 0, y: 0 };

      this.drawSun(app, center);
      for (let i in this.MAP) {
        var hexa = JSON.parse(this.MAP[i]);
        var type = hexa.type;
        var coord = hexa.coord;
        var planet_type = hexa.planet_type;
        var size_variation = hexa.size_variation;
        if (coord.x * coord.y > 0 && Math.abs(coord.x) + Math.abs(coord.y) > this.MAP_SIZE) continue;
        const hexCenter = this.gridToPixel(coord.y, coord.x, center);

        if (this.distance(coord.x, coord.y) > 2) {
          const hex = new PIXI.Graphics();
          hex.beginFill(0xffffff, 0);
          hex.lineStyle(2.5, 0xffffff, 1);
          hex.drawPolygon(hexPoints.map((p) => new PIXI.Point(p.x, p.y)));
          hex.x = hexCenter.x;
          hex.y = hexCenter.y;
          app.stage.addChild(hex);

          if (type == "planet") {
            var texture = null;
            if (planet_type == "agri") {
              texture = PIXI.Texture.from("src/assets/planet-agri.webp");
            } else if (planet_type == "indu") {
              texture = PIXI.Texture.from("src/assets/planet-indu.webp");
            } else if (planet_type == "atmo") {
              texture = PIXI.Texture.from("src/assets/planet-atmo.webp");
            } else if (planet_type == "mine") {
              texture = PIXI.Texture.from("src/assets/planet-mine.webp");
            }
            const image = new PIXI.Sprite(texture);
            image.anchor.set(0.5); // set the anchor point to the center of the image
            image.width = (this.RADIUS * this.MAP_SIZE) / 40; // set the width and height to fit inside the hexagon
            image.height = (this.RADIUS * this.MAP_SIZE) / 40;
            image.x = hexCenter.x;
            image.y = hexCenter.y;
            app.stage.addChild(image);
          }
        }
      }
    },
    drawSun(app, center) {
      const hexCenter = this.gridToPixel(0, 0, center);
      console.log(hexCenter);
      const texture = PIXI.Texture.from("src/assets/sun.png");
      const image = new PIXI.Sprite(texture);
      image.anchor.set(0.5); // set the anchor point to the center of the image
      image.width = (this.RADIUS * this.MAP_SIZE) / 10; // set the width and height to fit inside the hexagon
      image.height = (this.RADIUS * this.MAP_SIZE) / 10;
      image.x = hexCenter.x;
      image.y = hexCenter.y;
      app.stage.addChild(image);
    },
    onClick(planetType) {
      console.log(planetType);
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
    gridToPixel(gridY, gridX, p = {}) {
      p.x = (gridY + 4) * this.GRID_X_SPACE;
      p.y = (gridX + 4) * this.GRID_Y_SPACE + gridY * this.GRID_Y_OFFSET;
      return p;
    },
    pixelToGrid(Px, Py) {
      var nearest = { d: this.MAP_WIDTH, x: 0, y: 0 };
      const radius = this.MAP_SIZE;
      for (let y = radius; y >= -radius; y--) {
        for (let x = -radius; x <= radius; x++) {
          const o = this.gridToPixel(x, y);
          const dx = Px - o.x;
          const dy = Py - o.y;
          const d = dx * dx + dy * dy;
          if (d <= nearest.d) {
            nearest = { d: d, x: x, y: y };
          }
        }
      }
      return nearest;
    },
    createPoly(sides, points = []) {
      const step = this.TAU / sides;
      let ang = 0,
        i = sides;
      while (i--) {
        points.push({ x: this.RADIUS * Math.cos(ang), y: this.RADIUS * Math.sin(ang) });
        ang += step;
      }
      return points;
    },
  },
  async created() {
    var response = await this.getMapById("he3oYowBm4kmV3S5nWSa");
    this.MAP = response.map;
    this.MAP_SIZE = response.size;
    console.log("map changed");
  },
};
</script>
