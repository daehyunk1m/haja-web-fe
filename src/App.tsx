import { useState } from "react";
import Modal from "./components/Modal";
import { AddModal } from "./components/AddTask";
import Test from "./components/Test";
import Container from "./components/Container";
import Title from "./components/Title";
import Progress from "./components/Progress";
import { useModalStore } from "./shared/modalStores";
import { useAddModalStore } from "./shared/addModalStore";
import TodoSection from "./components/TodoSection";
import { enableMapSet } from "immer";

// immer Map/Set 불면 처리 활성화
enableMapSet();

function App() {
  // 콜백 없이 스토어 훅을 호출하면 개별 상태나 액션이 아닌 스토어 객체를 얻을 수 있지만, 사용하지 않는 상태가 변경되도 컴포너트가 리렌더링 되기에 권장되지 않음.
  // const { count, inc } = useNameStore();

  // 권장
  // const count = useNameStore((state) => state.count);
  const isModalOpen = useModalStore((state) => state.isModalOpen);
  const isAddModalOpen = useAddModalStore((state) => state.isAddModalOpen);

  const [bulletState, setBulletState] = useState<string>("");

  return (
    <>
      <Container>
        <Test state={bulletState} />
        <div style={{ display: "flex", marginBottom: "2v0px" }}>
          <div style={{ flexDirection: "column", width: "100%" }}>
            <Title />
            <Progress />
          </div>
        </div>
        <div className='container' style={{ display: "flex", flexDirection: "column", flex: 1, gap: 20 }}>
          <TodoSection isAddTaskIcon tabPosition='right' />
          <TodoSection isAddTaskIcon tabPosition='left' />
        </div>
        {isModalOpen && <Modal setBulletState={setBulletState} />}
      </Container>
      {isAddModalOpen && <AddModal />}
    </>
  );
}

export default App;
