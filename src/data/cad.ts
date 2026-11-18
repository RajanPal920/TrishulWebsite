/**
 * Dimensional data driving the downloadable CAD & BIM component library.
 * All values are nominal inches per the referenced standard and must be
 * verified against the current edition before construction release.
 */

export interface FlangeDim {
  nps: string;
  npsNum: number;
  od: number; // flange outside diameter O
  tf: number; // flange thickness
  bc: number; // bolt circle diameter
  bolts: number;
  hole: number; // bolt hole diameter
  hub: number; // hub diameter at base X
  length: number; // length through hub Y (weld neck)
  bore: number; // nominal bore (SCH 40 / STD)
}

export type FlangeClass = "150" | "300" | "600" | "900" | "1500" | "2500";

export const flangeClasses: FlangeClass[] = ["150", "300", "600", "900", "1500", "2500"];

export type Facing = "RF" | "RTJ" | "FF";

export const facings: { code: Facing; label: string; note: string }[] = [
  { code: "RF", label: "Raised Face (RF)", note: "Standard 1/16 in raised face to Class 300, 1/4 in from Class 400 upward." },
  { code: "RTJ", label: "Ring Type Joint (RTJ)", note: "Octagonal ring groove per ASME B16.20 for high-pressure and sour service." },
  { code: "FF", label: "Flat Face (FF)", note: "Full flat face for bolting to cast-iron or non-metallic equipment flanges." },
];

