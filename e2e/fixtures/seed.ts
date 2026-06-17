// 하네스 생성 — 시드 헬퍼 (custom: 앱에 맞게 구현).
//
// 이 함수들은 page.addInitScript로 브라우저 컨텍스트에 주입되어 앱 부팅 전에 실행된다.
// 따라서 클로저(모듈 스코프 변수)를 참조하면 안 되고, 브라우저 전역만 사용해야 한다.
// 가장 견고한 시드 방법은 앱의 영속 저장소(localStorage)에 직접 봉투를 주입하는 것이다.
// 직렬화 형태(DTO 배열 + version)와 키 이름은 bulletStore의 persist 설정과 정확히 일치해야 한다.

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- 스텁 파라미터: 범용 시드 구현 시 사용
export function seed(_payload: unknown): void {
  // (범용) 필요 시 위 예시를 참고해 구현. 현재는 seedBulletsByCount를 사용한다.
}

export type SeedCounts = { task: number; someday: number };

/**
 * 오늘 날짜의 task/someday 태스크를 지정 개수만큼 localStorage(localBullets)에 시드한다.
 * page.addInitScript(seedBulletsByCount, counts)로 주입한다.
 */
export function seedBulletsByCount(counts: SeedCounts): void {
  const pad = (n: number) => String(n).padStart(2, "0");
  const d = new Date();
  const today = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const mk = (i: number, type: "task" | "someday") => ({
    id: `seed-${type}-${i}`,
    type,
    title: `${type} ${i}`,
    createdAt: today,
    events: [{ date: today, state: "todo" }],
  });
  const tasks: ReturnType<typeof mk>[] = [];
  for (let i = 0; i < counts.task; i++) tasks.push(mk(i, "task"));
  for (let i = 0; i < counts.someday; i++) tasks.push(mk(i, "someday"));
  window.localStorage.setItem(
    "localBullets",
    JSON.stringify({ state: { tasks, taskOrder: {} }, version: 0 })
  );
}
