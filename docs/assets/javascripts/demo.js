(function () {
  const byId = (id) => document.getElementById(id);
  function buildInput() {
    const engine = byId("engine"), task = byId("task"), charge = byId("charge"), mult = byId("multiplicity");
    const output = byId("demo-input"), title = byId("demo-title"), status = byId("demo-status");
    if (!engine || !task || !charge || !mult || !output) return;
    const q = Number.parseInt(charge.value || "0", 10), m = Number.parseInt(mult.value || "1", 10);
    const names = {opt:"Geometry optimization",optfreq:"Optimization + frequencies",sp:"Single-point energy",tddft:"TD-DFT excited states"};
    title.textContent = names[task.value] + " — " + (engine.value === "gaussian" ? "Gaussian" : "ORCA");
    let text = "";
    if (engine.value === "gaussian") {
      const route = {opt:"#p B3LYP/def2SVP Opt",optfreq:"#p B3LYP/def2SVP Opt Freq",sp:"#p PBE0/def2TZVP SP",tddft:"#p CAM-B3LYP/def2SVP TD(NStates=10)"}[task.value];
      text = "%chk=example.chk\n%mem=4GB\n%nprocshared=4\n" + route + "\n\nEducational template — replace coordinates and review settings\n\n" + q + " " + m + "\nO   0.000000   0.000000   0.000000\nH   0.758000   0.000000   0.504000\nH  -0.758000   0.000000   0.504000\n";
    } else {
      const route = {opt:"! B3LYP def2-SVP Opt TightSCF",optfreq:"! B3LYP def2-SVP Opt Freq TightSCF",sp:"! PBE0 def2-TZVP TightSCF SP",tddft:"! CAM-B3LYP def2-SVP TightSCF"}[task.value];
      text = route + "\n\n";
      if (task.value === "tddft") text += "%tddft\n  nroots 10\nend\n\n";
      text += "* xyz " + q + " " + m + "\nO   0.000000   0.000000   0.000000\nH   0.758000   0.000000   0.504000\nH  -0.758000   0.000000   0.504000\n*\n";
    }
    output.textContent = text;
    if (status) status.textContent = "Template generated. This is text only; no calculation was run.";
  }
  document.addEventListener("DOMContentLoaded", function () {
    const generate = byId("generate-demo"); if (generate) generate.addEventListener("click", buildInput);
    const copy = byId("copy-demo"); if (copy) copy.addEventListener("click", async function () {
      const output = byId("demo-input"), status = byId("demo-status");
      try { await navigator.clipboard.writeText(output ? output.textContent : ""); if (status) status.textContent = "Input text copied."; }
      catch (error) { if (status) status.textContent = "Copy was blocked by the browser. Select the text and copy it manually."; }
    });
  });
})();
