import { useEffect } from "react";
import Modal from "./components/Modal";
import { AddModal } from "./components/AddTask";
import Container from "./components/Container";
import Title from "./components/Title";
import Progress from "./components/Progress";
import { useModalStore } from "./shared/modalStores";
import { useAddModalStore } from "./shared/addModalStore";
import TodoSection from "./components/TodoSection";
import { enableMapSet } from "immer";
import { useDateStore } from "./shared/dateStore";

// immer Map/Set 불면 처리 활성화
enableMapSet();

function App() {
  const isModalOpen = useModalStore((state) => state.isModalOpen);
  const isAddModalOpen = useAddModalStore((state) => state.isAddModalOpen);
  const { setDate } = useDateStore((state) => state.actions);

  useEffect(() => {
    setDate(new Date());
  }, []);

  // 첫 렌더 시 스토리지에 있는 데이터와 동기화
  useEffect(() => {
    //   const auth = true;
    //   if (!auth) {
    //   }
  }, []);

  return (
    <>
      <Container>
        <Header />
        <Body />
        {isModalOpen && <Modal />}
      </Container>
      {isAddModalOpen && <AddModal />}
    </>
  );
}

export default App;

function Header() {
  return (
    <div className='w-full flex flex-col gap-2.5'>
      <Title />
      <Progress />
    </div>
  );
}

function Body() {
  return (
    <div className='w-full flex flex-col flex-1 items-center pt-0.5 pr-3.5 pb-0.5 pl-0.5'>
      <TodoSection isAddTaskIcon tabPosition='right' />
      <TodoSection tabPosition='left' />
    </div>
  );
}

// 콜백 없이 스토어 훅을 호출하면 개별 상태나 액션이 아닌 스토어 객체를 얻을 수 있지만, 사용하지 않는 상태가 변경되도 컴포너트가 리렌더링 되기에 권장되지 않음.
// const { count, inc } = useNameStore();

// 권장
// const count = useNameStore((state) => state.count);