export const flangeDims: Record<FlangeClass, FlangeDim[]> = {
  "150": [
    { nps: '1/2"', npsNum: 0.5, od: 3.5, tf: 0.44, bc: 2.38, bolts: 4, hole: 0.62, hub: 1.19, length: 1.88, bore: 0.622 },
    { nps: '3/4"', npsNum: 0.75, od: 3.88, tf: 0.5, bc: 2.75, bolts: 4, hole: 0.62, hub: 1.5, length: 2.06, bore: 0.824 },
    { nps: '1"', npsNum: 1, od: 4.25, tf: 0.56, bc: 3.12, bolts: 4, hole: 0.62, hub: 1.94, length: 2.19, bore: 1.049 },
    { nps: '1.1/2"', npsNum: 1.5, od: 5.0, tf: 0.69, bc: 3.88, bolts: 4, hole: 0.62, hub: 2.56, length: 2.44, bore: 1.61 },
    { nps: '2"', npsNum: 2, od: 6.0, tf: 0.75, bc: 4.75, bolts: 4, hole: 0.75, hub: 3.06, length: 2.5, bore: 2.067 },
    { nps: '3"', npsNum: 3, od: 7.5, tf: 0.94, bc: 6.0, bolts: 4, hole: 0.75, hub: 4.25, length: 2.75, bore: 3.068 },
    { nps: '4"', npsNum: 4, od: 9.0, tf: 0.94, bc: 7.5, bolts: 8, hole: 0.75, hub: 5.31, length: 3.0, bore: 4.026 },
    { nps: '6"', npsNum: 6, od: 11.0, tf: 1.0, bc: 9.5, bolts: 8, hole: 0.88, hub: 7.56, length: 3.5, bore: 6.065 },
    { nps: '8"', npsNum: 8, od: 13.5, tf: 1.12, bc: 11.75, bolts: 8, hole: 0.88, hub: 9.69, length: 4.0, bore: 7.981 },
    { nps: '10"', npsNum: 10, od: 16.0, tf: 1.19, bc: 14.25, bolts: 12, hole: 1.0, hub: 12.0, length: 4.0, bore: 10.02 },
    { nps: '12"', npsNum: 12, od: 19.0, tf: 1.25, bc: 17.0, bolts: 12, hole: 1.0, hub: 14.38, length: 4.5, bore: 11.938 },
    { nps: '16"', npsNum: 16, od: 23.5, tf: 1.44, bc: 21.25, bolts: 16, hole: 1.12, hub: 18.5, length: 5.0, bore: 15.0 },
    { nps: '24"', npsNum: 24, od: 32.0, tf: 1.88, bc: 29.5, bolts: 20, hole: 1.38, hub: 27.0, length: 5.5, bore: 22.626 },
  ],
  "300": [
    { nps: '1/2"', npsNum: 0.5, od: 3.75, tf: 0.56, bc: 2.62, bolts: 4, hole: 0.62, hub: 1.5, length: 2.06, bore: 0.622 },
    { nps: '3/4"', npsNum: 0.75, od: 4.62, tf: 0.62, bc: 3.25, bolts: 4, hole: 0.75, hub: 1.88, length: 2.25, bore: 0.824 },
    { nps: '1"', npsNum: 1, od: 4.88, tf: 0.69, bc: 3.5, bolts: 4, hole: 0.75, hub: 2.12, length: 2.44, bore: 1.049 },
    { nps: '1.1/2"', npsNum: 1.5, od: 6.12, tf: 0.81, bc: 4.5, bolts: 4, hole: 0.88, hub: 2.88, length: 2.69, bore: 1.61 },
    { nps: '2"', npsNum: 2, od: 6.5, tf: 0.88, bc: 5.0, bolts: 8, hole: 0.75, hub: 3.62, length: 2.75, bore: 2.067 },
    { nps: '3"', npsNum: 3, od: 8.25, tf: 1.12, bc: 6.62, bolts: 8, hole: 0.88, hub: 5.0, length: 3.12, bore: 3.068 },
    { nps: '4"', npsNum: 4, od: 10.0, tf: 1.25, bc: 7.88, bolts: 8, hole: 0.88, hub: 6.19, length: 3.38, bore: 4.026 },
    { nps: '6"', npsNum: 6, od: 12.5, tf: 1.44, bc: 10.62, bolts: 12, hole: 0.88, hub: 8.5, length: 3.88, bore: 6.065 },
    { nps: '8"', npsNum: 8, od: 15.0, tf: 1.62, bc: 13.0, bolts: 12, hole: 1.0, hub: 10.62, length: 4.38, bore: 7.981 },
    { nps: '10"', npsNum: 10, od: 17.5, tf: 1.88, bc: 15.25, bolts: 16, hole: 1.12, hub: 12.75, length: 4.62, bore: 10.02 },
    { nps: '12"', npsNum: 12, od: 20.5, tf: 2.0, bc: 17.75, bolts: 16, hole: 1.25, hub: 15.0, length: 5.12, bore: 11.938 },
    { nps: '16"', npsNum: 16, od: 25.5, tf: 2.25, bc: 22.5, bolts: 20, hole: 1.38, hub: 19.38, length: 5.75, bore: 15.0 },
    { nps: '24"', npsNum: 24, od: 36.0, tf: 2.75, bc: 32.0, bolts: 24, hole: 1.62, hub: 28.0, length: 6.5, bore: 22.626 },
  ],
  "600": [
    { nps: '1/2"', npsNum: 0.5, od: 3.75, tf: 0.56, bc: 2.62, bolts: 4, hole: 0.62, hub: 1.5, length: 2.06, bore: 0.546 },
    { nps: '1"', npsNum: 1, od: 4.88, tf: 0.69, bc: 3.5, bolts: 4, hole: 0.75, hub: 2.12, length: 2.44, bore: 0.957 },
    { nps: '2"', npsNum: 2, od: 6.5, tf: 1.0, bc: 5.0, bolts: 8, hole: 0.75, hub: 3.62, length: 3.25, bore: 1.939 },
    { nps: '3"', npsNum: 3, od: 8.25, tf: 1.38, bc: 6.62, bolts: 8, hole: 0.88, hub: 5.0, length: 4.0, bore: 2.9 },
    { nps: '4"', npsNum: 4, od: 10.75, tf: 1.5, bc: 8.5, bolts: 8, hole: 1.0, hub: 6.19, length: 4.5, bore: 3.826 },
    { nps: '6"', npsNum: 6, od: 14.0, tf: 1.88, bc: 11.5, bolts: 12, hole: 1.12, hub: 8.5, length: 5.5, bore: 5.761 },
    { nps: '8"', npsNum: 8, od: 16.5, tf: 2.19, bc: 13.75, bolts: 12, hole: 1.25, hub: 10.62, length: 6.0, bore: 7.625 },
    { nps: '10"', npsNum: 10, od: 20.0, tf: 2.5, bc: 17.0, bolts: 16, hole: 1.38, hub: 12.75, length: 6.5, bore: 9.564 },
    { nps: '12"', npsNum: 12, od: 22.0, tf: 2.62, bc: 19.25, bolts: 20, hole: 1.38, hub: 15.0, length: 6.75, bore: 11.376 },
  ],
  "900": [
    { nps: '1/2"', npsNum: 0.5, od: 4.75, tf: 0.88, bc: 3.25, bolts: 4, hole: 0.88, hub: 1.5, length: 2.75, bore: 0.546 },
    { nps: '1"', npsNum: 1, od: 5.88, tf: 1.12, bc: 4.0, bolts: 4, hole: 1.0, hub: 2.12, length: 3.25, bore: 0.957 },
    { nps: '2"', npsNum: 2, od: 8.5, tf: 1.5, bc: 6.5, bolts: 8, hole: 1.0, hub: 3.62, length: 4.0, bore: 1.687 },
    { nps: '3"', npsNum: 3, od: 9.5, tf: 1.5, bc: 7.5, bolts: 8, hole: 1.0, hub: 5.0, length: 4.5, bore: 2.624 },
    { nps: '4"', npsNum: 4, od: 11.5, tf: 1.75, bc: 9.25, bolts: 8, hole: 1.25, hub: 6.19, length: 4.88, bore: 3.438 },
    { nps: '6"', npsNum: 6, od: 15.0, tf: 2.19, bc: 12.5, bolts: 12, hole: 1.25, hub: 8.5, length: 5.62, bore: 5.187 },
    { nps: '8"', npsNum: 8, od: 18.5, tf: 2.5, bc: 15.5, bolts: 12, hole: 1.5, hub: 10.62, length: 6.12, bore: 6.813 },
    { nps: '10"', npsNum: 10, od: 21.5, tf: 2.75, bc: 18.5, bolts: 16, hole: 1.5, hub: 12.75, length: 7.0, bore: 8.5 },
    { nps: '12"', npsNum: 12, od: 24.0, tf: 3.12, bc: 21.0, bolts: 20, hole: 1.5, hub: 15.0, length: 7.5, bore: 10.126 },
  ],
  "1500": [
    { nps: '1/2"', npsNum: 0.5, od: 4.75, tf: 0.88, bc: 3.25, bolts: 4, hole: 0.88, hub: 1.5, length: 2.75, bore: 0.466 },
    { nps: '1"', npsNum: 1, od: 5.88, tf: 1.12, bc: 4.0, bolts: 4, hole: 1.0, hub: 2.12, length: 3.25, bore: 0.815 },
    { nps: '2"', npsNum: 2, od: 8.5, tf: 1.5, bc: 6.5, bolts: 8, hole: 1.0, hub: 3.62, length: 4.0, bore: 1.689 },
    { nps: '3"', npsNum: 3, od: 10.5, tf: 1.88, bc: 8.0, bolts: 8, hole: 1.25, hub: 5.0, length: 5.12, bore: 2.3 },
    { nps: '4"', npsNum: 4, od: 12.25, tf: 2.12, bc: 9.5, bolts: 8, hole: 1.38, hub: 6.19, length: 6.0, bore: 3.152 },
    { nps: '6"', npsNum: 6, od: 15.5, tf: 3.25, bc: 12.5, bolts: 12, hole: 1.5, hub: 8.5, length: 8.5, bore: 4.9 },
    { nps: '8"', npsNum: 8, od: 19.0, tf: 3.62, bc: 15.5, bolts: 12, hole: 1.75, hub: 10.62, length: 9.0, bore: 6.4 },
    { nps: '10"', npsNum: 10, od: 23.0, tf: 4.25, bc: 19.0, bolts: 12, hole: 2.0, hub: 12.75, length: 10.0, bore: 8.0 },
    { nps: '12"', npsNum: 12, od: 26.5, tf: 4.88, bc: 22.5, bolts: 16, hole: 2.12, hub: 15.0, length: 11.12, bore: 9.5 },
  ],
  "2500": [
    { nps: '1/2"', npsNum: 0.5, od: 5.25, tf: 1.19, bc: 3.5, bolts: 4, hole: 0.88, hub: 1.5, length: 3.25, bore: 0.466 },
    { nps: '1"', npsNum: 1, od: 6.25, tf: 1.38, bc: 4.25, bolts: 4, hole: 1.0, hub: 2.12, length: 4.0, bore: 0.815 },
    { nps: '2"', npsNum: 2, od: 9.25, tf: 2.0, bc: 6.75, bolts: 8, hole: 1.12, hub: 3.62, length: 5.0, bore: 1.503 },
    { nps: '3"', npsNum: 3, od: 12.0, tf: 2.62, bc: 9.0, bolts: 8, hole: 1.38, hub: 5.0, length: 6.62, bore: 2.3 },
    { nps: '4"', npsNum: 4, od: 14.0, tf: 3.0, bc: 10.75, bolts: 8, hole: 1.62, hub: 6.19, length: 7.5, bore: 3.0 },
    { nps: '6"', npsNum: 6, od: 19.0, tf: 4.25, bc: 14.5, bolts: 8, hole: 2.12, hub: 8.5, length: 10.75, bore: 4.313 },
    { nps: '8"', npsNum: 8, od: 21.75, tf: 5.0, bc: 17.25, bolts: 12, hole: 2.12, hub: 10.62, length: 12.5, bore: 5.761 },
    { nps: '10"', npsNum: 10, od: 26.5, tf: 6.5, bc: 21.25, bolts: 12, hole: 2.5, hub: 12.75, length: 16.5, bore: 7.001 },
    { nps: '12"', npsNum: 12, od: 30.0, tf: 7.25, bc: 24.38, bolts: 12, hole: 2.75, hub: 15.0, length: 18.25, bore: 8.5 },
  ],
};

