# Quantum Chemistry Studio — Gaussian 16 + ORCA (prototype)

A modular web prototype for molecular structure preparation and generating/editing Gaussian and ORCA input files. The web app does **not** run Gaussian or ORCA; use your licensed/authorized local installation or HPC.

## What's included

- `public/index.html`: single-page interface with four tabs: Molecular Builder, Gaussian 16, ORCA, Upload/Edit.
- `public/assets/app.js`: SMILES depiction (RDKit.js), basic atom/visual-bond editing, browser-side 3D optimization hook, XYZ import/export, PDB export, input generation, file upload/edit/download.
- `public/assets/offline-builder.js`: browser-side 3D conformer generation and MMFF94 minimization using OpenChemLib; no Python API server is required.
- `backend/app.py`: optional FastAPI service using RDKit + ASE for SMILES → ETKDG 3D geometry → MMFF94/UFF optimization and structure package export. `/api/optimize` returns optimized XYZ and metadata; `/api/export` returns ZIP containing XYZ/PDB/CIF/GEN where supported.
- `.github/workflows/deploy.yml`: deploys the `public/` directory to GitHub Pages.

## Recent additions

- `public/rdkit-workbench.html`: browser-only RDKit Molecular Design Lab with SMILES depiction, descriptor export, scaffold substituent enumeration, 3D conformer generation, and MMFF94 pre-optimization.
- `public/assets/offline-chemistry.js`: local-in-browser descriptors, substituent enumeration, 3D conformers, MMFF94 minimization, and XYZ/SDF export.
- `backend/tests/test_app.py`: regression tests for descriptors and enumeration.
- `public/workbench-guide.html`: Gaussian 16 / ORCA input examples and Multiwfn post-processing notes.

## Deploy to GitHub Pages

1. Extract the ZIP and upload the **contents** of this folder to the repository root, preserving `public/`, `backend/`, and `.github/workflows/`.
2. In GitHub, open **Settings → Pages** and select **GitHub Actions** as the build/deployment source.
3. Push to the default branch. The workflow publishes `public/`.
4. If an older MkDocs workflow is active, disable it or ensure it does not compete with this workflow.

The web app's SMILES 2D depiction uses the RDKit.js CDN and the 3D preview uses 3Dmol.js CDN. A network connection is needed for those libraries.

## Free public hosting (no backend or billing)

The public website is hosted as a static site on GitHub Pages. The main Molecular Builder and RDKit Design Lab use browser-side JavaScript/WebAssembly for molecular depiction, descriptors, substituent enumeration, 3D conformer generation, MMFF94 minimization, and XYZ/SDF export. Visitors do not need Python, a local terminal, an account, a backend server, or a paid hosting service.

OpenChemLib and RDKit.js are loaded from public CDNs, so an internet connection is required when the page first loads. Molecular processing runs in the visitor browser; the structure is not uploaded to this project server. Gaussian 16 and ORCA calculations are not executed by the website: it prepares input files for software installations that the user is authorized to use.

The backend/ folder remains as an optional self-hosted Python implementation for developers who want to run the API themselves; the public GitHub Pages site no longer depends on it. Do not create a Render service or add billing details for this browser-only deployment.

## Current limitations (important)

- This is a **working prototype**, not yet a full Avogadro replacement. The atom/bond canvas is basic; visual bond edits are not yet a complete valence-aware molecular graph editor. For robust chemical structures, prefer SMILES or upload a valid SDF/MOL/XYZ.
- Browser import is strongest for XYZ. Some SDF/MOL support depends on RDKit.js parsing. CIF is accepted as text in the file workspace but not fully parsed as a crystallographic structure in the browser.
- Gaussian and ORCA builders generate editable starter templates. Advanced tasks such as ONIOM, Counterpoise, coordinate scans, NBO, EPR/NMR, DOCKER, GOAT, MD, NEB, CASSCF/NEVPT2 and DLPNO-CCSD(T) can require additional keywords, fragments, external files, or version-specific setup. Always check the generated file against the manual for your installed version.
- DOCKER in the ORCA builder means ORCA's host–guest docking algorithm. It is not a Docker container launcher.
- For Gaussian/ORCA input, the default coordinates are a sample water geometry until you load or generate your own structure. Verify charge, multiplicity, geometry, basis sets, method support and resource settings before submitting a calculation.
- RDKit MMFF94/UFF is molecular mechanics, not DFT. A padded P1 CIF is a convenient coordinate container, not a predicted crystal structure.
- The public API restricts browser CORS to the GitHub Pages origin and local development origins. CORS is not authentication: add rate limiting and abuse monitoring before promoting it as a production service.

## Planned next increments

1. Upgrade molecule editor to a robust 2D chemical editor + full 3D manipulation, valence validation, bond orders, stereochemistry, fragment attachment, and more import/export formats.
2. Improve Gaussian and ORCA generators with versioned task presets, structured validation, separate charge/multiplicity and fragment/spin controls, checkpoint/restart and HPC script builders.
3. Parse uploaded `.log`, `.out`, `.chk`/`.gbw`-related metadata where formats permit and add output visualization/analysis.
