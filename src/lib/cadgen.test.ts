import { describe, it as test } from "node:test";
import assert from "node:assert/strict";
import { fittingDims, pipeDims, srElbow90, stubEndLength } from "../data/cad";
import { buildDxf, buildTriangles, conv, elbowDimensions, stubOverallLength, type CadUnit } from "./cadgen";

function close(actual: number, expected: number, precision: number) {
  assert.ok(Math.abs(actual - expected) < 10 ** -precision, `${actual} differs from ${expected}`);
}

function entities(dxf: string, type: string): Record<string, string>[] {
  const pairs = dxf.split("\r\n");
  const result: Record<string, string>[] = [];
  let current: Record<string, string> | undefined;
  for (let i = 0; i < pairs.length; i += 2) {
    const code = pairs[i];
    const value = pairs[i + 1];
    if (code === undefined || value === undefined) continue;
    if (code === "0") {
      current = value === type ? {} : undefined;
      if (current) result.push(current);
    } else if (current) current[code] = value;
  }
  return result;
}

describe("CAD specification and export agreement", () => {
  const pipe = pipeDims.find((p) => p.npsNum === 6);
  const fitting = fittingDims.find((f) => f.npsNum === 6);
  if (!pipe || !fitting) throw new Error("NPS 6 fixture missing");

  for (const unit of ["in", "mm"] as CadUnit[]) {
    for (const kind of ["elbow90sr", "elbow45sr"] as const) {
      test(`${kind} uses NPS 6 SR dimensions in the table, DXF and STL (${unit})`, () => {
        const opts = { unit, pipe, fitting, bendRadius: srElbow90(6) };
        const dimensions = elbowDimensions(kind, opts);
        assert.equal(dimensions?.bendRadius, 6);
        assert.ok(dimensions);
        close(dimensions.centreToEnd, kind === "elbow90sr" ? 6 : 2.485281374, 8);
        const arcs = entities(buildDxf(kind, { ...opts, title: "SR" }), "ARC");
        close(Number(arcs.find((arc) => arc["8"] === "CENTRELINE")?.["40"]), conv(6, unit), 4);
        const vertices = buildTriangles(kind, opts).flat();
        close(Math.max(...vertices.map((v) => v[0])), conv(6 + pipe.od / 2, unit), 8);
      });
    }

    test(`stub-end DXF and STL share the displayed four-inch length (${unit})`, () => {
      const opts = { unit, pipe, fitting, overallLength: stubEndLength(6) };
      assert.equal(stubOverallLength(opts), 4);
      const lines = entities(buildDxf("stub-end", { ...opts, title: "Stub" }), "LINE").filter((line) => line["8"] === "GEOM");
      close(Math.max(...lines.map((line) => Number(line["11"]))), conv(4, unit), 4);
      const vertices = buildTriangles("stub-end", opts).flat();
      close(Math.max(...vertices.map((v) => v[2])), conv(4, unit), 8);
    });
  }

  test("stub-end default length agrees between both formats", () => {
    const opts = { unit: "in" as const, pipe, fitting };
    const lines = entities(buildDxf("stub-end", { ...opts, title: "Default" }), "LINE").filter((line) => line["8"] === "GEOM");
    assert.equal(Math.max(...lines.map((line) => Number(line["11"]))), 4);
    assert.equal(Math.max(...buildTriangles("stub-end", opts).flat().map((v) => v[2])), 4);
  });
});