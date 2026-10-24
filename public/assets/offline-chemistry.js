/* Browser-only chemistry layer for Quantum Chemistry Lab.
 * RDKit.js handles SMILES validation and descriptors; OpenChemLib handles 3D conformers
 * and MMFF94 minimisation entirely in the visitor's browser. No API server is used.
 */
let OCL = null; // Load independently so an OpenChemLib CDN failure cannot disable RDKit/SMILES.

const $ = (id) => document.getElementById(id);
const status = (id, message, kind = '') => {
  const el = $(id);
  if (!el) return;
  el.className = 'status ' + kind;
  el.textContent = message;
};
const download = (name, content, type = 'text/plain') => {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1200);
};
const csv = (rows) => {
  if (!rows.length) return '';
  const keys = [...new Set(rows.flatMap((r) => Object.keys(r)))];
  return [keys.join(','), ...rows.map((r) => keys.map((k) => {
    const v = String(r[k] ?? '');
    return '"' + v.replaceAll('"', '""') + '"';
  }).join(','))].join('\n');
};
const esc = (v) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const fmt = (v) => typeof v === 'number' && Number.isFinite(v) ? Number(v.toFixed(3)).toString() : (v ?? '—');
const elementSymbols = ['', 'H','He','Li','Be','B','C','N','O','F','Ne','Na','Mg','Al','Si','P','S','Cl','Ar','K','Ca','Sc','Ti','V','Cr','Mn','Fe','Co','Ni','Cu','Zn','Ga','Ge','As','Se','Br','Kr','Rb','Sr','Y','Zr','Nb','Mo','Tc','Ru','Rh','Pd','Ag','Cd','In','Sn','Sb','Te','I','Xe'];

let rdkit = null, oclReady = false, lastMol = null, lastDesc = null, lastXYZ = '', lastSDF = '', lastCandidates = [], viewer = null;

function localDescriptors(smiles) {
  const mol = rdkit.get_mol(smiles);
  if (!mol) throw new Error('SMILES tidak valid menurut RDKit.js.');
  const d = JSON.parse(mol.get_descriptors());
  let formula = 'Unavailable (OpenChemLib not loaded)';
  let charge = null;
  if (OCL) {
    try {
      const oclMol = OCL.Molecule.fromSmiles(smiles);
      formula = oclMol.getMolecularFormula().formula;
      charge = Array.from({length: oclMol.getAllAtoms()}, (_, i) => oclMol.getAtomCharge(i)).reduce((a, b) => a + b, 0);
    } catch (_) { /* RDKit depiction and descriptors remain usable independently. */ }
  }
  const out = {
    smiles: mol.get_smiles(),
    formula,
    atom_count: mol.get_num_atoms(),
    formal_charge: charge,
    molecular_weight: d.amw ?? d.MolWt ?? oclMol.getMolweight(),
    exact_mass: d.exactmw,
    logp: d.CrippenClogP ?? d.MolLogP,
    tpsa: d.tpsa ?? d.TPSA,
    hbd: d.NumHDonors,
    hba: d.NumHAcceptors,
    rotatable_bonds: d.NumRotatableBonds,
    rings: d.NumRings,
    fraction_csp3: d.FractionCSP3,
    qed: d.qed
  };
  mol.delete();
  return out;
}

function drawDescriptorResults(d) {
  lastDesc = d;
  const labels = {
    molecular_weight:'Molecular weight (g/mol)', exact_mass:'Exact mass (Da)', logp:'Crippen cLogP',
    tpsa:'TPSA (Å²)', hbd:'H-bond donors', hba:'H-bond acceptors',
    rotatable_bonds:'Rotatable bonds', rings:'Ring count', fraction_csp3:'Fraction Csp3', qed:'QED'
  };
  $('descriptorGrid').innerHTML = Object.entries(labels).map(([k, label]) =>
    '<div class="metric"><span>' + label + '</span><b>' + esc(fmt(d[k])) + '</b></div>'
  ).join('') + '<div class="metric"><span>Formula</span><b>' + esc(d.formula) + '</b></div>' +
    '<div class="metric"><span>Atoms (heavy atoms)</span><b>' + esc(d.atom_count) + '</b></div>' +
    '<div class="metric"><span>Formal charge</span><b>' + esc(d.formal_charge) + '</b></div>';
  $('quickMetrics').innerHTML = '<div class="metric"><span>FORMULA</span><b>' + esc(d.formula) + '</b></div>' +
    '<div class="metric"><span>MW</span><b>' + esc(fmt(d.molecular_weight)) + '</b></div>' +
    '<div class="metric"><span>cLogP</span><b>' + esc(fmt(d.logp)) + '</b></div>';
}

