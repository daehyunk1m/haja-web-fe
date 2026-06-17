import { test, expect, seedBulletsByCount } from "../fixtures/test";

// @feature:F013 — 섹션 단일 확장(아코디언) + 부드러운 전환 + 우하단 추가 버튼 확대.
// jsdom 유닛으로는 잡지 못하는 레이아웃(flex-grow 확장/접힘)·실측 버튼 크기를 실 브라우저로 검증한다.
test.describe("@feature:F013 섹션 단일 확장 (아코디언)", () => {
  test("진입 시 태스크가 더 많은 컨테이너만 확장된다 (task > someday → TODAY)", async ({ page }) => {
    await page.addInitScript(seedBulletsByCount, { task: 5, someday: 3 });
    await page.goto("/");

    await expect(page.locator('[data-section="task"]')).toHaveAttribute("data-expanded", "true");
    await expect(page.locator('[data-section="someday"]')).toHaveAttribute("data-expanded", "false");
  });

  test("진입 시 someday가 더 많으면 SOMEDAY만 확장된다 (someday > task)", async ({ page }) => {
    await page.addInitScript(seedBulletsByCount, { task: 3, someday: 5 });
    await page.goto("/");

    await expect(page.locator('[data-section="someday"]')).toHaveAttribute("data-expanded", "true");
    await expect(page.locator('[data-section="task"]')).toHaveAttribute("data-expanded", "false");
  });

  test("탭을 누르면 확장 컨테이너가 전환된다 (항상 둘 중 하나만 확장)", async ({ page }) => {
    await page.addInitScript(seedBulletsByCount, { task: 5, someday: 3 });
    await page.goto("/");

    const taskSection = page.locator('[data-section="task"]');
    const somedaySection = page.locator('[data-section="someday"]');
    await expect(taskSection).toHaveAttribute("data-expanded", "true");

    // SOMEDAY 탭 클릭 → someday 확장, task 접힘
    await page.getByRole("button", { name: /SOMEDAY/ }).click();
    await expect(somedaySection).toHaveAttribute("data-expanded", "true");
    await expect(taskSection).toHaveAttribute("data-expanded", "false");

    // TODAY 탭 클릭 → 다시 task 확장, someday 접힘
    await page.getByRole("button", { name: /TODAY/ }).click();
    await expect(taskSection).toHaveAttribute("data-expanded", "true");
    await expect(somedaySection).toHaveAttribute("data-expanded", "false");
  });

  test("확장/접힘 컨테이너에 flex-grow 전환(애니메이션)이 걸려 있다", async ({ page }) => {
    await page.addInitScript(seedBulletsByCount, { task: 5, someday: 3 });
    await page.goto("/");

    const transition = await page
      .locator('[data-section="task"]')
      .evaluate((el) => getComputedStyle(el).transitionProperty);
    expect(transition).toContain("flex-grow");
  });

  test("투데이 우하단 추가 버튼이 48px로 확대돼 있다", async ({ page }) => {
    await page.addInitScript(seedBulletsByCount, { task: 5, someday: 3 });
    await page.goto("/");

    const box = await page.getByTestId("add-bullet-task").boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(46);
    expect(box!.width).toBeLessThanOrEqual(50);
    expect(box!.height).toBeGreaterThanOrEqual(46);
    expect(box!.height).toBeLessThanOrEqual(50);
  });
});
