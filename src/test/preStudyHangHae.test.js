"use strict";
/**
 * @see - https://teamsparta.notion.site/API-24e2dc3ef51481aeb722dc3f18c6cddc
 */
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
// 테스트할 함수를 받고 테스트를 수행하는 단위 (@it)
(0, vitest_1.test)("root 4는 2이다.", function () {
    (0, vitest_1.expect)(Math.sqrt(4)).toBe(2);
});
// 특정 테스트가 실행되는것을 스킵할 수 있음.
vitest_1.it.skip("테스트 스킵", function () {
    (0, vitest_1.assert)(false);
});
// 특정 테스트만 실행할 수 있음 일시적으로 필요할 때 종종 사용
vitest_1.it.only("테스트 오직 이것만 실행", function () {
    (0, vitest_1.assert)(true);
});
var isDev = import.meta.env.DEV;
console.log(isDev);