function buildLocal() {
  if (!rdkit) { status('status', 'RDKit.js belum siap. Periksa koneksi internet lalu muat ulang.', 'warn'); return; }
  try {
    const smi = $('smiles').value.trim();
    if (!smi) throw new Error('Masukkan SMILES terlebih dahulu.');
    if (lastMol) lastMol.delete();
    lastMol = rdkit.get_mol(smi);
    if (!lastMol) throw new Error('SMILES tidak valid. Periksa valensi, tanda kurung, ring closure, dan muatan.');
    $('smiles').value = lastMol.get_smiles();
    $('depiction').innerHTML = lastMol.get_svg(620, 360);
    const d = localDescriptors($('smiles').value);
    drawDescriptorResults(d);
    status('status', 'Struktur tervalidasi oleh RDKit.js. Deskriptor dihitung di browser; tidak ada data yang dikirim ke server.', 'ok');
  } catch (e) { status('status', e.message || 'Gagal membaca struktur.', 'warn'); }
}

function make3D() {
  if (!OCL) throw new Error('OpenChemLib gagal dimuat; fitur 3D terpisah dari pembacaan SMILES.');
  if (!oclReady) throw new Error('Mesin 3D browser belum selesai dimuat. Tunggu sebentar lalu coba lagi.');
  const smiles = $('smiles').value.trim();
  if (!smiles) throw new Error('Masukkan SMILES terlebih dahulu.');
  const mol = OCL.Molecule.fromSmiles(smiles);
  const generator = new OCL.ConformerGenerator(20261024);
  const conformer = generator.getOneConformerAsMolecule(mol);
  if (!conformer) throw new Error('Pembuatan konformer 3D gagal untuk struktur ini.');
  const ff = new OCL.ForceFieldMMFF94(conformer, 'MMFF94');
  const before = ff.getTotalEnergy();
  const rc = ff.minimise();
  const energy = ff.getTotalEnergy();
  const n = conformer.getAllAtoms();
  const xyz = n + '\nGenerated in browser by OpenChemLib; MMFF94 minimisation return=' + rc + '\n' +
    Array.from({length:n}, (_, i) => {
      const z = conformer.getAtomicNo(i);
      const symbol = elementSymbols[z] || 'X';
      return symbol.padEnd(2) + ' ' +
        conformer.getAtomX(i).toFixed(8).padStart(14) + ' ' +
        conformer.getAtomY(i).toFixed(8).padStart(14) + ' ' +
        conformer.getAtomZ(i).toFixed(8).padStart(14);
    }).join('\n') + '\n';
  const sdf = conformer.toMolfileV3() + '\n$$$$\n';
  return { conformer, xyz, sdf, before, energy, rc, n, smiles };
}

function show3D(xyz) {
  if (!window.$3Dmol) throw new Error('3Dmol.js belum termuat. Periksa koneksi internet lalu muat ulang.');
  if (!viewer) viewer = window.$3Dmol.createViewer($('viewer3d'), { backgroundColor: '#f8faff' });
  viewer.clear();
  viewer.addModel(xyz, 'xyz');
  viewer.setStyle({}, { stick: { radius: 0.16 }, sphere: { scale: 0.24 } });
  viewer.zoomTo(); viewer.render();
}

