/**
 * Client-side CAD generation: 2D DXF blocks (AutoCAD R12) and 3D ASCII STL
 * solids built parametrically from the ASME dimension tables in src/data/cad.ts.
 */
import { flangeKinds, type CadKind, type FlangeDim, type PipeDim, type FittingDim } from "@/data/cad";

export type CadUnit = "mm" | "in";

const isFlangeKind = (kind: CadKind) => flangeKinds.includes(kind);
const isElbow = (kind: CadKind) =>
  kind === "elbow90" || kind === "elbow45" || kind === "elbow90sr" || kind === "elbow45sr";
const isBranch = (kind: CadKind) =>
  kind === "tee" || kind === "reducing-tee" || kind === "cross" || kind === "lateral";
const isAxial = (kind: CadKind) =>
  kind === "reducer" || kind === "reducer-ecc" || kind === "cap" || kind === "pipe" || kind === "stub-end";
const sweepOf = (kind: CadKind) => (kind === "elbow45" || kind === "elbow45sr" ? 45 : 90);

export const MM = 25.4;
export const conv = (inches: number, unit: CadUnit) => (unit === "mm" ? inches * MM : inches);

/* ------------------------------------------------------------------ */
/* DXF                                                                 */
/* ------------------------------------------------------------------ */

type Ent = string[];

function circle(cx: number, cy: number, r: number, layer = "GEOM"): Ent {
  return ["0", "CIRCLE", "8", layer, "10", cx.toFixed(4), "20", cy.toFixed(4), "30", "0.0", "40", r.toFixed(4)];
}
function line(x1: number, y1: number, x2: number, y2: number, layer = "GEOM"): Ent {
  return [
    "0", "LINE", "8", layer,
    "10", x1.toFixed(4), "20", y1.toFixed(4), "30", "0.0",
    "11", x2.toFixed(4), "21", y2.toFixed(4), "31", "0.0",
  ];
}
function arc(cx: number, cy: number, r: number, a1: number, a2: number, layer = "GEOM"): Ent {
  return [
    "0", "ARC", "8", layer,
    "10", cx.toFixed(4), "20", cy.toFixed(4), "30", "0.0",
    "40", r.toFixed(4), "50", a1.toFixed(2), "51", a2.toFixed(2),
  ];
}
function text(x: number, y: number, h: number, value: string, layer = "TEXT"): Ent {
  return ["0", "TEXT", "8", layer, "10", x.toFixed(4), "20", y.toFixed(4), "30", "0.0", "40", h.toFixed(3), "1", value];
}

function dxfDocument(entities: Ent[]): string {
  const body = entities.flat();
  return [
    "0", "SECTION", "2", "HEADER",
    "9", "$INSUNITS", "70", "4",
    "0", "ENDSEC",
    "0", "SECTION", "2", "ENTITIES",
    ...body,
    "0", "ENDSEC",
    "0", "EOF",
  ].join("\r\n");
}

export interface CadBuildOpts {
  unit: CadUnit;
  flange?: FlangeDim | undefined;
  pipe?: PipeDim | undefined;
  fitting?: FittingDim | undefined;
  wall?: number | undefined;
  /** Elbow bend radius in inches; defaults to the long-radius table value. */
  bendRadius?: number | undefined;
  /** Overall length in inches for stub ends and cut spools. */
  overallLength?: number | undefined;
}

/** Inch dimensions shared by the specification table and both CAD formats. */
export function elbowDimensions(kind: CadKind, opts: CadBuildOpts) {
  if (!isElbow(kind) || !opts.fitting) return undefined;
  const bendRadius = opts.bendRadius ?? opts.fitting.elbow90;
  return {
    bendRadius,
    centreToEnd: sweepOf(kind) === 90 ? bendRadius : bendRadius * Math.tan(Math.PI / 8),
  };
}

export const stubOverallLength = (opts: CadBuildOpts) => opts.overallLength ?? 4;

