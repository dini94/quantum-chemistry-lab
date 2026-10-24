/* Browser-only 3D conformer generation + MMFF94 for the main molecular builder. */
let OCL = null; // Optional 3D engine; keep the main builder independent of this CDN.

const $ = (id) => document.getElementById(id);
const symbols = ['', 'H','He','Li','Be','B','C','N','O','F','Ne','Na','Mg','Al','Si','P','S','Cl','Ar','K','Ca','Sc','Ti','V','Cr','Mn','Fe','Co','Ni','Cu','Zn','Ga','Ge','As','Se','Br','Kr','Rb','Sr','Y','Zr','Nb','Mo','Tc','Ru','Rh','Pd','Ag','Cd','In','Sn','Sb','Te','I','Xe'];
let ready = false;

function notify(message) {
  const el = $('backendStatus');
  if (el) el.textContent = message;
}
function fmt(n) { return Number.isFinite(n) ? Number(n.toFixed(3)).toString() : String(n); }

async function browserOptimize() {
  const button = $('optimize');
  button.disabled = true;
  notify('Generating a 3D conformer and minimising with MMFF94 in your browser…');
  try {
    if (!OCL || !ready) throw new Error('OpenChemLib 3D engine did not load. SMILES input remains available; check the 3D engine status below.');
    const smiles = $('smiles').value.trim();
    if (!smiles) throw new Error('Enter a SMILES string first.');
    const molecule = OCL.Molecule.fromSmiles(smiles);
    const generator = new OCL.ConformerGenerator(20261024);
    const conformer = generator.getOneConformerAsMolecule(molecule);
    if (!conformer) throw new Error('Could not generate a 3D conformer for this molecule.');
    const ff = new OCL.ForceFieldMMFF94(conformer, 'MMFF94');
    const e0 = ff.getTotalEnergy();
    const rc = ff.minimise();
    const energy = ff.getTotalEnergy();
    const n = conformer.getAllAtoms();
    const coords = Array.from({ length: n }, (_, i) => [
      conformer.getAtomX(i), conformer.getAtomY(i), conformer.getAtomZ(i)
    ]);
    const atomSymbols = Array.from({ length: n }, (_, i) => symbols[conformer.getAtomicNo(i)] || 'X');
    const xyz = n + '\nGenerated in browser by OpenChemLib; MMFF94 minimisation return=' + rc + '\n' +
      atomSymbols.map((s, i) => s.padEnd(2) + ' ' + coords[i].map(v => v.toFixed(8).padStart(14)).join(' ')).join('\n') + '\n';
    if (typeof window.QCSSetMolecule !== 'function') throw new Error('Molecular builder is not ready. Reload the page and try again.');
    window.QCSSetMolecule({
      symbols: atomSymbols,
      coords,
      smiles: conformer.toSmiles(),
      formula: conformer.getMolecularFormula().formula,
      xyz
    });
    notify('Browser-only · OpenChemLib/MMFF94 · energy ' + fmt(e0) + ' → ' + fmt(energy) +
      ' · minimisation status ' + rc + ' · ' + n + ' atoms including H. Molecular mechanics, not DFT.');
  } catch (error) {
    notify('Local 3D optimisation failed: ' + (error.message || error) + '. No backend was contacted.');
  } finally {
    button.disabled = false;
  }
}
window.QCSBrowserOptimize = browserOptimize;

async function init() {
  try {
    OCL = await import('https://cdn.jsdelivr.net/npm/openchemlib@9.25.1/+esm');
    await OCL.Resources.registerFromUrl('https://cdn.jsdelivr.net/npm/openchemlib@9.25.1/dist/resources.json');
    ready = true;
    notify('Browser-only mode ready · OpenChemLib/MMFF94 3D engine loaded · no API server or billing.');
  } catch (error) {
    OCL = null;
    ready = false;
    notify('SMILES builder is separate from the optional 3D engine. OpenChemLib failed to load: ' + (error.message || error));
  }
}
init();
