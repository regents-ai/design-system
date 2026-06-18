export interface JSAnimation {
  play(): JSAnimation
  pause(): JSAnimation
  resume(): JSAnimation
  restart(): JSAnimation
  cancel(): JSAnimation
  complete(): JSAnimation
  revert(): JSAnimation
  seek(time: number, muteCallbacks?: boolean): JSAnimation
  then(callback?: (animation: JSAnimation) => void): Promise<JSAnimation>
}

export interface Timeline extends JSAnimation {
  add(
    targets: unknown,
    options: Record<string, unknown>,
    position?: number | string
  ): Timeline
  set(targets: unknown, options: Record<string, unknown>, position?: number | string): Timeline
  call(callback: () => void, position?: number | string): Timeline
}

export interface Timer {
  play(): Timer
  pause(): Timer
  resume(): Timer
  restart(): Timer
  cancel(): Timer
  complete(): Timer
}

export function animate(targets: unknown, options: Record<string, unknown>): JSAnimation

export function createDrawable(
  targets: unknown,
  start?: number,
  end?: number
): unknown

export function createTimeline(options?: Record<string, unknown>): Timeline

export function createTimer(options?: Record<string, unknown>): Timer

export function stagger(
  value: number | string | [number, number],
  options?: Record<string, unknown>
): unknown

export const utils: {
  random(min: number, max: number, decimals?: number): number
  clamp(value: number, min: number, max: number): number
  lerp(start: number, end: number, progress: number): number
  set(targets: unknown, options: Record<string, unknown>): unknown
  remove(targets: unknown): void
  [key: string]: unknown
}