export function buildDxf(
  kind: CadKind,
  opts: CadBuildOpts & { title: string },
): string {
  const u = opts.unit;
  const c = (v: number) => conv(v, u);
  const ents: Ent[] = [];
  const label = (v: number) => `${v.toFixed(2)} ${u}`;

  if (opts.flange && isFlangeKind(kind)) {
    const f = opts.flange;
    const R = c(f.od) / 2;
    ents.push(circle(0, 0, R));
    ents.push(circle(0, 0, c(f.bc) / 2, "BOLT-CIRCLE"));
    if (kind !== "blind") {
      ents.push(circle(0, 0, c(f.bore) / 2, "BORE"));
      ents.push(circle(0, 0, c(f.hub) / 2, "HUB"));
    }
    // raised face 1/16" (Class 150/300) drawn as reference circle
    ents.push(circle(0, 0, c(f.bore) / 2 + c(0.5), "RAISED-FACE"));
    for (let i = 0; i < f.bolts; i++) {
      const a = (2 * Math.PI * i) / f.bolts + Math.PI / f.bolts;
      const bx = (c(f.bc) / 2) * Math.cos(a);
      const by = (c(f.bc) / 2) * Math.sin(a);
      ents.push(circle(bx, by, c(f.hole) / 2, "BOLT-HOLES"));
      ents.push(line(bx - c(f.hole), by, bx + c(f.hole), by, "CENTRELINE"));
      ents.push(line(bx, by - c(f.hole), bx, by + c(f.hole), "CENTRELINE"));
    }
    ents.push(line(-R * 1.15, 0, R * 1.15, 0, "CENTRELINE"));
    ents.push(line(0, -R * 1.15, 0, R * 1.15, "CENTRELINE"));
    const h = R * 0.09;
    let ty = -R * 1.3;
    const rows = [
      opts.title,
      `Flange OD ${label(c(f.od))} · Thickness ${label(c(f.tf))}`,
      `Bolt circle ${label(c(f.bc))} · ${f.bolts} holes dia ${label(c(f.hole))}`,
      kind === "blind" ? "Blind — no bore" : `Bore ${label(c(f.bore))} · Hub OD ${label(c(f.hub))} · LTH ${label(c(f.length))}`,
      "Nominal dimensions per ASME B16.5 — verify against current edition",
      "Trishul Metals & Alloys · www.trishulmetal.com",
    ];
    for (const r of rows) {
      ents.push(text(-R, ty, h, r));
      ty -= h * 1.8;
    }
  } else if (isElbow(kind)) {
    const dimensions = elbowDimensions(kind, opts);
    if (!dimensions) return dxfDocument(ents);
    const p = opts.pipe!;
    const bendR = c(dimensions.bendRadius);
    const sweep = sweepOf(kind);
    const A = c(dimensions.centreToEnd);
    const ro = c(p.od) / 2;
    ents.push(arc(0, 0, bendR, 0, sweep, "CENTRELINE"));
    ents.push(arc(0, 0, bendR + ro, 0, sweep));
    ents.push(arc(0, 0, bendR - ro, 0, sweep));
    ents.push(line(bendR - ro, 0, bendR + ro, 0));
    const ar = (sweep * Math.PI) / 180;
    ents.push(
      line(
        (bendR - ro) * Math.cos(ar), (bendR - ro) * Math.sin(ar),
        (bendR + ro) * Math.cos(ar), (bendR + ro) * Math.sin(ar),
      ),
    );
    const h = bendR * 0.07;
    let ty = -bendR * 0.25;
    for (const r of [
      opts.title,
      `Pipe OD ${label(c(p.od))} · Wall ${label(c(opts.wall ?? p.s40))}`,
      `Centre-to-end ${label(A)} · Bend radius ${label(bendR)}`,
      "Nominal per ASME B16.9 — verify against current edition",
      "Trishul Metals & Alloys · www.trishulmetal.com",
    ]) {
      ents.push(text(0, ty, h, r));
      ty -= h * 1.8;
    }
  } else if (isBranch(kind)) {
    const fit = opts.fitting!;
    const p = opts.pipe!;
    const C = c(fit.tee);
    const ro = c(p.od) / 2;
    const br = kind === "reducing-tee" ? ro * 0.7 : ro;
    ents.push(line(-C, ro, -br, ro));
    ents.push(line(br, ro, C, ro));
    ents.push(line(-br, ro, -br, C));
    ents.push(line(br, ro, br, C));
    ents.push(line(-br, C, br, C));
    if (kind === "cross") {
      ents.push(line(-C, -ro, -ro, -ro));
      ents.push(line(ro, -ro, C, -ro));
      ents.push(line(-ro, -ro, -ro, -C));
      ents.push(line(ro, -ro, ro, -C));
      ents.push(line(-ro, -C, ro, -C));
    } else {
      ents.push(line(-C, -ro, C, -ro));
    }
    ents.push(line(-C, -ro, -C, ro));
    ents.push(line(C, -ro, C, ro));
    ents.push(line(-C * 1.2, 0, C * 1.2, 0, "CENTRELINE"));
    ents.push(line(0, -ro * 1.4, 0, C * 1.2, "CENTRELINE"));
    const h = C * 0.08;
    let ty = -C * 0.6;
    for (const r of [
      opts.title,
      `Run and branch OD ${label(c(p.od))} · Wall ${label(c(opts.wall ?? p.s40))}`,
      `Centre-to-end run and outlet ${label(C)}`,
      "Nominal per ASME B16.9 — verify against current edition",
      "Trishul Metals & Alloys · www.trishulmetal.com",
    ]) {
      ents.push(text(-C, ty, h, r));
      ty -= h * 1.8;
    }
  } else if (isAxial(kind)) {
    const p = opts.pipe!;
    const ro = c(p.od) / 2;
    const wall = c(opts.wall ?? p.s40);
    const L = kind === "stub-end" ? c(stubOverallLength(opts))
      : kind === "pipe" ? conv(39.37, u) : c(kind === "cap" ? opts.fitting!.cap : opts.fitting!.reducer);
    const r2 = kind === "reducer" || kind === "reducer-ecc" ? ro * 0.72 : ro;
    // Eccentric reducer: flat bottom, outlet offset upward-flat (top reduces by full difference).
    const top2 = kind === "reducer-ecc" ? -ro + 2 * r2 : r2;
    const bot2 = kind === "reducer-ecc" ? -ro : -r2;
    ents.push(line(0, -ro, 0, ro));
    ents.push(line(0, ro, L, top2));
    ents.push(line(0, -ro, L, bot2));
    if (kind !== "cap") ents.push(line(L, bot2, L, top2));
    else ents.push(arc(L - r2 * 0.5, 0, r2, -90, 90));
    ents.push(line(-ro * 0.3, 0, L + ro * 0.3, 0, "CENTRELINE"));
    const h = ro * 0.16;
    let ty = -ro * 1.6;
    for (const r of [
      opts.title,
      `OD ${label(c(p.od))} · Wall ${label(wall)} · Length ${label(L)}`,
      kind === "reducer" ? "Concentric reduction — outlet OD one size down" : "",
      kind === "reducer-ecc" ? "Eccentric reduction — flat side on common tangent" : "",
      "Nominal per ASME B16.9 / B36.10M — verify against current edition",
      "Trishul Metals & Alloys · www.trishulmetal.com",
    ].filter(Boolean)) {
      ents.push(text(0, ty, h, r));
      ty -= h * 1.8;
    }
  }

  return dxfDocument(ents);
}

