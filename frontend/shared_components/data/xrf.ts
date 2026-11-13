const reconsMethod: [string, string][] = [
  ["FBP", "Fourier Back Projection"],
  [
    "OLEM",
    "Ordered Subsets Expectation Maximization (OSEM) and MLEM. May provide smoother results.",
  ],
];

export const reconsMethodOptions: Option[] = reconsMethod.map(
  ([label, desc]) => ({
    label,
    value: label,
    desc,
  })
);

const alignmentSection = ["all", "top", "middle", "bottom"];

export const alignmentSectionOptions: Option[] = alignmentSection.map(
  (label) => ({
    label,
    value: label,
  })
);
