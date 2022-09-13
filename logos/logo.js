const outputEl = document.getElementById("output");
outputEl.innerHTML = "hi";

const XML_REPLACEMENTS = {
  "<": "&lt;",
  ">": "&gt;",
  "&": "&amp;",
  '"': "&quot;",
  "'": "&apos;",
};
const escapeXML = str => str.replace(/[<>&"']/g, (_, l) => XML_REPLACEMENTS[l]);

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
// const points = [A, B, C, D, E, F, G, H, M];

function makeSvg(
  title,
  pallette,
  colors,
  { border = false, svg = "", css = "" } = {}
) {
  const string = `\
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
}\
${colors
  .map(
    (c, i) => `
.seg${i + 1} {
  fill: ${pallette[c]};
  stroke: ${pallette[c]};
}`
  )
  .join("")}\
${
  border
    ? `
.heart-outline {
  fill: transparent;
  stroke: black;
  stroke-width: 8;
  stroke-linejoin: round;
}`
    : ""
}
${css}
</style>

  <desc>${escapeXML(title)}</desc>
  <g class='base'>
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
  </g>

${svg}

</svg>
`;
  return string;
}

const GRAPHILE_HEART_SVG = makeSvg(
  "Graphile Heart",
  ["#cd4948", "#fd504e", "#c0201c", "#7e120e", "#610f0d"],
  [1, 2, 3, 4, 3, 2, 1, 0]
);

const POSTGRAPHILE_ELEPHANT_SVG = makeSvg(
  "PostGraphile Elephant",
  [
    "#468bcc",
    "#4ba8ff",
    "#166ebf",
    "#0b457f",
    "#0c3861",
    "#ffffff",
    "#000000",
    "transparent",
    "#082744",
  ],
  [0, 1, 0, 0, 0, 0, 1, 0],
  {
    css: `
.face .eye {
  fill: #ffffff;
  stroke: #ffffff;
}
.face .tusk {
  stroke: #000000;
  fill: #ffffff;
}
.face .no-stroke {
  stroke: transparent;
  stroke-opacity: 0;
}
.face .tusk,
.face .stroke-only,
.heart-outline {
  stroke: #082744;
  stroke-width: 8;
  stroke-linejoin: round;
}
.face .stroke-only,
.heart-outline {
  fill: transparent;
  fill-opacity: 0;
}`,
    svg: `
  <g class='face'>

    <polygon points="375,740 460,795 325,900" class="tusk left-tusk" />
    <polygon points="825,740 740,795 875,900" class="tusk right-tusk" />

    <polygon points="325,300 490,96 710,96 600,450" class="seg2 forehead-left" />
    <polygon points="490,96 710,96 875,300 600,450" class="seg1 forehead-top" />
    <polygon points="710,96 875,300 875,725 600,450" class="seg3 forehead-right no-stroke" />

    <polygon points="875,300 875,725 710,835 600,450" class="seg4 right-eye-area no-stroke" />

    <polygon points="875,725 710,835 600,1130 600,450" class="seg5 face-bottom-right no-stroke" />
    <polygon points="710,835 710,1075 600,1130 490,835 600,450" class="seg3 no-stroke trunk-highlight-right" />
    <polygon points="600,1130 490,1075 490,835 325,725 600,450" class="seg2 no-stroke trunk-highlight-left" />
    <polygon points="490,835 325,725 325,300 600,450" class="seg3 face-bottom-left no-stroke" />

    <polygon points="325,725 325,300 600,450" class="seg1 left-eye-area no-stroke" />


    <polygon points="490,96 710,96 875,300 875,725 710,835 710,1075 600,1130 490,1075 490,835 325,725 325,300" class="entire-face stroke-only" />

    <polygon points="385,415 515,455 385,505" class="eye left-eye" />
    <polygon points="815,415 685,455 815,505" class="eye right-eye" />


  </g>`,
  }
);

outputEl.innerHTML = POSTGRAPHILE_ELEPHANT_SVG;
outputEl.innerHTML = GRAPHILE_HEART_SVG;
