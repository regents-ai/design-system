/** Radians of tilt at the card's edge, on both axes. */
export const HOLOGRAPHIC_CARD_TILT: number;

export type HolographicCardRenderer = {
  resize(width: number, height: number): void;
  /** Eases every value toward its target; true while something still moved. */
  step(snap: boolean): boolean;
  present(): void;
  /** Resolves once the work submitted so far has finished on the GPU. */
  settled(): Promise<void>;
  dispose(): void;
  /**
   * The pointer, as fractions of two boxes: the card that turns, and the canvas
   * the light falls on. The light may stand a little outside the canvas.
   */
  point(card: readonly [number, number], light: readonly [number, number]): void;
  /** The pointer has left: the light fades and the face settles flat. */
  rest(): void;
  /** The eased tilt in radians: about the vertical axis, then the horizontal. */
  tilt(): readonly [number, number];
};

export type HolographicCardLook = {
  /**
   * Engraves the Regents crown on a face. Default true. `"beside"` engraves it
   * only while the face is wide enough for it to stand clear of the content.
   */
  crown?: boolean | "beside";
  /** Makes the surface the ink of a masked line drawing, in this resting colour (0..1 sRGB). */
  ink?: readonly [number, number, number];
  /** Scales the turn against the account card's. Default 1. */
  tilt?: number;
  /** Scales the light against the account card's. Default 1. */
  shine?: number;
};

export function createHolographicCardRenderer(
  canvas: HTMLCanvasElement,
  size: readonly [number, number],
  onDeviceLost: () => void,
  look?: HolographicCardLook,
): Promise<HolographicCardRenderer>;

/** The CSS mask that turns a foil canvas into the ink of an inline line drawing. */
export function holographicInkMask(drawing: SVGSVGElement): string;