export interface PipeDim {
  nps: string;
  npsNum: number;
  od: number;
  s10: number;
  s40: number;
  s80: number;
}

export const pipeDims: PipeDim[] = [
  { nps: '1/2"', npsNum: 0.5, od: 0.84, s10: 0.083, s40: 0.109, s80: 0.147 },
  { nps: '3/4"', npsNum: 0.75, od: 1.05, s10: 0.083, s40: 0.113, s80: 0.154 },
  { nps: '1"', npsNum: 1, od: 1.315, s10: 0.109, s40: 0.133, s80: 0.179 },
  { nps: '1.1/2"', npsNum: 1.5, od: 1.9, s10: 0.109, s40: 0.145, s80: 0.2 },
  { nps: '2"', npsNum: 2, od: 2.375, s10: 0.109, s40: 0.154, s80: 0.218 },
  { nps: '3"', npsNum: 3, od: 3.5, s10: 0.12, s40: 0.216, s80: 0.3 },
  { nps: '4"', npsNum: 4, od: 4.5, s10: 0.12, s40: 0.237, s80: 0.337 },
  { nps: '6"', npsNum: 6, od: 6.625, s10: 0.134, s40: 0.28, s80: 0.432 },
  { nps: '8"', npsNum: 8, od: 8.625, s10: 0.148, s40: 0.322, s80: 0.5 },
  { nps: '10"', npsNum: 10, od: 10.75, s10: 0.165, s40: 0.365, s80: 0.594 },
  { nps: '12"', npsNum: 12, od: 12.75, s10: 0.18, s40: 0.406, s80: 0.688 },
  { nps: '16"', npsNum: 16, od: 16.0, s10: 0.188, s40: 0.5, s80: 0.844 },
  { nps: '24"', npsNum: 24, od: 24.0, s10: 0.25, s40: 0.688, s80: 1.219 },
];