/* ------------------------------------------------------------------ */
/* STL                                                                 */
/* ------------------------------------------------------------------ */

export type V3 = [number, number, number];
export type Tri = [V3, V3, V3];

function sub(a: V3, b: V3): V3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}
function cross(a: V3, b: V3): V3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}
function normal(t: Tri): V3 {
  const n = cross(sub(t[1], t[0]), sub(t[2], t[0]));
  const len = Math.hypot(n[0], n[1], n[2]) || 1;
  return [n[0] / len, n[1] / len, n[2] / len];
}

function stlDocument(name: string, tris: Tri[]): string {
  const out: string[] = [`solid ${name}`];
  for (const t of tris) {
    const n = normal(t);
    out.push(`facet normal ${n[0].toFixed(6)} ${n[1].toFixed(6)} ${n[2].toFixed(6)}`);
    out.push("  outer loop");
    for (const v of t) out.push(`    vertex ${v[0].toFixed(4)} ${v[1].toFixed(4)} ${v[2].toFixed(4)}`);
    out.push("  endloop");
    out.push("endfacet");
  }
  out.push(`endsolid ${name}`);
  return out.join("\n");
}

/** Revolve a closed profile of [radius, z] points about the Z axis. */
function revolve(profile: [number, number][], seg = 64): Tri[] {
  const tris: Tri[] = [];
  const pt = (r: number, z: number, i: number): V3 => {
    const a = (2 * Math.PI * i) / seg;
    return [r * Math.cos(a), r * Math.sin(a), z];
  };
  for (let i = 0; i < seg; i++) {
    for (let j = 0; j < profile.length; j++) {
      const [r1, z1] = profile[j]!;
      const [r2, z2] = profile[(j + 1) % profile.length]!;
      const a = pt(r1, z1, i);
      const b = pt(r2, z2, i);
      const cc = pt(r2, z2, i + 1);
      const d = pt(r1, z1, i + 1);
      if (r1 > 1e-6 || r2 > 1e-6) {
        tris.push([a, b, cc]);
        tris.push([a, cc, d]);
      }
    }
  }
  return tris;
}

