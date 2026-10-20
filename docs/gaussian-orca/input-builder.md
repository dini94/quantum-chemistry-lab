# Input builder: Gaussian and ORCA

These examples are templates for learning and adaptation, not a guarantee that every calculation is appropriate for every system. Verify syntax against the manual for your installed software version.

## Example A — Geometry optimization

### Gaussian

```text
%chk=water_opt.chk
%mem=4GB
%nprocshared=4
#p B3LYP/def2SVP Opt

Water geometry optimization (illustrative template)

0 1
O   0.000000   0.000000   0.000000
H   0.758000   0.000000   0.504000
H  -0.758000   0.000000   0.504000
```

### ORCA

```text
! B3LYP def2-SVP Opt TightSCF

* xyz 0 1
O   0.000000   0.000000   0.000000
H   0.758000   0.000000   0.504000
H  -0.758000   0.000000   0.504000
*
```

Resource directives and keyword choices are examples. Adjust memory, CPU count, SCF settings, integration grids, dispersion treatment, and basis set to the system and compute environment.

## Example B — Optimization followed by frequencies

### Gaussian

```text
%chk=water_optfreq.chk
#p B3LYP/def2SVP Opt Freq

Optimization and frequencies

0 1
[replace with complete coordinates]
```

### ORCA

```text
! B3LYP def2-SVP Opt Freq TightSCF

* xyz 0 1
[replace with complete coordinates]
*
```

Bracketed text is a placeholder, not a valid coordinate. For a minimum, inspect imaginary frequencies and assess their mode character.

## Example C — TD-DFT excited states

### Gaussian

```text
%chk=molecule_tddft.chk
#p CAM-B3LYP/def2SVP TD(NStates=10)

TD-DFT example

0 1
[replace with complete coordinates]
```

### ORCA

```text
! CAM-B3LYP def2-SVP TightSCF

%tddft
  nroots 10
end

* xyz 0 1
[replace with complete coordinates]
*
```

TD-DFT accuracy depends on state character and method suitability. Check the relevant manual for version-specific syntax and supported features.

## Example D — Single-point energy

### Gaussian

```text
#p PBE0/def2TZVP SP

Single-point energy on a validated geometry

0 1
[replace with complete coordinates]
```

### ORCA

```text
! PBE0 def2-TZVP TightSCF SP

* xyz 0 1
[replace with complete coordinates]
*
```

Use the same geometry and clearly document model chemistry when comparing energies. An energy value alone does not establish a reliable reaction or interaction energy.

## Input preparation checklist

- [ ] Correct software syntax and version
- [ ] Charge and multiplicity checked
- [ ] Method and basis set appropriate to the question
- [ ] Solvent and dispersion model considered
- [ ] Memory and parallel settings compatible with resources
- [ ] Output and scratch paths have adequate space
- [ ] Input file and software version archived

Use the [interactive demo](../simulator/index.md) to preview how selections change example input text. The demo does not validate molecular chemistry and does not execute calculations.
