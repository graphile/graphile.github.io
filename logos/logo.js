const outputEl = document.getElementById("output");
outputEl.innerHTML = "hi";

/**
 * The Graphile heart has 9 points. Starting at the top middle, we number the
 * points clockwise around the outside A-H, and then M for the middle (which is
 * slightly offset from center):
 *
 *        H    B
 *  G     /'-.-'\     C
 *   \__/    A    \__/
 *    __|     M   |__
 *   /   \       /   \
 *  F      \   /      D
 *           V
 *           E
 *
 * The Graphile heart is defined in a 1200x1200 square, it doesn't quite touch
 * the edges (25 padding on each side).
 *
 * When colouring the heart, we want to avoid there being "gaps" between the
 * colours, so instead of colouring the triangles, we turn them into polygons
 * and cover the next triangle too. Thus the first triangle ABM is actually
 * built as ABCM. From here the segments are numbered in clockwise order - note
 * that every triangle has M as a point in it, and that the last triangle only
 * has the three points.
 */
const A = [600, 130];
const B = [940, 25];
const C = [1175, 360];
const D = [1100, 615];
const E = [600, 1055];
const F = [100, 615];
const G = [25, 360];
const H = [260, 25];
const M = [715, 615];
const points = [A, B, C, D, E, F, G, H, M];

const HEART_PALETTE = ["#cd4948", "#fd504e", "#c0201c", "#7e120e", "#610f0d"];
const HEART_COLORS = [1, 2, 3, 4, 3, 2, 1, 0];

function makeSvg(pallette, colors, border = false) {
  const svg = `\
<?xml version="1.0" encoding="utf-8" standalone="no" ?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="1200" height="1200" version="1.1" xmlns="http://www.w3.org/2000/svg">
<!--

This file is Copyright © ${new Date().getUTCFullYear()} Benjie Gillam. All rights reserved.

-->
<style type="text/css">
polygon {
  stroke-width: 0;
  shape-rendering: geometricPrecision;
}
${colors
  .map(
    (c, i) => `\
.seg${i + 1} {
  fill: ${pallette[c]};
  stroke: ${pallette[c]};
}`
  )
  .join("\n")}
.heart-outline {
  fill: transparent;
  stroke: black;
  stroke-width: 8;
  stroke-linejoin: round;
}
</style>

  <desc>Graphile logo</desc>
  <polygon points="${F} ${G} ${H} ${M}" class="seg6" />
  <polygon points="${G} ${H} ${A} ${M}" class="seg7" />
  <polygon points="${H} ${A} ${B} ${M}" class="seg8" />
  <polygon points="${A} ${B} ${C} ${M}" class="seg1" />
  <polygon points="${B} ${C} ${D} ${M}" class="seg2" />
  <polygon points="${C} ${D} ${E} ${M}" class="seg3" />
  <polygon points="${D} ${E} ${F} ${M}" class="seg4" />
  <polygon points="${E} ${F} ${G} ${M}" class="seg5" />
  <polygon points="${F} ${G} ${M}" class="seg6" />

  ${
    border
      ? `<polygon points="${A} ${B} ${C} ${D} ${E} ${F} ${G} ${H} ${A}" class="heart-outline" />`
      : ""
  }


</svg>
`;
  return svg;
}
outputEl.innerHTML = makeSvg(HEART_PALETTE, HEART_COLORS);
