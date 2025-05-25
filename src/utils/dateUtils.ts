export const makeDateString = (date: Date | string | number = new Date(), join?: "-" | "." | "/", forEvent?: boolean) => {
  const d = date instanceof Date ? date : new Date(date);

  // 유효성 검사
  if (isNaN(d.getTime())) {
    console.error(`Invalid date input: ${date}`);
    throw new Error("check Date type");
  }
  const year = d.getFullYear();
  let month: number | string = d.getMonth() + 1;
  let day: number | string = d.getDate();

  if (forEvent) {
    month = String(month).padStart(2, "0");
    day = String(day).padStart(2, "0");
  }

  //yyyy.mm.dd
  return join ? [year, month, day].join(join) : `${year}. ${month}. ${day}`;
};

export const recordDate = (date: Date | string | number = new Date()) => makeDateString(date, "-", true);
