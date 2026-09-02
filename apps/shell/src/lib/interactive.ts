import { GRADE_MAP } from '../data/classes';
import { buildWhatsAppLink } from '../data/site';

export function initEstimator(): void {
  const gradeBtns = document.querySelectorAll<HTMLButtonElement>('#gradeBtnGroup .grade-opt-btn');
  const checkboxes = document.querySelectorAll<HTMLInputElement>('#subjectBtnGroup input');
  const gradeTitle = document.getElementById('calcGradeTitle');
  const detailsText = document.getElementById('calcDetailsText');
  const estFee = document.getElementById('calcEstFee');
  const whatsappBtn = document.getElementById('whatsappCalcBtn') as HTMLAnchorElement | null;

  if (gradeBtns.length === 0) return;

  let currentGrade = gradeBtns[0]?.dataset.grade ?? 'g1_8';

  const update = (): void => {
    const subjects = Array.from(checkboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);
    const hours = subjects.length * 2;
    const gradeLabel = GRADE_MAP[currentGrade] ?? currentGrade;
    if (gradeTitle) gradeTitle.textContent = `Selected: ${gradeLabel}`;
    if (detailsText) detailsText.textContent = `Subjects: ${subjects.join(', ') || 'None'}`;
    if (estFee) estFee.textContent = `Est. Weekly Commitment: ~${hours} Hours`;
    if (whatsappBtn) {
      const msg = `Hi LearningHub Pokhara! Inquiry for ${gradeLabel}. Subjects: ${subjects.join(', ')}.`;
      whatsappBtn.href = buildWhatsAppLink(msg);
    }
  };

  gradeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      gradeBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentGrade = btn.dataset.grade ?? currentGrade;
      update();
    });
  });

  checkboxes.forEach((cb) => cb.addEventListener('change', update));
  update();
}

export function initToolsWidget(): void {
  const tabs = document.querySelectorAll<HTMLButtonElement>('.widget-tab-btn');
  const converter = document.getElementById('tab-converter');
  const formulas = document.getElementById('tab-formulas');
  const valueInput = document.getElementById('convertValue') as HTMLInputElement | null;
  const typeSelect = document.getElementById('convertType') as HTMLSelectElement | null;
  const result = document.getElementById('convertResult');

  const convert = (): void => {
    if (!valueInput || !typeSelect || !result) return;
    const val = parseFloat(valueInput.value) || 0;
    const type = typeSelect.value;
    let res = '';
    if (type === 'c2f') res = `${((val * 9) / 5 + 32).toFixed(1)} °F`;
    else if (type === 'm2ft') res = `${(val * 3.28084).toFixed(1)} ft`;
    else if (type === 'km2mi') res = `${(val * 0.621371).toFixed(1)} miles`;
    result.textContent = res;
  };

  tabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabs.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.tab;
      if (converter) converter.style.display = target === 'converter' ? 'block' : 'none';
      if (formulas) formulas.style.display = target === 'formulas' ? 'block' : 'none';
    });
  });

  valueInput?.addEventListener('input', convert);
  typeSelect?.addEventListener('change', convert);
  convert();
}

export function initContactForm(): void {
  const form = document.getElementById('contactForm') as HTMLFormElement | null;
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = form.querySelector('#cName') as HTMLInputElement | null;
    const name = nameInput?.value ?? 'there';
    window.alert(`Thank you ${name}! Your inquiry has been received. We will call you shortly.`);
    form.reset();
  });
}
