import type { GridPanel, GridOption, Option } from "../types/workflowFields";

const empty = (count: number) => new Array(count).fill(null);

const mainRows: GridPanel = [
  ["H", ...empty(16), "He"],
  ["Li", "Be", ...empty(10), "B", "C", "N", "O", "F", "Ne"],
  ["Na", "Mg", ...empty(10), "Al", "Si", "P", "S", "Cl", "Ar"],
  [
    "K",
    "Ca",
    "Sc",
    "Ti",
    "V",
    "Cr",
    "Mn",
    "Fe",
    "Co",
    "Ni",
    "Cu",
    "Zn",
    "Ga",
    "Ge",
    "As",
    "Se",
    "Br",
    "Kr",
  ],
  [
    "Rb",
    "Sr",
    "Y",
    "Zr",
    "Nb",
    "Mo",
    "Tc",
    "Ru",
    "Rh",
    "Pd",
    "Ag",
    "Cd",
    "In",
    "Sn",
    "Sb",
    "Te",
    "I",
    "Xe",
  ],
  [
    "Cs",
    "Ba",
    null,
    "Hf",
    "Ta",
    "W",
    "Re",
    "Os",
    "Ir",
    "Pt",
    "Au",
    "Hg",
    "Tl",
    "Pb",
    "Bi",
    "Po",
    "At",
    "Rn",
  ],
  [
    "Fr",
    "Ra",
    null,
    "Rf",
    "Db",
    "Sg",
    "Bh",
    "Hs",
    "Mt",
    "Ds",
    "Rg",
    "Cn",
    "Nh",
    "Fl",
    "Mc",
    "Lv",
    "Ts",
    "Og",
  ],
];

const lowerRows: GridPanel = [
  [
    "La",
    "Ce",
    "Pr",
    "Nd",
    "Pm",
    "Sm",
    "Eu",
    "Gd",
    "Tb",
    "Dy",
    "Ho",
    "Er",
    "Tm",
    "Yb",
    "Lu",
  ],
  [
    "Ac",
    "Th",
    "Pa",
    "U",
    "Np",
    "Pu",
    "Am",
    "Cm",
    "Bk",
    "Cf",
    "Es",
    "Fm",
    "Md",
    "No",
    "Lr",
  ],
];

const toGridOptions = (
  grid: GridPanel,
  rOffset = 0,
  cOffset = 0
): GridOption[] => {
  const startIndex = 1;

  return grid.flatMap((row, rIndex) =>
    row.flatMap((symbol, cIndex) => {
      if (!symbol) return [];

      return {
        value: symbol,
        label: symbol,
        row: startIndex + rIndex + rOffset,
        column: startIndex + cIndex + cOffset,
      };
    })
  );
};

export const elementOptions: GridOption[] = [
  ...toGridOptions(mainRows),
  ...toGridOptions(lowerRows, 7, 2),
];

const transitions: [string, string][] = [
  ["Ka", "Kα"],
  ["Kb", "Kβ"],
  ["La", "Lα"],
  ["Lb", "Lβ"],
  ["M", "M"],
];

export const transitionOptions: Option[] = transitions.map(
  ([value, label]) => ({ value, label })
);
