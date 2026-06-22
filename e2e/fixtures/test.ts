import { test as base, expect } from '@playwright/test';
import { seed, seedBulletsByCount } from './seed';

// 하네스 생성 — per-test base fixture (custom: 1회 생성, 자유 수정).
// Playwright의 test를 확장한다. 각 테스트는 fresh context로 시작한다(Playwright 기본).
// 시드가 필요한 스펙은 page.addInitScript(seedBulletsByCount, counts)를 직접 호출한다.
export const test = base.extend({
  // page: async ({ page }, use) => {
  //   await page.addInitScript(seed, /* 시드 데이터 */);
  //   await use(page);
  // },
});

export { expect, seed, seedBulletsByCount };
