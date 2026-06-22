import { useAddModalStore } from "../../shared/addModalStore";

import ModalContainer from "./ModalContainer";
import AddTaskInput from "./AddTaskInput";
import CalendarContainer from "../CalendarContainer";

export function AddModal() {
  const { closeModal } = useAddModalStore((state) => state.actions);

  return (
    <ModalContainer close={closeModal}>
      <div className='w-full flex flex-col'>
        <AddTaskInput />
        <CalendarContainer />
      </div>
    </ModalContainer>
  );
}