export interface FittingDim {
  npsNum: number;
  elbow90: number; // centre-to-end, long radius
  elbow45: number; // centre-to-end
  tee: number; // centre-to-end run and outlet
  reducer: number; // overall length, concentric
  cap: number; // cap length E
}

export const fittingDims: FittingDim[] = [
  { npsNum: 0.5, elbow90: 1.5, elbow45: 0.62, tee: 1.0, reducer: 2.0, cap: 1.0 },
  { npsNum: 0.75, elbow90: 1.12, elbow45: 0.44, tee: 1.12, reducer: 2.0, cap: 1.0 },
  { npsNum: 1, elbow90: 1.5, elbow45: 0.62, tee: 1.5, reducer: 2.0, cap: 1.5 },
  { npsNum: 1.5, elbow90: 2.25, elbow45: 0.94, tee: 1.88, reducer: 2.5, cap: 1.5 },
  { npsNum: 2, elbow90: 3.0, elbow45: 1.25, tee: 2.5, reducer: 3.0, cap: 1.5 },
  { npsNum: 3, elbow90: 4.5, elbow45: 1.88, tee: 3.38, reducer: 3.5, cap: 2.0 },
  { npsNum: 4, elbow90: 6.0, elbow45: 2.5, tee: 4.12, reducer: 4.0, cap: 2.5 },
  { npsNum: 6, elbow90: 9.0, elbow45: 3.75, tee: 5.62, reducer: 5.5, cap: 3.5 },
  { npsNum: 8, elbow90: 12.0, elbow45: 5.0, tee: 7.0, reducer: 6.0, cap: 4.0 },
  { npsNum: 10, elbow90: 15.0, elbow45: 6.25, tee: 8.5, reducer: 7.0, cap: 5.0 },
  { npsNum: 12, elbow90: 18.0, elbow45: 7.5, tee: 10.0, reducer: 8.0, cap: 6.0 },
  { npsNum: 16, elbow90: 24.0, elbow45: 10.0, tee: 12.0, reducer: 10.0, cap: 8.0 },
  { npsNum: 24, elbow90: 36.0, elbow45: 15.0, tee: 17.0, reducer: 14.0, cap: 10.5 },
];

