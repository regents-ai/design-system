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
  /** The pointer at (x, y), as fractions of the card's width and height. */
  point(x: number, y: number): void;
  /** The pointer has left: the light fades and the face settles flat. */
  rest(): void;
  /** The eased tilt in radians: about the vertical axis, then the horizontal. */
  tilt(): readonly [number, number];
};

export function createHolographicCardRenderer(
  canvas: HTMLCanvasElement,
  size: readonly [number, number],
  onDeviceLost: () => void,
): Promise<HolographicCardRenderer>;
