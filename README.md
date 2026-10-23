# Quantum Chemistry Studio — Gaussian 16 + ORCA (prototype)

A modular web prototype for molecular structure preparation and generating/editing Gaussian and ORCA input files. The web app does **not** run Gaussian or ORCA; use your licensed/authorized local installation or HPC.

## What's included

- `public/index.html`: single-page interface with four tabs: Molecular Builder, Gaussian 16, ORCA, Upload/Edit.
- `public/assets/app.js`: SMILES depiction (RDKit.js), basic atom/visual-bond editing, XYZ import/export, PDB export, input generation, file upload/edit/download.
- `backend/app.py`: optional FastAPI service using RDKit + ASE for SMILES → ETKDG 3D geometry → MMFF94/UFF optimization and structure package export. `/api/optimize` returns optimized XYZ and metadata; `/api/export` returns ZIP containing XYZ/PDB/CIF/GEN where supported.
- `.github/workflows/deploy.yml`: deploys the `public/` directory to GitHub Pages.

## Recent additions

- `public/rdkit-workbench.html`: dedicated RDKit Molecular Design Lab with SMILES depiction, descriptor export, scaffold substituent enumeration, and optional 3D pre-optimization.
- `POST /api/descriptors`: molecular descriptor calculations.
- `POST /api/enumerate`: single-attachment substituent enumeration for scaffolds containing exactly one `[*]` wildcard.
- `backend/tests/test_app.py`: regression tests for descriptors and enumeration.
- `public/workbench-guide.html`: Gaussian 16 / ORCA input examples and Multiwfn post-processing notes.

## Deploy to GitHub Pages

1. Extract the ZIP and upload the **contents** of this folder to the repository root, preserving `public/`, `backend/`, and `.github/workflows/`.
2. In GitHub, open **Settings → Pages** and select **GitHub Actions** as the build/deployment source.
3. Push to the default branch. The workflow publishes `public/`.
4. If an older MkDocs workflow is active, disable it or ensure it does not compete with this workflow.

The web app's SMILES 2D depiction uses the RDKit.js CDN and the 3D preview uses 3Dmol.js CDN. A network connection is needed for those libraries.

## Enable real 3D pre-optimization locally (Mac/Linux)

Requires Python 3.11 and conda/mamba or another Python environment manager. From the extracted project folder:

```bash
conda create -n qcs-builder -c conda-forge python=3.11 rdkit ase fastapi uvicorn
conda activate qcs-builder
cd backend
uvicorn app:app --host 127.0.0.1 --port 8765
```

Keep the terminal running. Then open the deployed page. Some browsers may restrict a hosted HTTPS page from connecting to a loopback HTTP service; if so, serve the page locally (for example, `python -m http.server 8000` from `public/`) or use the API directly. Local backend only performs RDKit molecular mechanics and structure export; it does not execute Gaussian or ORCA.

## Fix RDKit local backend errors (Mac)

The **Generate 3D + pre-optimize** and **Enumerate candidates** actions require the local Python API; they cannot call a backend that is not running. A GitHub Pages HTTPS tab may also be blocked by browser mixed-content/security rules when it tries to call a local HTTP API.

1. Pull/download the latest repository files.
2. In Terminal, go to the repository root (the folder containing `start-local-mac.sh`).
3. Activate the Python/Conda environment that has RDKit installed.
4. Run:
   ```bash
   bash start-local-mac.sh
   ```
5. Open `http://localhost:8000/rdkit-workbench.html`, then press **Check backend**. Leave that Terminal running while using the page.
6. If the script reports missing packages, install the backend requirements in the active environment:
   ```bash
   python -m pip install -r backend/requirements.txt
   ```

The launcher starts the website on port 8000 and the API on port 8765. If either port is already in use, stop the old server or change the ports consistently in the script, API URL field, and instructions. Open the `http://localhost:8000` page—not the GitHub Pages URL—for local API functions.

## Current limitations (important)

- This is a **working prototype**, not yet a full Avogadro replacement. The atom/bond canvas is basic; visual bond edits are not yet a complete valence-aware molecular graph editor. For robust chemical structures, prefer SMILES or upload a valid SDF/MOL/XYZ.
- Browser import is strongest for XYZ. Some SDF/MOL support depends on RDKit.js parsing. CIF is accepted as text in the file workspace but not fully parsed as a crystallographic structure in the browser.
- Gaussian and ORCA builders generate editable starter templates. Advanced tasks such as ONIOM, Counterpoise, coordinate scans, NBO, EPR/NMR, DOCKER, GOAT, MD, NEB, CASSCF/NEVPT2 and DLPNO-CCSD(T) can require additional keywords, fragments, external files, or version-specific setup. Always check the generated file against the manual for your installed version.
- DOCKER in the ORCA builder means ORCA's host–guest docking algorithm. It is not a Docker container launcher.
- For Gaussian/ORCA input, the default coordinates are a sample water geometry until you load or generate your own structure. Verify charge, multiplicity, geometry, basis sets, method support and resource settings before submitting a calculation.
- RDKit MMFF94/UFF is molecular mechanics, not DFT. A padded P1 CIF is a convenient coordinate container, not a predicted crystal structure.
- The current backend has permissive CORS for local prototyping. Do not expose it to the public internet without authentication, restricted origins, and a security review.

## Planned next increments

1. Upgrade molecule editor to a robust 2D chemical editor + full 3D manipulation, valence validation, bond orders, stereochemistry, fragment attachment, and more import/export formats.
2. Improve Gaussian and ORCA generators with versioned task presets, structured validation, separate charge/multiplicity and fragment/spin controls, checkpoint/restart and HPC script builders.
3. Parse uploaded `.log`, `.out`, `.chk`/`.gbw`-related metadata where formats permit and add output visualization/analysis.
