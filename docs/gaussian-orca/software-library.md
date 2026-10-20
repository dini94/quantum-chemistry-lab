# Software library

“Free to use” and “open source” are not interchangeable. Review each project's current license, terms, and distribution rules before adopting it.

## Molecular building and visualization

- **[Avogadro](https://avogadro.cc/)** — molecular editor and visualization environment.
- **[IQmol](https://iqmol.org/)** — molecular visualization and computational chemistry workflow support.
- **[Open Babel](https://openbabel.org/)** — chemistry file-format conversion and cheminformatics utilities.
- **[VMD](https://www.ks.uiuc.edu/Research/vmd/)** — molecular visualization, especially for large systems and trajectories.

## Wavefunction and electronic-structure analysis

- **[Multiwfn](http://sobereva.com/multiwfn/)** — broad wavefunction analysis, including electron density, orbitals, topology, and related descriptors. Check its current distribution and license terms; do not assume it is open source.
- **[Critic2](https://aoterodelaroza.github.io/critic2/)** — analysis of crystalline and molecular charge densities, including critical-point analysis.
- **[GaussSum](https://gausssum.sourceforge.net/)** — post-processing and visualization of selected computational chemistry results. Check supported formats and current maintenance status.
- **[cclib](https://cclib.github.io/)** — Python library for parsing output from several computational chemistry packages; verify support for the exact output and property needed.
- **[PySCF](https://pyscf.org/)** — Python-based electronic-structure program and library. It is a separate calculation engine, not a Gaussian/ORCA output viewer.

## Data analysis and plotting

- **Python, NumPy, pandas, SciPy, Matplotlib** — data cleaning, analysis, fitting, and plotting.
- **Jupyter** — documented and reproducible analysis notebooks.
- **ASE** — atomic structure handling and interfaces to multiple simulation tools.

## Choosing a tool

1. Confirm the file format is supported by the exact version.
2. Test on a small example with a known result.
3. Cross-check important values against the original program output.
4. Record tool version, settings, and conversion steps.
5. Review license obligations before redistribution or server deployment.

The tools listed here are not bundled with this website. No calculation is executed by this documentation site.
