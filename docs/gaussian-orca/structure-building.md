# Molecular structure building and validation

A well-formed input starts with a chemically sensible structure. Geometry errors can waste compute time or lead to misleading local minima.

## Suggested tools

- **Avogadro:** molecular construction, geometry inspection, and common structure formats.
- **IQmol:** molecular visualization and input-oriented workflows.
- **Open Babel:** format conversion and cheminformatics utilities.
- **GaussView:** visualization and workflow support for Gaussian users; check applicable license and installation.

Check each tool's current license and platform support before installing it.

## Structure checklist

1. Confirm atom identities, connectivity, bond orders, stereochemistry, and protonation state.
2. Check formal charge and intended spin state.
3. Remove unintended overlaps and inspect unusually short or long bonds.
4. Generate and compare relevant conformers when flexibility matters.
5. Use a sensible initial geometry; molecular-mechanics pre-optimization may help but does not replace quantum optimization.
6. Preserve atom ordering if comparing coordinates, charges, or orbitals across calculations.
7. Keep a copy of the original structure and record modifications.

## XYZ format example

```text
3
Illustrative water geometry; coordinates in angstrom
O   0.000000   0.000000   0.000000
H   0.758000   0.000000   0.504000
H  -0.758000   0.000000   0.504000
```

The second line is a comment. XYZ does not intrinsically encode molecular charge, spin multiplicity, or reliable bond connectivity; specify these separately and verify them chemically.

## Before launching a calculation

- [ ] Geometry file opens correctly in a viewer
- [ ] Atom count and elements match expectations
- [ ] Charge and multiplicity are chemically justified
- [ ] No accidental duplicate atoms or severe overlaps
- [ ] Conformer and stereochemistry choices documented
- [ ] Coordinate units understood