async function optimiseLocal() {
  const button = $('optimize');
  button.disabled = true;
  status('optStatus', 'Membuat konformer 3D dan menjalankan MMFF94 langsung di browser…');
  try {
    await new Promise((resolve) => setTimeout(resolve, 30));
    const result = make3D();
    lastXYZ = result.xyz; lastSDF = result.sdf;
    show3D(lastXYZ);
    status('optStatus', 'OpenChemLib · MMFF94 · energi awal ' + fmt(result.before) +
      ' → energi akhir ' + fmt(result.energy) + ' (kcal/mol sesuai konvensi implementasi) · status minimisasi ' +
      result.rc + ' · ' + result.n + ' atom termasuk H. Mekanika molekuler, bukan DFT.', 'ok');
    download('molecule_3d_mmff94.xyz', lastXYZ);
  } catch (e) {
    status('optStatus', 'Optimasi lokal gagal: ' + (e.message || e) + '. Tidak ada backend yang digunakan.', 'warn');
  } finally { button.disabled = false; }
}

function enumerateLocal() {
  if (!rdkit) { status('enumStatus', 'RDKit.js belum siap.', 'warn'); return; }
  const core = $('core').value.trim();
  const substituents = $('subs').value.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  if ((core.match(/\[\*\]/g) || []).length !== 1) {
    status('enumStatus', 'Core harus berisi tepat satu [*] sebagai titik substitusi.', 'warn'); return;
  }
  const seen = new Set(); lastCandidates = [];
  for (const sub of substituents) {
    try {
      if (sub.includes('[*]')) throw new Error('Substituen tidak boleh mengandung [*].');
      const smi = core.replace('[*]', sub);
      const m = rdkit.get_mol(smi);
      if (!m) throw new Error('SMILES hasil substitusi tidak valid.');
      const canonical = m.get_smiles();
      m.delete();
      if (seen.has(canonical)) continue;
      seen.add(canonical);
      const d = localDescriptors(canonical);
      d.substituent = sub;
      lastCandidates.push(d);
    } catch (e) { /* skip invalid substituent; report aggregate below */ }
    if (lastCandidates.length >= 100) break;
  }
  $('enumStatus').className = 'status ' + (lastCandidates.length ? 'ok' : 'warn');
  $('enumStatus').textContent = 'Selesai di browser: ' + lastCandidates.length + ' kandidat unik. Substituen yang tidak valid dilewati.';
  $('candidateTable').innerHTML = lastCandidates.length ?
    '<table><thead><tr><th>#</th><th>Substituen</th><th>SMILES</th><th>Formula</th><th>MW</th><th>cLogP</th><th>TPSA</th><th>QED</th></tr></thead><tbody>' +
    lastCandidates.map((x, i) => '<tr><td>' + (i + 1) + '</td><td>' + esc(x.substituent) + '</td><td><code>' + esc(x.smiles) + '</code></td><td>' + esc(x.formula) + '</td><td>' + esc(fmt(x.molecular_weight)) + '</td><td>' + esc(fmt(x.logp)) + '</td><td>' + esc(fmt(x.tpsa)) + '</td><td>' + esc(fmt(x.qed)) + '</td></tr>').join('') +
    '</tbody></table>' : 'Tidak ada kandidat valid.';
}

function updateOfflineUi() {
  const apiCard = $('apiUrl')?.closest('.card');
  if (apiCard) apiCard.style.display = 'none';
  document.querySelectorAll('.hero .muted').forEach((p) => {
    if (p.textContent.includes('public RDKit API')) p.textContent =
      'Molecular depiction, descriptors, conformer generation, MMFF94 pre-optimization, substituent enumeration, and file export run in your browser. No account, backend, or paid server required.';
  });
  const footer = document.querySelector('.footer');
  if (footer) footer.textContent = 'Quantum Chemistry Studio · RDKit.js + OpenChemLib/MMFF94 + 3Dmol.js · Browser-only processing. Review all structures before quantum-chemical calculations.';
}

