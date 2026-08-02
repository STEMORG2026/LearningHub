import { test, expect } from '@playwright/test';

test.describe('Fee & Schedule Estimator (critical path)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#gradeBtnGroup .grade-opt-btn').first()).toBeVisible();
  });

  test('defaults to Grade 1-8 with the initial subjects', async ({ page }) => {
    await expect(page.locator('#calcGradeTitle')).toHaveText('Selected: Grade 1 – 8 (Foundation)');
    await expect(page.locator('#calcDetailsText')).toHaveText('Subjects: Mathematics, Physics, Chemistry');
    await expect(page.locator('#calcEstFee')).toHaveText('Est. Weekly Commitment: ~6 Hours');
  });

  test('switching grade updates the summary', async ({ page }) => {
    await page.locator('[data-grade="g11_12"]').click();
    await expect(page.locator('#calcGradeTitle')).toHaveText('Selected: Grade 11 – 12 (NEB)');
  });

  test('toggling subjects recomputes the commitment', async ({ page }) => {
    await page.locator('#subjectBtnGroup input[value="Chemistry"]').uncheck();
    await page.locator('#subjectBtnGroup input[value="Biology"]').check();
    await expect(page.locator('#calcDetailsText')).toHaveText('Subjects: Mathematics, Physics, Biology');
    await expect(page.locator('#calcEstFee')).toHaveText('Est. Weekly Commitment: ~6 Hours');
  });

  test('whatsapp link embeds the current selection', async ({ page }) => {
    const href = await page.locator('#whatsappCalcBtn').getAttribute('href');
    expect(href).toContain('wa.me');
    expect(href).toContain(encodeURIComponent('Grade 1 – 8 (Foundation)'));
    expect(href).toContain(encodeURIComponent('Mathematics, Physics, Chemistry'));
  });
});

test.describe('Unit converter widget (critical path)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#convertResult')).toBeVisible();
  });

  test('converts celsius to fahrenheit by default', async ({ page }) => {
    await expect(page.locator('#convertResult')).toHaveText('212.0 °F');
  });

  test('recomputes on value input', async ({ page }) => {
    await page.fill('#convertValue', '0');
    await expect(page.locator('#convertResult')).toHaveText('32.0 °F');
  });

  test('switches conversion mode and units', async ({ page }) => {
    await page.fill('#convertValue', '10');
    await page.selectOption('#convertType', 'm2ft');
    await expect(page.locator('#convertResult')).toHaveText('32.8 ft');
    await page.selectOption('#convertType', 'km2mi');
    await expect(page.locator('#convertResult')).toHaveText('6.2 miles');
  });

  test('switches to the formulas tab', async ({ page }) => {
    await page.locator('[data-tab="formulas"]').click();
    await expect(page.locator('#tab-formulas')).toBeVisible();
    await expect(page.locator('#tab-converter')).toBeHidden();
    await expect(page.locator('#tab-formulas').locator('text=PV = nRT')).toBeVisible();
  });
});

test.describe('STEM quiz attempt (critical path)', () => {
  test('answers the full physics quiz and reaches a result', async ({ page }) => {
    await page.goto('/');
    const quiz = page.locator('stem-quiz');
    await expect(quiz).toBeVisible();

    let guard = 0;
    while (guard < 40) {
      const nextBtn = quiz.locator('#quiz-next-btn');
      if (await nextBtn.isVisible()) {
        await nextBtn.click();
        guard += 1;
        continue;
      }
      const option = quiz.locator('.quiz-option-btn:not([disabled])').first();
      if ((await option.count()) === 0) break;
      await option.click();
      guard += 1;
    }

    await expect(quiz.locator('.quiz-result-card')).toBeVisible();
    await expect(quiz.locator('.quiz-result-score')).toHaveText(/^\d+%$/);
    await expect(quiz.locator('.quiz-result-total')).toContainText('Total Score:');
  });

  test('retake restarts the quiz with a fresh score', async ({ page }) => {
    await page.goto('/');
    const quiz = page.locator('stem-quiz');
    await expect(quiz).toBeVisible();

    let guard = 0;
    while (guard < 40) {
      const nextBtn = quiz.locator('#quiz-next-btn');
      if (await nextBtn.isVisible()) {
        await nextBtn.click();
        guard += 1;
        continue;
      }
      const option = quiz.locator('.quiz-option-btn:not([disabled])').first();
      if ((await option.count()) === 0) break;
      await option.click();
      guard += 1;
    }

    await expect(quiz.locator('.quiz-result-card')).toBeVisible();
    await quiz.locator('[data-action="retake"]').click();
    await expect(quiz.locator('.quiz-option-btn').first()).toBeVisible();
    await expect(quiz.locator('.quiz-result-card')).toBeHidden();
  });
});

test.describe('Class and pioneer filters (critical path)', () => {
  test('class carousel filters by category pill', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#classesGridContainer .soft-card')).toHaveCount(4);

    await page.locator('[data-filter="neb"]').click();
    await expect(page.locator('#classesGridContainer .soft-card')).toHaveCount(1);
    await expect(page.locator('#classesGridContainer .class-badge').first()).toBeVisible();

    await page.locator('#classes [data-filter="all"]').click();
    await expect(page.locator('#classesGridContainer .soft-card')).toHaveCount(4);
  });

  test('pioneer wall filters by field', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#pioneerGrid .pioneer-card')).toHaveCount(20);

    await page.locator('#pioneers [data-filter="math"]').click();
    const mathCount = await page.locator('#pioneerGrid .pioneer-card').count();
    expect(mathCount).toBeGreaterThan(0);
    expect(mathCount).toBeLessThan(20);

    await page.locator('#pioneers [data-filter="all"]').click();
    await expect(page.locator('#pioneerGrid .pioneer-card')).toHaveCount(20);
  });

  test('opening a class card launches the enroll modal', async ({ page }) => {
    await page.goto('/');
    await page.locator('#classesGridContainer .soft-card').first().click();
    const dialog = page.locator('dialog.modal-card');
    await expect(dialog).toBeVisible();
  });
});