export type CadKind =
  | "weld-neck"
  | "slip-on"
  | "blind"
  | "socket-weld"
  | "long-weld-neck"
  | "elbow90"
  | "elbow45"
  | "elbow90sr"
  | "elbow45sr"
  | "tee"
  | "reducing-tee"
  | "cross"
  | "lateral"
  | "stub-end"
  | "reducer"
  | "reducer-ecc"
  | "cap"
  | "pipe";

/** Families whose geometry is flange-like (classed, faced, bolted). */
export const flangeKinds: CadKind[] = ["weld-neck", "slip-on", "blind", "socket-weld", "long-weld-neck"];

export interface CadFamily {
  slug: string;
  kind: CadKind;
  name: string;
  standard: string;
  productSlug: string;
  blurb: string;
  classed: boolean; // flange classes apply
}

export const cadFamilies: CadFamily[] = [
  {
    slug: "weld-neck-flange",
    kind: "weld-neck",
    name: "Weld Neck Flange, RF",
    standard: "ASME B16.5",
    productSlug: "weld-neck-flanges",
    blurb: "Raised-face weld neck flange with tapered hub, bolt circle and hole pattern to ASME B16.5.",
    classed: true,
  },
  {
    slug: "slip-on-flange",
    kind: "slip-on",
    name: "Slip-On Flange, RF",
    standard: "ASME B16.5",
    productSlug: "slip-on-flanges",
    blurb: "Slip-on flange with short hub for fillet-welded connections in low to moderate pressure service.",
    classed: true,
  },
  {
    slug: "blind-flange",
    kind: "blind",
    name: "Blind Flange, RF",
    standard: "ASME B16.5",
    productSlug: "blind-flanges",
    blurb: "Solid blind flange for line termination, vessel nozzles and hydrotest isolation.",
    classed: true,
  },
  {
    slug: "elbow-90-lr",
    kind: "elbow90",
    name: "90° Long Radius Elbow",
    standard: "ASME B16.9",
    productSlug: "90-degree-elbows",
    blurb: "Buttweld 90° long radius elbow, centre-to-end 1.5 × NPS, with bevelled ends.",
    classed: false,
  },
  {
    slug: "elbow-45-lr",
    kind: "elbow45",
    name: "45° Long Radius Elbow",
    standard: "ASME B16.9",
    productSlug: "45-degree-elbows",
    blurb: "Buttweld 45° long radius elbow for change of direction in rack and header routing.",
    classed: false,
  },
  {
    slug: "equal-tee",
    kind: "tee",
    name: "Equal Tee",
    standard: "ASME B16.9",
    productSlug: "equal-tees",
    blurb: "Buttweld straight tee with equal run and branch, centre-to-end per ASME B16.9.",
    classed: false,
  },
  {
    slug: "concentric-reducer",
    kind: "reducer",
    name: "Concentric Reducer",
    standard: "ASME B16.9",
    productSlug: "concentric-reducers",
    blurb: "Buttweld concentric reducer with common centreline, overall length per ASME B16.9.",
    classed: false,
  },
  {
    slug: "pipe-cap",
    kind: "cap",
    name: "Pipe Cap",
    standard: "ASME B16.9",
    productSlug: "pipe-caps",
    blurb: "Buttweld ellipsoidal pipe cap for line termination and pigging spool ends.",
    classed: false,
  },
  {
    slug: "seamless-pipe",
    kind: "pipe",
    name: "Seamless Pipe, plain end",
    standard: "ASME B36.10M / B36.19M",
    productSlug: "seamless-pipes",
    blurb: "Plain-end seamless pipe spool, 1 metre reference length, schedule-driven wall thickness.",
    classed: false,
  },
  {
    slug: "long-weld-neck-flange",
    kind: "long-weld-neck",
    name: "Long Weld Neck Flange",
    standard: "ASME B16.5 (LWN)",
    productSlug: "long-weld-neck-flanges",
    blurb: "Extended-neck forged flange used as a vessel or column nozzle without a separate pipe spool.",
    classed: true,
  },
  {
    slug: "socket-weld-flange",
    kind: "socket-weld",
    name: "Socket Weld Flange",
    standard: "ASME B16.5",
    productSlug: "socket-weld-flanges",
    blurb: "Socket weld flange with internal bore recess for small-bore high-pressure instrument and utility lines.",
    classed: true,
  },
  {
    slug: "elbow-90-sr",
    kind: "elbow90sr",
    name: "90° Short Radius Elbow",
    standard: "ASME B16.9",
    productSlug: "90-degree-elbows",
    blurb: "Buttweld 90° short radius elbow, centre-to-end 1.0 × NPS, for tight rack and skid routing.",
    classed: false,
  },
  {
    slug: "elbow-45-sr",
    kind: "elbow45sr",
    name: "45° Short Radius Elbow",
    standard: "ASME B16.9",
    productSlug: "45-degree-elbows",
    blurb: "Buttweld 45° short radius elbow for constrained change of direction.",
    classed: false,
  },
  {
    slug: "reducing-tee",
    kind: "reducing-tee",
    name: "Reducing Tee",
    standard: "ASME B16.9",
    productSlug: "reducing-tees",
    blurb: "Buttweld tee with a reduced branch outlet, run centre-to-end per ASME B16.9.",
    classed: false,
  },
  {
    slug: "cross",
    kind: "cross",
    name: "Equal Cross",
    standard: "ASME B16.9 / MSS SP-43",
    productSlug: "equal-tees",
    blurb: "Buttweld four-way cross with equal run and branch outlets for header and manifold work.",
    classed: false,
  },
  {
    slug: "lateral",
    kind: "lateral",
    name: "45° Lateral",
    standard: "MSS SP-43 / ASME B16.9",
    productSlug: "branch-outlet-fittings",
    blurb: "Buttweld 45° lateral branch for low-turbulence take-offs on flare and drain headers.",
    classed: false,
  },
  {
    slug: "stub-end",
    kind: "stub-end",
    name: "Stub End (Type A)",
    standard: "ASME B16.9 / MSS SP-43",
    productSlug: "stub-ends",
    blurb: "Lap joint stub end with serrated face, paired with a backing flange for dismantleable joints.",
    classed: false,
  },
  {
    slug: "eccentric-reducer",
    kind: "reducer-ecc",
    name: "Eccentric Reducer",
    standard: "ASME B16.9",
    productSlug: "eccentric-reducers",
    blurb: "Buttweld eccentric reducer with flat-on-top offset for pump suction and self-draining lines.",
    classed: false,
  },
];

