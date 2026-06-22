import { test, expect, seedBulletsByCount } from "../fixtures/test";

// @feature:F014 — TODAY 탭으로 오늘 날짜 이동 + 날짜 변경 시 섹션 확장 재판단.
// jsdom으로는 캘린더 날짜 선택→확장 재판단의 실제 흐름을 검증하기 어려우므로 실 브라우저로 검증한다.
test.describe("@feature:F014 TODAY 날짜 이동 + 확장 재판단", () => {
  test("TODAY 탭은 오늘로 이동하고, 날짜가 바뀌면 확장을 다시 판단한다", async ({ page }) => {
    // task 5 > someday 3 → 진입 시 TODAY(task) 확장
    await page.addInitScript(seedBulletsByCount, { task: 5, someday: 3 });
    await page.goto("/");

    const taskSection = page.locator('[data-section="task"]');
    const somedaySection = page.locator('[data-section="someday"]');
    const dateTab = page.getByRole("button", { name: /^\d{4}-\d{2}-\d{2}$/ });

    await expect(taskSection).toHaveAttribute("data-expanded", "true");
    const todayLabel = (await dateTab.textContent())!.trim();

    // 캘린더 열기 → 지난달 15일 선택 (과거: 그날은 task 0, someday 3)
    await dateTab.click();
    await page.getByRole("button", { name: "Go to the Previous Month" }).click();
    await page.getByRole("button", { name: /15일/ }).click();
    await page.keyboard.press("Escape"); // 캘린더 닫기

    // 날짜가 과거로 바뀌면 재판단 → SOMEDAY 확장
    await expect(somedaySection).toHaveAttribute("data-expanded", "true");
    await expect(taskSection).toHaveAttribute("data-expanded", "false");
    await expect(page.getByRole("button", { name: todayLabel })).toHaveCount(0); // 더 이상 오늘 아님

    // TODAY 클릭 → 오늘로 복귀 + 재판단으로 다시 TODAY(task) 확장
    await page.getByRole("button", { name: /^TODAY$/ }).click();
    await expect(page.getByRole("button", { name: todayLabel })).toBeVisible();
    await expect(taskSection).toHaveAttribute("data-expanded", "true");
    await expect(somedaySection).toHaveAttribute("data-expanded", "false");
  });
});
