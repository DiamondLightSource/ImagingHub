// Sort direction options
const SortDirection = {
  NEWEST: "newest",
  OLDEST: "oldest",
} as const;
type SortDirection = (typeof SortDirection)[keyof typeof SortDirection];
export { SortDirection };

// Sort options available in the scan selector header
export interface SortOption {
  value: SortDirection;
  label: string;
}
export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
] as const satisfies readonly SortOption[];

// Row selection state
// [scan ID]: true/false
export type RowSelectionState = { [id: number]: boolean };
