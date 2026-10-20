# Theory and method selection

A quantum-chemistry result is meaningful only when the model, approximations, and numerical settings fit the scientific question. There is no universally best method for every molecule and property.

## 1. Electronic structure in brief

The electronic Schrödinger equation describes electrons moving in the field of nuclei. Practical methods use approximations because the full many-electron problem is generally too expensive to solve exactly for chemically useful systems.

- **Born–Oppenheimer approximation:** separates electronic and nuclear motion for many standard calculations.
- **Hartree–Fock (HF):** approximates each electron as moving in an average field; it does not include the full electron correlation.
- **Density functional theory (DFT):** uses electron density as the central variable. Accuracy depends on the exchange-correlation functional and other model choices.
- **Post-HF methods:** MP2 and coupled-cluster approaches treat electron correlation beyond HF, often at higher cost.
- **Multireference methods:** may be needed when several electronic configurations contribute strongly, such as some bond-breaking or excited-state problems.

## 2. Choosing a method

| Scientific need | Common starting point | Checks and caveats |
|---|---|---|
| Equilibrium geometry | Suitable DFT functional with polarized basis | Convergence, conformers, dispersion, benchmarks |
| Vibrational frequencies | Same model as geometry, when appropriate | Imaginary modes and frequency scaling |
| Noncovalent interactions | Method with suitable dispersion treatment | BSSE, basis convergence, solvent, geometry |
| UV–visible excited states | TD-DFT for suitable systems | Functional limitations, charge-transfer states, state ordering |
| Accurate relative energies | Benchmark-validated model; possibly post-HF | Basis convergence, correlation, thermal corrections |
| Open-shell systems | Method/reference appropriate to spin state | Spin contamination and broken-symmetry issues |
| Strong static correlation | Possibly multireference treatment | Active-space design and state character |

These are starting points, not universal prescriptions. Validate the model against literature, experiment, or higher-level calculations where possible.

## 3. Basis sets

A basis set represents molecular orbitals using mathematical functions. Larger basis sets usually increase cost and flexibility, but do not automatically fix an unsuitable functional or physical model.

- **Minimal and split-valence basis sets:** useful for learning or exploratory work.
- **Polarization functions:** allow electron density to change shape as bonding changes.
- **Diffuse functions:** often important for anions, Rydberg states, and weakly bound electron density.
- **Correlation-consistent basis sets:** support systematic basis-set convergence studies.
- **Effective core potentials:** replace explicit treatment of selected core electrons for some elements.

State the exact basis-set name, including relevant variants and element-specific choices.

## 4. Charge and spin multiplicity

Charge is the net molecular charge. Spin multiplicity is \(2S+1\), where \(S\) is total electronic spin. A closed-shell neutral molecule often has charge 0 and multiplicity 1, but radicals, ions, transition-metal complexes, and excited states require explicit chemical reasoning. Incorrect charge or multiplicity can yield a calculation that runs but answers the wrong question.

## 5. Solvent, dispersion, and environment

Implicit solvent models approximate bulk solvent effects without adding individual solvent molecules. Explicit solvent, counterions, surface models, or periodic boundary conditions may be needed for other questions. Dispersion corrections can be important for conformers, molecular packing, and noncovalent complexes.

## 6. Convergence and reliability

- **SCF convergence:** the self-consistent electronic solution has converged.
- **Geometry convergence:** optimization criteria are satisfied.
- **Frequency analysis:** checks local curvature of the potential-energy surface within the chosen model.
- **Numerical stability:** result is not unduly sensitive to integration grids, basis, starting geometry, or settings.

“Normal termination” alone is not proof that a scientific result is correct.

## Further reading

- [Gaussian official site](https://gaussian.com/)
- [ORCA 6.1 manual](https://www.faccts.de/docs/orca/6.1/manual/)
- [NIST Computational Chemistry Comparison and Benchmark Database](https://cccbdb.nist.gov/)