/** Sweep an annulus along a circular arc in the XZ plane (a bend). */
function sweepBend(ro: number, ri: number, bendR: number, sweepDeg: number, seg = 48, ring = 40): Tri[] {
  const tris: Tri[] = [];
  const steps = Math.max(8, Math.round((sweepDeg / 90) * seg));
  const point = (radius: number, s: number, k: number): V3 => {
    const phi = (sweepDeg * Math.PI * s) / (180 * steps);
    const theta = (2 * Math.PI * k) / ring;
    const localR = bendR + radius * Math.cos(theta);
    return [localR * Math.cos(phi), localR * Math.sin(phi), radius * Math.sin(theta)];
  };
  for (const [rad, flip] of [[ro, false], [ri, true]] as [number, boolean][]) {
    for (let s = 0; s < steps; s++) {
      for (let k = 0; k < ring; k++) {
        const a = point(rad, s, k);
        const b = point(rad, s + 1, k);
        const c = point(rad, s + 1, k + 1);
        const d = point(rad, s, k + 1);
        if (flip) {
          tris.push([a, c, b], [a, d, c]);
        } else {
          tris.push([a, b, c], [a, c, d]);
        }
      }
    }
  }
  // end annuli
  for (const s of [0, steps]) {
    for (let k = 0; k < ring; k++) {
      const o1 = point(ro, s, k);
      const o2 = point(ro, s, k + 1);
      const i1 = point(ri, s, k);
      const i2 = point(ri, s, k + 1);
      if (s === 0) tris.push([o1, i1, i2], [o1, i2, o2]);
      else tris.push([o1, i2, i1], [o1, o2, i2]);
    }
  }
  return tris;
}

function tubeAlong(axis: "x" | "y" | "z", ro: number, ri: number, from: number, to: number, seg = 48): Tri[] {
  const profile: [number, number][] = [
    [ro, from],
    [ro, to],
    [ri, to],
    [ri, from],
  ];
  const tris = revolve(profile, seg);
  if (axis === "z") return tris;
  return tris.map(
    (t) =>
      t.map((v) => (axis === "x" ? [v[2], v[1], v[0]] : [v[0], v[2], v[1]]) as V3) as Tri,
  );
}

export function buildStl(kind: CadKind, opts: CadBuildOpts & { name: string }): string {
  return stlDocument(opts.name.replace(/\s+/g, "_"), buildTriangles(kind, opts));
}

