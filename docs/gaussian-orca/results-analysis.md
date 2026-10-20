# Results analysis and visualization

A parser or visualization program can help organize data, but scientific interpretation still requires checking the calculation and understanding the model.

## 1. First checks in the output

- Did the calculation terminate normally?
- Did the SCF procedure converge?
- Did geometry optimization satisfy its criteria?
- Are there warnings about integration grids, linear dependence, instability, or failed steps?
- Is the final geometry the one intended for analysis?
- Are energy units and thermochemical conventions understood?

## 2. Common quantities

| Quantity | Typical unit | Interpretation caution |
|---|---|---|
| Electronic energy | Hartree | Compare only consistent definitions and model settings |
| Relative energy | kJ mol⁻¹ or kcal mol⁻¹ | State reference, sign convention, and corrections |
| Vibrational frequency | cm⁻¹ | Harmonic values may need scaling; inspect imaginary modes |
| Excitation energy | eV or nm | Conversion is straightforward; state assignments remain model-dependent |
| Oscillator strength | dimensionless | Intensity depends on transition and model |
| Dipole moment | Debye | Depends on charge, geometry, and method |
| Atomic partial charge | e | Depends on partitioning scheme |

## 3. Molecular orbitals and electron density

GaussView, Avogadro, IQmol, and Multiwfn can support orbital or density analysis when used with compatible files. Cube grids can be large; record grid spacing and file provenance. Orbital isosurfaces are qualitative unless supported by quantitative analysis.

## 4. Spectra

For IR spectra, state whether frequencies were scaled and whether broadening was applied. For UV–visible spectra, record transition energies, oscillator strengths, broadening model, and any energy correction. Do not silently tune a plot to make it look more similar to experiment.

## 5. Suggested reproducible data table

| System | Method/basis | Property | Value | Unit | Source file | Validation |
|---|---|---|---:|---|---|---|
| Example only | DFT / stated basis | Relative energy | — | kJ mol⁻¹ | output file | Cross-check required |

Do not fill publication tables with unverified values copied from partial output snippets. Keep raw outputs and analysis scripts.

## 6. Plotting workflow

1. Extract values using a parser or documented script.
2. Check units, missing values, duplicate records, and sign conventions.
3. Preserve a raw-data file before transformations.
4. Plot with labelled axes, units, legend, and a clear caption.
5. Export vector graphics (SVG/PDF) when suitable and high-resolution raster images when required.
6. Record plotting software/version and the data file used.

See the [software library](software-library.md) for output parsers and visualization tools. The website demo uses illustrative examples only; it does not parse real calculation files yet.
