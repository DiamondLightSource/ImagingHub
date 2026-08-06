import type { Option } from "../types/workflowFields";

export const templateOptions: Option[] = [
  {
    label: "DPC",
    value: "dpc-batch",
    desc: "DPC imaging produces an image of the phase shifts to the X-ray beam as a result of interaction with the sample by measuring the gradient of the phase and retrieving the phase shifts by a straightforward integration step.",
  },
  {
    label: "XANES Auto-processing",
    value: "xanes",
    desc: "XANES is a utility which attempts to stack a sequence of datasets acquired at different energy for a particular line group and perform alignment based on a line group.",
  },
  {
    label: "XANES Point",
    value: "xanes-point",
    desc: "XANES-point is a utility which takes in a scan file (inpath) and a line group (edge_element), performs windowing of this line group, and saves a two-column text file (outpath): the first column is the energy in keV, and the second column is the summed windowed MCA intensity across the 4 channels.",
  },
  {
    label: "XANES Sparse",
    value: "xanes-sparse",
    desc: "XANES-sparse is a utility which takes the last scan file of a sparse XANES scan (inpath), defines the 2D full grid, inserts the data in the correct rows, stack the images, and completes the missing data by using looped alternating steepest descent (ASD).",
  },
  {
    label: "XRD 1D",
    value: "xrd1d-batch",
    desc: "XRD can be used to spatially map changes in crystallographic direction, d-spacing or strain across a sample.",
  },
  {
    label: "XRD 2D",
    value: "xrd2d-batch",
    desc: "XRD 2D is a utility which performs Azimuthal integration (ExcaliburXRDIntegration) and saves result to a nxs file",
  },
];
