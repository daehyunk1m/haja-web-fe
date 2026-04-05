import { useEffect } from "react";
import Container from "./components/Container";
import { useAddModalStore } from "./shared/addModalStore";
import { enableMapSet } from "immer";
import { useDateStore } from "./shared/dateStore";
import Header from "./components/Header";
import Body from "./components/Body";
import { AddModal } from "./components/modal/AddModal";
import { supabase } from "./lib/supabase";
import { useAuth } from "./hooks/useAuth";
import { get } from "lodash-es";

// immer Map/Set 불면 처리 활성화
enableMapSet();

function App() {
  const isAddModalOpen = useAddModalStore((state) => state.isAddModalOpen);
  const { setDate } = useDateStore((state) => state.actions);

  useEffect(() => {
    setDate(new Date());
    supabase.auth.getUser().then(({ data, error }) => {
      // console.log(data, error);
    });
  }, []);

  // 첫 렌더 시 스토리지에 있는 데이터와 동기화
  useEffect(() => {
    //   const auth = true;
    //   if (!auth) {
    //   }
  }, []);

  const { user } = useAuth();
  return (
    <>
      <Container>
        <div>안녕하세요{user?.email}님</div>
        <img src={user?.user_metadata?.avatar_url} alt='' />
        <Header />
        <Body />
      </Container>
      {isAddModalOpen && <AddModal />}
    </>
  );
}

export default App;

// 콜백 없이 스토어 훅을 호출하면 개별 상태나 액션이 아닌 스토어 객체를 얻을 수 있지만, 사용하지 않는 상태가 변경되도 컴포너트가 리렌더링 되기에 권장되지 않음.
// const { count, inc } = useNameStore();

// 권장
// const count = useNameStore((state) => state.count);

const getLatestYear = (type: "leap" | "common" = "common") => {
  let year = new Date().getFullYear();
  const isLeapYear = (year: number) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  if (type === "leap") {
    while (!isLeapYear(year)) year--;
  } else {
    while (isLeapYear(year)) year--;
  }
  return year;
};

getLatestYear("leap");
