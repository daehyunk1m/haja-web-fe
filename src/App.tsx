import { useEffect } from "react";
import Container from "./components/Container";
import { useAddModalStore } from "./shared/addModalStore";
import { enableMapSet } from "immer";
import { useDateStore } from "./shared/dateStore";
import Header from "./components/Header";
import Body from "./components/Body";
import { AddModal } from "./components/modal/AddModal";
import { useAuthContext } from "./contexts/AuthContext";
// immer Map/Set 불변 처리 활성화
enableMapSet();

function App() {
  const isAddModalOpen = useAddModalStore((state) => state.isAddModalOpen);
  const { setDate } = useDateStore((state) => state.actions);
  const { user } = useAuthContext();

  useEffect(() => {
    setDate(new Date());
  }, []);

  return (
    <>
      <Container>
        {/* <div>안녕하세요{user?.email}님</div> */}
        <img src={user?.user_metadata?.avatar_url} alt='' />
        <Header />
        <Body />
      </Container>
      {isAddModalOpen && <AddModal />}
    </>
  );
}

export default App;
