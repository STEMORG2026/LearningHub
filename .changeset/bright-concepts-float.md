---
"@stem-tuition/shell": minor
---

feat(content): extend narrated lessons to momentum, gravitation, power, buoyancy, pressure, work-energy

Continues the narrative overhaul: six more physics concepts are now told as
progressive, respectful stories instead of point-wise notes. Each new concept
honours the real people behind it with sourced statements (Descartes, Huygens,
Newton, Hooke, Halley, Cavendish, Einstein; Watt; Archimedes; Torricelli, Pascal,
Boyle; Coriolis, Thomson/Kelvin), a timeline, respected/differing views given due
weight, and a Curious→Nerd "Explained" deep-dive.

Authored concepts:
- momentum (quantity of motion from scalar to vector conservation)
- Newton's law of universal gravitation (inverse square → general relativity)
- power (Watt's horsepower → the SI watt)
- buoyancy (Archimedes' principle → why steel ships float)
- pressure (Torricelli, Pascal, Boyle → hydraulics)
- work-energy theorem (vis viva → the integral proof)

Integration test now asserts a narrated-set floor so an accidental loss of a
narrated concept is caught. Typecheck (22/22) and tests (22/22) pass.