export const cadMaterialOptions = [
  { code: "S31600", label: "316 / 316L — ASTM A182 F316L / A403 WP316L" },
  { code: "S32750", label: "Super Duplex 2507 — ASTM A182 F53 / A815 WPS32750" },
  { code: "S31803", label: "Duplex 2205 — ASTM A182 F51 / A815 WPS31803" },
  { code: "N06625", label: "Inconel 625 — ASTM B564 / B366 WPNCMC" },
  { code: "N08825", label: "Incoloy 825 — ASTM B564 / B366" },
  { code: "N04400", label: "Monel 400 — ASTM B564 / B366" },
  { code: "A105N", label: "Carbon Steel — ASTM A105N / A234 WPB" },
  { code: "A350LF2", label: "Low Temp Carbon — ASTM A350 LF2 / A420 WPL6" },
];

/** Density lookup in g/cm³ per material family, used for theoretical weight estimates. */
export const familyDensity: Record<string, number> = {
  nickel: 8.89,
  duplex: 7.8,
  "super-duplex": 7.8,
  stainless: 8.0,
  carbon: 7.85,
  polymer: 1.4,
};

/** Parse a density in g/cm³ from a material's physical property rows, falling back to family average. */
export function densityOf(material?: { family: string; physical: { label: string; value: string }[] }): number {
  const row = material?.physical.find((p) => p.label === "Density");
  const parsed = row ? parseFloat(row.value) : NaN;
  if (Number.isFinite(parsed)) return parsed;
  return material ? (familyDensity[material.family] ?? 7.85) : 7.85;
}

