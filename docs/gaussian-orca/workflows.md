# Calculation workflows

## 1. Single-point energy (SP)

Calculates electronic energy for a supplied geometry without optimizing nuclear coordinates. Confirm that geometry and model chemistry are appropriate.

## 2. Geometry optimization

Finds a nearby stationary point on the potential-energy surface. Results depend on starting geometry, optimizer, convergence criteria, and model chemistry. Flexible molecules may have multiple conformers and local minima.

## 3. Vibrational frequencies and thermochemistry

Frequency calculations provide harmonic vibrational modes and, under stated approximations, zero-point and thermal corrections. An optimized minimum normally has no significant imaginary vibrational modes; a first-order transition state normally has one relevant imaginary mode. Inspect the mode rather than relying only on the count.

## 4. Excited states (for example, TD-DFT)

Can estimate vertical excitation energies, oscillator strengths, and state characters. Charge-transfer, Rydberg, double-excitation, and strongly correlated states may challenge common approximations. Compare methods or experiment when important.

## 5. NMR and EPR properties

NMR shielding and EPR-related properties require suitable methods, basis sets, reference conventions, and careful interpretation. Report the protocol and how calculated shieldings were converted to chemical shifts, if applicable.

## 6. Transition states and reaction paths

Transition-state searches are sensitive to the initial guess. Verify the transition state using its imaginary mode and follow an intrinsic reaction coordinate (IRC) or another justified path analysis when needed. Confirm endpoints correspond to intended reactant and product.

## 7. Solvation and noncovalent interactions

State whether solvent is implicit or explicit and how the environment is represented. For interaction energies, define the sign convention and whether zero-point or thermal corrections are included. Consider BSSE and consistent fragment/complex calculations.

## 8. Population and orbital analyses

Mulliken, Löwdin, Hirshfeld, natural population, and related charges are model-dependent partitions, not direct observables. HOMO/LUMO energies and orbital pictures do not alone prove reactivity or device performance. Include additional evidence for strong claims.

## 9. Higher-level methods and special cases

MP2, coupled-cluster, multireference, relativistic, and other specialized methods have distinct assumptions and costs. Confirm availability and exact syntax in the relevant program manual. For transition metals and open-shell species, examine spin state, reference quality, and possible spin contamination.

## A robust sequence

1. Validate structure and charge/spin.
2. Optimize with a justified method.
3. Check frequencies if stationary-point character matters.
4. Run the target property calculation.
5. Inspect warnings, convergence, and numerical settings.
6. Cross-check key values and archive inputs/outputs.
