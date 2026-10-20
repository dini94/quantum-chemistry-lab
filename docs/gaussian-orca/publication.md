# Publication workflow

The goal is to make calculations reproducible and figures interpretable, not simply attractive.

## Minimum reporting checklist

- Software name and version
- Method and exact basis set
- Dispersion correction, if used
- Solvent model and solvent identity
- Charge and spin multiplicity
- SCF, geometry, and frequency convergence criteria
- Relativistic or effective-core-potential treatment when relevant
- Whether energies include zero-point or thermal corrections
- Frequency scaling factor and spectral broadening, if used
- Structure provenance and conformer selection
- Software used for post-processing and visualization

## Example computational methods template

> Molecular calculations were performed using [software and version]. Geometry optimizations were carried out at the [method]/[basis set] level, including [dispersion model, if applicable]. Solvent effects were represented using [model and solvent, if applicable]. The total charge and spin multiplicity were [charge] and [multiplicity]. Stationary-point character was assessed by harmonic frequency calculations. Additional properties were evaluated using [method and settings]. All reported values were checked against the corresponding output files.

Replace every bracketed field with the actual protocol. Do not use this template as a claim that calculations have already been performed.

## Table quality

- Include units in headers or captions.
- State the reference structure or energy for relative values.
- Use consistent significant figures; do not imply more precision than the method supports.
- Identify missing values and uncertainty sources.
- Keep raw extracted data separate from formatted tables.

## Figure quality

- Use readable labels, legends, and line widths.
- Choose palettes that remain distinguishable in print and for readers with color-vision differences.
- Do not crop out meaningful features or hide inconvenient data.
- State scaling, normalization, smoothing, broadening, or baseline treatment.
- Use vector formats for line art where practical.

## Reproducibility archive

```text
project/
├── structures/
├── inputs/
├── outputs/
├── analysis/
│   ├── scripts/
│   └── extracted_data/
├── figures/
├── tables/
└── README.md
```

Archive original input/output files, analysis scripts, software versions, and a README explaining how each figure and table was produced.
