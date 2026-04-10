/** 태스크 순서 키 생성: "YYYY-MM-DD|task" */
export const buildOrderKey = (dateString: string, type: "task" | "someday"): string =>
  `${dateString}|${type}`;
