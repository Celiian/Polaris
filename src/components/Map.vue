<template>
  <div>
    <canvas ref="hexmap" :width="660" :height="624"></canvas>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hexagonAngle: 0.523598776, // 30 degrees in radians
      sideLength: 10,
      boardWidth: 100,
      boardHeight: 100,
      hexHeight: 0,
      hexRadius: 0,
      hexRectangleHeight: 0,
      hexRectangleWidth: 0,
    };
  },
  methods: {
    drawBoard(ctx, width, height) {
      for (let i = 0; i < width; ++i) {
        for (let j = 0; j < height; ++j) {
          this.drawHexagon(
            ctx,
            i * this.hexRectangleWidth + (j % 2) * this.hexRadius,
            j * (this.sideLength + this.hexHeight),
            false
          );
        }
      }
    },
    drawHexagon(ctx, x, y, fill) {
      const fill = fill || false;

      ctx.beginPath();
      ctx.moveTo(x + this.hexRadius, y);
      ctx.lineTo(x + this.hexRectangleWidth, y + this.hexHeight);
      ctx.lineTo(x + this.hexRectangleWidth, y + this.hexHeight + this.sideLength);
      ctx.lineTo(x + this.hexRadius, y + this.hexRectangleHeight);
      ctx.lineTo(x, y + this.sideLength + this.hexHeight);
      ctx.lineTo(x, y + this.hexHeight);
      ctx.closePath();

      if (fill) {
        ctx.fill();
      } else {
        ctx.stroke();
      }
    },
  },
  mounted() {
    this.hexHeight = Math.sin(this.hexagonAngle) * this.sideLength;
    this.hexRadius = Math.cos(this.hexagonAngle) * this.sideLength;
    this.hexRectangleHeight = this.sideLength + 2 * this.hexHeight;
    this.hexRectangleWidth = 2 * this.hexRadius;

    const canvas = this.$refs.hexmap;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "#CCCCCC";
    ctx.lineWidth = 1;

    this.drawBoard(ctx, this.boardWidth, this.boardHeight);

    canvas.addEventListener("mousemove", (eventInfo) => {
      const rect = canvas.getBoundingClientRect();
      const x = eventInfo.clientX - rect.left;
      const y = eventInfo.clientY - rect.top;

      const hexY = Math.floor(y / (this.hexHeight + this.sideLength));
      const hexX = Math.floor((x - (hexY % 2) * this.hexRadius) / this.hexRectangleWidth);

      const screenX = hexX * this.hexRectangleWidth + (hexY % 2) * this.hexRadius;
      const screenY = hexY * (this.hexHeight + this.sideLength);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.drawBoard(ctx, this.boardWidth, this.boardHeight);

      if (hexX >= 0 && hexX < this.boardWidth) {
        if (hexY >= 0 && hexY < this.boardHeight) {
          ctx.fillStyle = "#000000";
          this.drawHexagon(ctx, screenX, screenY, true);
        }
      }
    });
  },
};
</script>

<style scoped>
canvas {
  border: 0;
  display: block;
}
</style>
