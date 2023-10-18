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
 * The Graphile heart has 8 points. Starting at the top middle, we number the
 * points clockwise around the outside A-H. We also have two "center" points,
 * one is in the middle between D and F, and the other is offset to the right
 * of here.
 *
 *        H    B
 *  G     /'-.-'\     C
 *   \__/    A    \__/
 *    __|         |__
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
const MIDDLE = [600, 615];
const MIDDLE_OFFSET = [715, 615];
// const points = [A, B, C, D, E, F, G, H, M];

function makeSvg(
  title,
  pallette,
  colors,
  {
    border = false,
    svgPre = "",
    svgPost = "",
    css = "",
    M = MIDDLE_OFFSET,
    OFFSET = 0,
  } = {}
) {
  const string = `\
<?xml version="1.0" encoding="utf-8" standalone="no" ?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="1200" height="1200" version="1.1" viewBox="0 -${OFFSET} 1200 1200" xmlns="http://www.w3.org/2000/svg">
<!--

This file is Copyright © ${new Date().getUTCFullYear()} Benjie Gillam. All rights reserved.

-->
<style type="text/css">
polygon {
  stroke-width: 0;
  shape-rendering: geometricPrecision;
}\
${pallette
  .map(
    (c, i) => `
.seg${i} {
  fill: ${c};
  stroke: ${c};
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

${svgPre}

  <g class='base'>
    <polygon points="${F} ${G} ${H} ${M}" class="seg${colors[5]}" />
    <polygon points="${G} ${H} ${A} ${M}" class="seg${colors[6]}" />
    <polygon points="${H} ${A} ${B} ${M}" class="seg${colors[7]}" />
    <polygon points="${A} ${B} ${C} ${M}" class="seg${colors[0]}" />
    <polygon points="${B} ${C} ${D} ${M}" class="seg${colors[1]}" />
    <polygon points="${C} ${D} ${E} ${M}" class="seg${colors[2]}" />
    <polygon points="${D} ${E} ${F} ${M}" class="seg${colors[3]}" />
    <polygon points="${E} ${F} ${G} ${M}" class="seg${colors[4]}" />
    <polygon points="${F} ${G} ${M}" class="seg${colors[5]}" />
    ${
      border
        ? `<polygon points="${A} ${B} ${C} ${D} ${E} ${F} ${G} ${H} ${A}" class="heart-outline" />`
        : ""
    }
  </g>

${svgPost}

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
  ["#468bcc", "#4ba8ff", "#166ebf", "#0b457f", "#0c3861", "#ffffff"],
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
    svgPost: `
  <g class='face'>

    <polygon points="375,740 460,795 325,900" class="tusk left-tusk" />
    <polygon points="825,740 740,795 875,900" class="tusk right-tusk" />

    <polygon points="325,300 490,96 710,96 600,450" class="seg1 forehead-left" />
    <polygon points="490,96 710,96 875,300 600,450" class="seg0 forehead-top" />
    <polygon points="710,96 875,300 875,725 600,450" class="seg2 forehead-right no-stroke" />

    <polygon points="875,300 875,725 710,835 600,450" class="seg3 right-eye-area no-stroke" />

    <polygon points="875,725 710,835 600,1130 600,450" class="seg4 face-bottom-right no-stroke" />
    <polygon points="710,835 710,1075 600,1130 490,835 600,450" class="seg2 no-stroke trunk-highlight-right" />
    <polygon points="600,1130 490,1075 490,835 325,725 600,450" class="seg1 no-stroke trunk-highlight-left" />
    <polygon points="490,835 325,725 325,300 600,450" class="seg2 face-bottom-left no-stroke" />

    <polygon points="325,725 325,300 600,450" class="seg0 left-eye-area no-stroke" />


    <polygon points="490,96 710,96 875,300 875,725 710,835 710,1075 600,1130 490,1075 490,835 325,725 325,300" class="entire-face stroke-only" />

    <polygon points="385,415 515,455 385,505" class="eye left-eye" />
    <polygon points="815,415 685,455 815,505" class="eye right-eye" />


  </g>`,
  }
);

function deriv(start, stop, percent) {
  const x = start[0] + (stop[0] - start[0]) * percent;
  const y = start[1] + (stop[1] - start[1]) * percent;
  return [x, y];
}

function flipX(points) {
  return points.map(p => [1200 - p[0], p[1]]);
}

function makePoly(points, className) {
  return `<polygon points="${points.map(p => `${p[0]},${p[1]}`).join(" ")} ${
    points[0][0]
  },${points[0][1]}" class="${className}" />`;
}

{
  const M = [600, 800];
  const OFFSET = 50;
  const antEyeCoords = [
    deriv(B, C, 1 / 3),
    deriv(C, C, 1),
    deriv(C, E, 1 / 3),
    deriv(C, E, 1 / 4),
    deriv(C, M, 1 / 2),
    deriv(deriv(B, C, 1 / 3), F, 1 / 6),
  ];
  const antEyeR = makePoly(antEyeCoords, "seg4");
  const antEyeL = makePoly(flipX(antEyeCoords), "seg4");

  const at1 = deriv(D, E, 1 / 2);
  const at2 = deriv(D, E, 3 / 4);
  const atY = at2[1] + 75;
  const atY2 = atY + 125;
  const antTuskCoords = [
    M,
    at1,
    [at1[0], atY],
    [at2[0] - 50, atY2],
    [at2[0], atY],
    at2,
  ];
  const antTuskR = makePoly(antTuskCoords, "seg4");
  const antTuskL = makePoly(flipX(antTuskCoords), "seg4");

  const antAntennaCoords = [
    deriv(antEyeCoords[antEyeCoords.length - 1], A, 7 / 12),
    [antEyeCoords[0][0], -OFFSET],
    [C[0], B[1]],
    [1200, (2 / 3) * C[1]],
  ];
  const s = 36;
  antAntennaCoords.push([
    antAntennaCoords[2][0] - s,
    antAntennaCoords[2][1] + s,
  ]);
  antAntennaCoords.push([
    antAntennaCoords[1][0] + s / 3,
    antAntennaCoords[1][1] + 2 * s,
  ]);
  antAntennaCoords.push(deriv(antEyeCoords[antEyeCoords.length - 1], A, 1 / 6));

  const antAntennaR = makePoly(antAntennaCoords, "seg4");
  const antAntennaL = makePoly(flipX(antAntennaCoords), "seg4");

  const WORKER_ANT_SVG = makeSvg(
    "Worker Ant",
    ["#f0a420", "#b7561b", "#944822", "#331918", "#770000"],
    [1, 1, 2, 3, 2, 1, 0, 0],
    {
      M,
      OFFSET,
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
      svgPre: `
    <polygon points="${B} ${M} ${H}" class="seg2" />
    ${antTuskL}
    ${antTuskR}
`,
      svgPost: `
    ${antEyeR}
    ${antEyeL}
    ${antAntennaR}
    ${antAntennaL}
`,
    }
  );

  outputEl.innerHTML = WORKER_ANT_SVG;
}
