# Quantum Chemistry Lab — Module 01 (revised)

This package replaces the first prototype with a more deliberate chemical-system builder. It is a static browser application designed for GitHub Pages. It does **not** run the underlying simulation programs.

## Contents

- `public/index.html` — application landing page
- `public/chemical-system-builder.html` — structure editor, SDF→CIF converter, software-specific input generator, exports/checks
- `public/assets/system-builder.js` — editor and generation logic
- `public/assets/system-builder.css`, `public/assets/style.css` — UI styles
- `.github/workflows/deploy.yml` — deploys the `public/` folder to GitHub Pages

## Install/replace in GitHub

1. Extract this ZIP.
2. In your `quantum-chemistry-lab` repository, upload the **contents** of the extracted folder to the repository root.
3. Overwrite files with matching names, including `.github/workflows/deploy.yml` if prompted. Note that `.github` is a hidden folder in some file browsers; if it is not visible, create/edit `.github/workflows/deploy.yml` directly in GitHub as needed.
4. Commit to branch `main`.
5. In Settings → Pages, select **GitHub Actions** as the source.
6. Check Actions for a green deployment run.

For a project repository named `quantum-chemistry-lab`, the module page should be available at:
`https://USERNAME.github.io/quantum-chemistry-lab/chemical-system-builder.html`

## Features

### Molecular editor
- Add elements manually by clicking the canvas.
- Create single, double, triple, and aromatic bonds by selecting two atoms in Bond mode.
- Delete selected atoms, inspect/edit coordinates, import V2000 SDF/MOL, XYZ, or PDB, and export SDF, XYZ, PDB, CIF, and DFTB+ GEN.
- The simple “Add H” function uses a valence heuristic and must be checked. “Clean 2D layout” is a drawing layout, **not** a molecular mechanics or quantum geometry optimization.
- The 3D preview uses 3Dmol.js from a CDN and requires an internet connection.

### SDF → CIF
- Reads V2000 SDF/MOL files (V3000 is not supported in this version).
- Requires user-supplied cell parameters because ordinary molecular SDF files do not define a crystallographic lattice.
- Writes a P1 CIF, optionally centering the molecule in the specified cell. It does not infer experimental crystal packing, symmetry, or a physically appropriate vacuum region.

### Input templates
- Gaussian, ORCA, Quantum ESPRESSO `pw.x`, DFTB+, PACKMOL, GROMACS `.mdp`, and LAMMPS input starter.
- PACKMOL supports tolerance, filetype, output, optional PBC, multiple `structure` blocks, molecule counts, and inside/outside regions. Coordinate templates must be supplied separately.
- DFTB+ download includes a companion GEN file.
- Quantum ESPRESSO needs compatible UPF pseudopotentials; DFTB+ needs compatible Slater–Koster files; GROMACS and LAMMPS need validated force-field/topology and parameter files.

## Scientific limitations

- The application generates templates and performs basic format checks; it does not prove that a structure or input is chemically correct or simulation-ready.
- Molecular editor coordinates are initially a 2D drawing with z=0. Use a real 3D builder/conformer generator and optimize with an appropriate method before production use.
- CIF export from a molecular SDF is a container conversion, not crystal prediction.
- Only SDF V2000, XYZ, and simple PDB atom records are parsed. CIF import/symmetry expansion is not included in this revision.
- Software syntax and supported keywords can vary by installed version. Always validate before running calculations.

## References

- PACKMOL official examples: https://m3g.github.io/packmol/examples.shtml
- PACKMOL official user guide: https://m3g.github.io/packmol/userguide.shtml
- 3Dmol.js: https://3dmol.org/doc/
