# Learning paths

Choose a path based on your research goal. Exact methods and keywords depend on the system, software version, and scientific question.

## Path A — First molecular calculation

1. Learn charge, spin multiplicity, basis sets, and the difference between single-point calculations and geometry optimization.
2. Build and inspect a structure with a molecular editor.
3. Prepare an optimization input using the [input builder](gaussian-orca/input-builder.md).
4. Run the job locally and check normal termination and convergence.
5. Run a frequency calculation to confirm a minimum and inspect imaginary frequencies.
6. Document method, basis set, solvent model, software version, and final energy.

## Path B — Spectroscopy and electronic properties

1. Optimize the appropriate ground-state geometry.
2. Check whether frequency analysis supports the intended stationary point.
3. Choose an appropriate excited-state or property method.
4. Inspect transition assignments, oscillator strengths, orbitals, and population analyses carefully.
5. Compare calculation and experiment using consistent units and stated assumptions.

## Path C — Molecular interactions

1. Define the scientific question and relevant fragments.
2. Optimize isolated fragments and complex consistently.
3. Use consistent method, basis, solvent model, and convergence strategy.
4. Consider BSSE, dispersion, conformers, and thermal corrections when relevant.
5. Report the sign convention and energy expression explicitly.

## Path D — Reproducible publication

1. Preserve input and output files.
2. Record software versions, method, basis set, charge, multiplicity, solvent, and convergence criteria.
3. Extract numerical values with a validated parser or manual cross-check.
4. Generate figures with units, labels, and legends.
5. Archive scripts and raw data used to create tables and figures.

## Completion checklist

- [ ] Structure, atom ordering, charge, and multiplicity checked
- [ ] Method and basis set justified
- [ ] SCF and geometry convergence verified
- [ ] Frequencies interpreted appropriately
- [ ] Output values cross-checked
- [ ] Units and sign conventions stated
- [ ] Input, output, and analysis scripts archived
