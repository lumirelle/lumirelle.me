/**
 * Where the reader is far enough down a page for the Shell's bottom-right
 * column to be useful.
 *
 * Both controls in that column appear on the same rule: a reader who has moved
 * far enough to want `↑` has moved far enough to want `outline`, and two
 * thresholds would let one column disagree with itself. The number lives here,
 * once, rather than in each component that asks.
 */
export const SHELL_CONTROL_THRESHOLD = 320

/** Whether the reader has moved that far. */
export function useControlReachable(): ComputedRef<boolean> {
  const { y } = useWindowScroll()
  return computed(() => y.value > SHELL_CONTROL_THRESHOLD)
}