/** Triangle soup for a part — shared by the STL writer and the 3D viewer. */
export function buildTriangles(kind: CadKind, opts: CadBuildOpts): Tri[] {
  const u = opts.unit;
  const c = (v: number) => conv(v, u);
  let tris: Tri[] = [];

  if (opts.flange && isFlangeKind(kind)) {
    const f = opts.flange;
    const R = c(f.od) / 2;
    const rb = c(f.bore) / 2;
    const rh = c(f.hub) / 2;
    const tf = c(f.tf);
    const Y = c(f.length);
    const rf = rb + c(0.5);
    let profile: [number, number][];
    if (kind === "blind") {
      profile = [
        [0, 0],
        [rf, 0],
        [rf, -c(0.06)],
        [R, -c(0.06)],
        [R, tf],
        [0, tf],
      ];
    } else if (kind === "slip-on") {
      profile = [
        [rb, 0],
        [rf, 0],
        [rf, -c(0.06)],
        [R, -c(0.06)],
        [R, tf],
        [rh, tf],
        [rh, Y],
        [rb, Y],
      ];
    } else {
      const rWeld = rb + c(0.3);
      profile = [
        [rb, 0],
        [rf, 0],
        [rf, -c(0.06)],
        [R, -c(0.06)],
        [R, tf],
        [rh, tf + c(0.12)],
        [rWeld, Y],
        [rb, Y],
      ];
    }
    tris = revolve(profile, 72);
  } else if (isElbow(kind)) {
    const p = opts.pipe!;
    const dimensions = elbowDimensions(kind, opts);
    if (!dimensions) return tris;
    const ro = c(p.od) / 2;
    const ri = ro - c(opts.wall ?? p.s40);
    const bendR = c(dimensions.bendRadius);
    tris = sweepBend(ro, ri, bendR, sweepOf(kind));
  } else if (isBranch(kind)) {
    const p = opts.pipe!;
    const fit = opts.fitting!;
    const ro = c(p.od) / 2;
    const ri = ro - c(opts.wall ?? p.s40);
    const C = c(fit.tee);
    const br = kind === "reducing-tee" ? ro * 0.7 : ro;
    const bri = kind === "reducing-tee" ? ri * 0.7 : ri;
    tris = [...tubeAlong("x", ro, ri, -C, C), ...tubeAlong("z", br, bri, 0, C)];
    if (kind === "cross") tris = [...tris, ...tubeAlong("z", ro, ri, -C, 0)];
    if (kind === "lateral") {
      const lat = tubeAlong("z", ro, ri, 0, C * 1.4).map(
        (t) =>
          t.map((v) => {
            const a = Math.PI / 4;
            return [v[0] + v[2] * Math.sin(a), v[1], v[2] * Math.cos(a)] as V3;
          }) as Tri,
      );
      tris = [...tubeAlong("x", ro, ri, -C, C), ...lat];
    }
  } else if (kind === "pipe") {
    const p = opts.pipe!;
    const ro = c(p.od) / 2;
    const ri = ro - c(opts.wall ?? p.s40);
    tris = tubeAlong("z", ro, ri, 0, conv(39.37, u));
  } else if (kind === "stub-end") {
    const p = opts.pipe!;
    const ro = c(p.od) / 2;
    const w = c(opts.wall ?? p.s40);
    const L = c(stubOverallLength(opts));
    const lap = ro * 1.45;
    tris = revolve(
      [
        [ro, 0],
        [ro, L - w * 1.2],
        [lap, L - w * 1.2],
        [lap, L],
        [ro - w, L],
        [ro - w, 0],
      ],
      64,
    );
  } else if (kind === "reducer" || kind === "reducer-ecc") {
    const p = opts.pipe!;
    const fit = opts.fitting!;
    const ro = c(p.od) / 2;
    const w = c(opts.wall ?? p.s40);
    const L = c(fit.reducer);
    const r2 = ro * 0.72;
    tris = revolve(
      [
        [ro, 0],
        [ro, L * 0.15],
        [r2, L * 0.85],
        [r2, L],
        [r2 - w, L],
        [r2 - w, L * 0.85],
        [ro - w, L * 0.15],
        [ro - w, 0],
      ],
      64,
    );
  } else if (kind === "cap") {
    const p = opts.pipe!;
    const fit = opts.fitting!;
    const ro = c(p.od) / 2;
    const w = c(opts.wall ?? p.s40);
    const E = c(fit.cap);
    const outer: [number, number][] = [];
    const inner: [number, number][] = [];
    const steps = 16;
    const straight = E * 0.25;
    for (let i = 0; i <= steps; i++) {
      const t = (Math.PI / 2) * (i / steps);
      outer.push([ro * Math.cos(t), straight + (E - straight) * Math.sin(t)]);
      inner.push([(ro - w) * Math.cos(t), straight + (E - straight - w) * Math.sin(t)]);
    }
    tris = revolve([[ro, 0], ...outer, ...inner.reverse(), [ro - w, 0]], 64);
  }

  return tris;
}

export function downloadText(filename: string, contents: string, mime = "text/plain") {
  const blob = new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