export const sheetThicknesses = [0.5, 0.8, 1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 25, 32, 40, 50, 65, 80, 100];
export const sheetWidths = [1000, 1250, 1500, 2000];
export const sheetLengths = [2000, 2500, 3000, 6000];

export const ringOuterDiameters = [50, 80, 100, 150, 200, 250, 300, 400, 500, 600, 800, 1000];
export const ringThicknesses = [10, 16, 20, 25, 32, 40, 50, 65, 80, 100];

export const circleDiameters = [50, 80, 100, 150, 200, 250, 300, 400, 500, 600, 800, 1000, 1200];
export const circleThicknesses = [2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 25, 32, 40, 50];

export const barDiameters = [6, 8, 10, 12, 16, 20, 25, 32, 40, 50, 65, 75, 80, 100, 125, 150, 200, 250, 300];
export const barLengths = [3000, 6000];

/** Theoretical weights in kg. All dimensions in millimetres except pipe (inches, converted). */
export const sheetWeightKg = (t: number, w: number, l: number, density: number) =>
  (t * w * l * density) / 1_000_000;

export const ringWeightKg = (od: number, id: number, t: number, density: number) =>
  (Math.PI / 4) * (od * od - id * id) * t * density / 1_000_000;

export const circleWeightKg = (d: number, t: number, density: number) =>
  (Math.PI / 4) * d * d * t * density / 1_000_000;

export const barWeightPerMetreKg = (d: number, density: number) =>
  (Math.PI / 4) * d * d * 1000 * density / 1_000_000;

/** Pipe weight per metre in kg from inch OD and wall. */
export const pipeWeightPerMetreKg = (odIn: number, wallIn: number, density: number) => {
  const od = odIn * 25.4;
  const wall = wallIn * 25.4;
  const id = od - 2 * wall;
  return (Math.PI / 4) * (od * od - id * id) * 1000 * density / 1_000_000;
};

/* ------------------------------------------------------------------ */
/* Schedules — ASME B36.10M / B36.19M nominal walls (inches)            */
/* ------------------------------------------------------------------ */

export type ScheduleKey =
  | "5S" | "10S" | "20" | "30" | "40" | "60" | "80" | "100" | "120" | "140" | "160" | "XXS";

export const scheduleOrder: ScheduleKey[] = [
  "5S", "10S", "20", "30", "40", "60", "80", "100", "120", "140", "160", "XXS",
];

export const scheduleLabel: Record<ScheduleKey, string> = {
  "5S": "SCH 5S",
  "10S": "SCH 10S",
  "20": "SCH 20",
  "30": "SCH 30",
  "40": "SCH 40 / STD",
  "60": "SCH 60",
  "80": "SCH 80 / XS",
  "100": "SCH 100",
  "120": "SCH 120",
  "140": "SCH 140",
  "160": "SCH 160",
  XXS: "XXS",
};

/** Wall thickness in inches, keyed by NPS then schedule. Nominal — verify before release. */
export const scheduleWalls: Record<number, Partial<Record<ScheduleKey, number>>> = {
  0.5: { "5S": 0.065, "10S": 0.083, "40": 0.109, "80": 0.147, "160": 0.188, XXS: 0.294 },
  0.75: { "5S": 0.065, "10S": 0.083, "40": 0.113, "80": 0.154, "160": 0.219, XXS: 0.308 },
  1: { "5S": 0.065, "10S": 0.109, "40": 0.133, "80": 0.179, "160": 0.25, XXS: 0.358 },
  1.5: { "5S": 0.065, "10S": 0.109, "40": 0.145, "80": 0.2, "160": 0.281, XXS: 0.4 },
  2: { "5S": 0.065, "10S": 0.109, "40": 0.154, "80": 0.218, "160": 0.344, XXS: 0.436 },
  3: { "5S": 0.083, "10S": 0.12, "40": 0.216, "80": 0.3, "160": 0.438, XXS: 0.6 },
  4: { "5S": 0.083, "10S": 0.12, "40": 0.237, "80": 0.337, "120": 0.438, "160": 0.531, XXS: 0.674 },
  6: { "5S": 0.109, "10S": 0.134, "40": 0.28, "80": 0.432, "120": 0.562, "160": 0.719, XXS: 0.864 },
  8: {
    "5S": 0.109, "10S": 0.148, "20": 0.25, "30": 0.277, "40": 0.322, "60": 0.406,
    "80": 0.5, "100": 0.594, "120": 0.719, "140": 0.812, "160": 0.906, XXS: 0.875,
  },
  10: {
    "5S": 0.134, "10S": 0.165, "20": 0.25, "30": 0.307, "40": 0.365, "60": 0.5,
    "80": 0.594, "100": 0.719, "120": 0.844, "140": 1.0, "160": 1.125, XXS: 1.0,
  },
  12: {
    "5S": 0.156, "10S": 0.18, "20": 0.25, "30": 0.33, "40": 0.406, "60": 0.562,
    "80": 0.688, "100": 0.844, "120": 1.0, "140": 1.125, "160": 1.312, XXS: 1.0,
  },
  16: {
    "5S": 0.165, "10S": 0.188, "20": 0.312, "30": 0.375, "40": 0.5, "60": 0.656,
    "80": 0.844, "100": 1.031, "120": 1.219, "140": 1.438, "160": 1.594,
  },
  24: {
    "5S": 0.218, "10S": 0.25, "20": 0.375, "30": 0.562, "40": 0.688, "60": 0.969,
    "80": 1.219, "100": 1.531, "120": 1.812, "140": 2.062, "160": 2.344,
  },
};

