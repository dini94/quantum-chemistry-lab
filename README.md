# Quantum Chemistry Lab

This repository contains the interactive web prototype and Module 01, **Chemical System Builder**.

## Module 01
Open `public/chemical-system-builder.html` locally or after deployment. It provides:
- Molecular coordinate editor and 3D preview
- Import for XYZ, PDB, basic CIF, DFTB+ GEN and MOL/SDF coordinates
- Periodic cell parameters, fractional-coordinate preview, and supercell replication
- Structure exports: XYZ, PDB, CIF, GEN and MOL; optional ZIP bundle
- Starter input templates for Gaussian, ORCA, Quantum ESPRESSO, DFTB+, PACKMOL, GROMACS and LAMMPS

## Deploy with GitHub Pages
1. Upload this repository's files to the repository root, preserving `public/` and `.github/workflows/deploy.yml`.
2. Set repository Settings → Pages → Build and deployment source to **GitHub Actions**.
3. Commit to `main` (or `master`) and check Actions for a successful deployment.
4. The main page is `index.html`; Module 01 is `chemical-system-builder.html` under the deployed site root.

## Scientific limitations
- No simulation engine runs in the browser.
- Input files are starter templates and require expert review.
- Quantum ESPRESSO needs correct UPF pseudopotentials and convergence settings; DFTB+ needs appropriate Slater–Koster parameter files.
- GROMACS and LAMMPS require validated force-field parameters and topology; coordinates alone are not enough.
- CIF import handles common atom-site loops but does not expand crystallographic symmetry or all disorder conventions.
- The 3D viewer and ZIP bundle rely on CDN libraries and need internet access.
