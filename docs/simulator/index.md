# Interactive workflow demo

This browser demo illustrates how a user might choose a calculation and preview a corresponding input template. **All examples are educational. The demo does not execute Gaussian or ORCA and does not calculate molecular properties.**

<div class="demo-panel">
  <div class="demo-controls">
    <label for="engine">Software template</label>
    <select id="engine"><option value="gaussian">Gaussian</option><option value="orca">ORCA</option></select>
    <label for="task">Workflow</label>
    <select id="task">
      <option value="opt">Geometry optimization</option>
      <option value="optfreq">Optimization + frequencies</option>
      <option value="sp">Single-point energy</option>
      <option value="tddft">TD-DFT excited states</option>
    </select>
    <label for="charge">Charge</label>
    <input id="charge" type="number" value="0" min="-5" max="5">
    <label for="multiplicity">Spin multiplicity</label>
    <select id="multiplicity"><option value="1">1 — singlet</option><option value="2">2 — doublet</option><option value="3">3 — triplet</option><option value="4">4 — quartet</option></select>
    <button class="md-button md-button--primary" id="generate-demo" type="button">Generate example input</button>
  </div>
  <div class="demo-result">
    <div class="demo-warning"><strong>Educational preview only</strong><br>Check chemistry, syntax, software version, and resource settings before using any template.</div>
    <h3 id="demo-title">Example input</h3>
    <pre><code id="demo-input">Select a workflow and generate a template.</code></pre>
    <button class="md-button" id="copy-demo" type="button">Copy input</button>
    <p id="demo-status" aria-live="polite"></p>
  </div>
</div>

## What this demo does

- Builds example text from selected software and workflow.
- Substitutes charge and multiplicity into the example.
- Does **not** validate the structure, run a calculation, predict energy, or parse output files.

## Next step

Use a valid molecular structure and the [input builder guide](../gaussian-orca/input-builder.md), then run the job with authorized local or institutional software.