async function ensureRDKitScript() {
  if (typeof window.initRDKitModule === 'function') return;
  const sources = [
    'https://unpkg.com/@rdkit/rdkit/dist/RDKit_minimal.js',
    'https://cdn.jsdelivr.net/npm/@rdkit/rdkit/dist/RDKit_minimal.js'
  ];
  let lastError;
  for (const src of sources) {
    try {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = () => { script.remove(); reject(new Error('Gagal memuat ' + src)); };
        document.head.appendChild(script);
      });
      if (typeof window.initRDKitModule === 'function') return;
      lastError = new Error('Skrip dimuat tetapi initRDKitModule tidak tersedia: ' + src);
    } catch (e) { lastError = e; }
  }
  throw lastError || new Error('RDKit.js tidak tersedia dari CDN yang dicoba.');
}

async function initOfflineChemistry() {
  updateOfflineUi();

  // RDKit is the primary SMILES/2D engine. Initialise it first and independently.
  try {
    await ensureRDKitScript();
    rdkit = await window.initRDKitModule();
    $('build').onclick = buildLocal;
    $('enumerate').onclick = enumerateLocal;
    $('downloadCsv').onclick = () => lastDesc ? download('molecular_descriptors.csv', csv([lastDesc]), 'text/csv') : status('status', 'Build molekul dahulu.', 'warn');
    $('downloadJson').onclick = () => lastDesc ? download('molecular_descriptors.json', JSON.stringify(lastDesc, null, 2), 'application/json') : status('status', 'Build molekul dahulu.', 'warn');
    $('downloadCandidates').onclick = () => lastCandidates.length ? download('substituent_candidates.csv', csv(lastCandidates), 'text/csv') : status('enumStatus', 'Jalankan enumerasi dahulu.', 'warn');
    $('downloadXyz').onclick = () => lastXYZ ? download('molecule_3d_mmff94.xyz', lastXYZ) : status('optStatus', 'Jalankan 3D + pre-optimize dahulu.', 'warn');
    $('downloadSdf').onclick = () => lastSDF ? download('molecule_3d_mmff94.sdf', lastSDF, 'chemical/x-mdl-sdfile') : status('optStatus', 'Jalankan 3D + pre-optimize dahulu.', 'warn');
    $('copySmiles').onclick = async () => {
      try { await navigator.clipboard.writeText($('smiles').value); status('status', 'Canonical SMILES disalin.', 'ok'); }
      catch { status('status', 'Clipboard tidak tersedia pada browser ini. Salin SMILES secara manual.', 'warn'); }
    };
    $('checkBackend').onclick = () => status('backendStatus', 'Mode browser-only aktif. Tidak ada backend atau server API.', 'ok');
    document.querySelectorAll('[data-smiles]').forEach((b) => { b.onclick = () => {
      $('smiles').value = b.dataset.smiles; buildLocal();
    }; });
    $('smiles').addEventListener('keydown', (e) => { if (e.key === 'Enter') buildLocal(); });
    buildLocal();
    status('backendStatus', 'Mode browser-only aktif · tidak ada backend · tidak ada billing.', 'ok');
  } catch (e) {
    status('status', 'RDKit.js tidak berhasil dimuat: ' + (e.message || e) + '. Coba muat ulang; fitur 3D tidak memengaruhi RDKit.', 'warn');
    return;
  }

  // OpenChemLib is optional for 2D/SMILES. Load it separately for 3D only.
  try {
    OCL = await import('https://cdn.jsdelivr.net/npm/openchemlib@9.25.1/+esm');
    await OCL.Resources.registerFromUrl('https://cdn.jsdelivr.net/npm/openchemlib@9.25.1/dist/resources.json');
    oclReady = true;
    status('optStatus', 'Mesin konformer dan MMFF94 browser siap. Struktur diproses di perangkat Anda.', 'ok');
  } catch (e) {
    OCL = null;
    oclReady = false;
    status('optStatus', 'SMILES/2D tetap tersedia. Mesin 3D OpenChemLib gagal dimuat: ' + (e.message || e), 'warn');
  }
}

initOfflineChemistry();
