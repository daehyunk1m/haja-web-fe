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

  test("섬데이 추가 버튼이 확장과 함께 부드럽게 나타난다 (즉시 깜빡이지 않음)", async ({ page }) => {
    // task 5 > someday 3 → 진입 시 TODAY 확장, SOMEDAY 접힘
    await page.addInitScript(seedBulletsByCount, { task: 5, someday: 3 });
    await page.goto("/");

    const addBtn = page.getByTestId("add-bullet-someday");
    const region = page.getByTestId("add-bullet-someday-region");

    // 접힘 상태: 버튼은 DOM에 남아 있으나(언마운트 아님) 높이 0으로 보이지 않는다
    await expect(addBtn).toBeAttached();
    const collapsedHeight = (await region.boundingBox())?.height ?? -1;
    expect(collapsedHeight).toBeLessThan(4);

    // 즉시 mount가 아니라 전환 애니메이션이 걸려 있어야 한다
    const transition = await region.evaluate((el) => getComputedStyle(el).transitionProperty);
    expect(transition).not.toBe("none");

    // SOMEDAY 확장 → 버튼이 높이를 갖고 보이게 된다
    await page.getByRole("button", { name: /SOMEDAY/ }).click();
    await expect(addBtn).toBeVisible();
    await expect.poll(async () => (await region.boundingBox())?.height ?? 0).toBeGreaterThan(40);

    // 열림은 컨테이너(0.3s)보다 늦게 출발하도록 delay가 걸려 있다(0.1+0.2=0.3s에 함께 끝남)
    const timing = await region.evaluate((el) => {
      const s = getComputedStyle(el);
      return { delay: s.transitionDelay, duration: s.transitionDuration };
    });
    expect(timing.delay).toBe("0.1s");
    expect(timing.duration).toBe("0.2s");
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
