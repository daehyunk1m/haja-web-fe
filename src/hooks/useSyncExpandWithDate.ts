import { useEffect } from "react";
import { useDateStore } from "@/shared/dateStore";
import { useSectionExpandStore } from "@/shared/sectionExpandStore";

/**
 * 선택 날짜(일 단위)가 바뀌면 섹션 확장 자동판단을 다시 수행하도록 확정을 해제한다.
 *
 * dateStore의 subscribeWithSelector로 일 문자열(toBulletString)만 구독하므로
 * 같은 날 안에서의 시각 변경에는 반응하지 않는다. 마운트 시점에는 호출되지 않고
 * 실제 변경에만 fire되므로, 진입 시 1회 자동 확장(reportCount)과 충돌하지 않는다.
 */
export const useSyncExpandWithDate = () => {
  useEffect(() => {
    return useDateStore.subscribe(
      (s) => s.toBulletString(),
      () => useSectionExpandStore.getState().actions.reevaluate()
    );
  }, []);
};