export const schedulesFor = (npsNum: number): ScheduleKey[] =>
  scheduleOrder.filter((k) => scheduleWalls[npsNum]?.[k] !== undefined);

export const wallFor = (npsNum: number, key: ScheduleKey): number | undefined =>
  scheduleWalls[npsNum]?.[key];

/* ------------------------------------------------------------------ */
/* Derived fitting dimensions for the expanded family set              */
/* ------------------------------------------------------------------ */

/** Short radius elbow centre-to-end = 1.0 × NPS (B16.9). */
export const srElbow90 = (npsNum: number) => npsNum;
export const srElbow45 = (npsNum: number) => 0.414 * npsNum;
/** Lateral centre-to-end on the run, MSS SP-43 nominal approximation. */
export const lateralRun = (npsNum: number) => 2.5 * npsNum;
/** Stub end Type A overall length, ASME B16.9 nominal. */
export const stubEndLength = (npsNum: number) => (npsNum <= 2 ? 3 : npsNum <= 8 ? 4 : 6);

/* ------------------------------------------------------------------ */
/* URL helpers for the per-part SEO matrix                              */
/* ------------------------------------------------------------------ */

export const familyBySlug = (slug: string): CadFamily | undefined =>
  cadFamilies.find((f) => f.slug === slug);

/** "1.5" -> "1-1-2" friendly size token used in URLs. */
export const sizeToken = (npsNum: number) => `nps-${String(npsNum).replace(".", "-")}`;
export const parseSizeToken = (token: string): number | null => {
  const raw = token.replace(/^nps-/, "").replace("-", ".");
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
};

export const specToken = (family: CadFamily, cls: FlangeClass, sched: ScheduleKey) =>
  family.classed ? `class-${cls}` : `sch-${sched.toLowerCase()}`;

export const parseSpecToken = (token: string): { cls?: FlangeClass; sched?: ScheduleKey } => {
  if (token.startsWith("class-")) {
    const value = token.slice(6) as FlangeClass;
    return flangeClasses.includes(value) ? { cls: value } : {};
  }
  if (token.startsWith("sch-")) {
    const raw = token.slice(4).toUpperCase();
    const match = scheduleOrder.find((k) => k === raw);
    return match ? { sched: match } : {};
  }
  return {};
};

export const cadPartPath = (
  familySlug: string,
  npsNum: number,
  spec: string,
) => `/cad/${familySlug}/${sizeToken(npsNum)}/${spec}`;

export interface CadPartRef {
  family: CadFamily;
  npsNum: number;
  spec: string;
}

/** Every family × size × class/schedule combination the generator supports. */
export const allCadParts = (): CadPartRef[] => {
  const out: CadPartRef[] = [];
  for (const family of cadFamilies) {
    if (family.classed) {
      for (const cls of flangeClasses) {
        for (const dim of flangeDims[cls]) {
          out.push({ family, npsNum: dim.npsNum, spec: `class-${cls}` });
        }
      }
    } else {
      for (const pipe of pipeDims) {
        for (const key of schedulesFor(pipe.npsNum)) {
          out.push({ family, npsNum: pipe.npsNum, spec: `sch-${key.toLowerCase()}` });
        }
      }
    }
  }
  return out;
};
