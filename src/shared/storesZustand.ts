import { create } from "zustand";
import { combine, devtools, subscribeWithSelector, persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// 미들웨어 사용 가능 (타입 추론, 중첩 객체 변경 등)
// import {미들웨어} from '미들웨어'
// create(미들웨어(콜백))

// type Store = {
//   count: number;
//   inc: () => void;
// };

interface Actions {
  inc: () => void;
  resetState: (keys?: Array<keyof State>) => void;
}

type State = typeof initialState;

const initialState = {
  count: 1,
  double: 2,
  min: 0,
  max: 99,
  test: "test",
};

// create 함수로 스토어를 생성.
// (get, set) => any

/**
 * zustand 공부를 위한 임시 스토어
 */
export const useNameStore = create<State & Actions>()(
  // export const useNameStore = create<Store>()(
  (
    set
    // , get
  ) => {
    return {
      ...initialState,
      inc: () => {
        // get을 호출하면 상태와 액션을 가진 스토어 객체를 얻을 수 있음.
        // const state = get();
        // console.log(JSON.stringify(state));
        set((state) => {
          return { count: state.count + 1 };
        });
      },
      resetState: (keys?: Array<keyof State>) => {
        if (!keys) set(initialState);
        else
          keys.forEach((key) => {
            set({ [key]: initialState[key] });
          });
      },
      // 액션 분리
      // actions: {
      //   increase: () => set((state) => ({ count: state.count + 1 })),
      //   decrease: () => set((state) => ({ count: state.count - 1 })),
      // },
    };
  }
);

export const useTestStore = create(
  devtools(
    // persist(
    subscribeWithSelector(
      immer(
        combine(initialState, (set, get) => {
          const increase = () => {
            set((state) => ({ count: state.count + 1 }));
            increaseDouble();
            // 액션 내에서 액션을 불러올 땐 함수추론이 불가하여 타입 에러 발생,
            // 이 경우엔 함수 호이스팅을 이용하여 해결
            // get.actions.increaseDouble()
          };
          const increaseDouble = () => {
            set((state) => ({ double: state.count * 2 }));
          };
          return {
            actions: { increase, increaseDouble },
          };
        })
      )
    )
    // ,
    // {
    //   name: "countStore",
    //   // storage: createJSONStorage(() => sessionStorage), // 기본값: localStorage
    // }
    // )
  )
);

// double getter
useTestStore.subscribe(
  (state) => state.count, // Selector
  (count) => {
    // Listener
    // console.log(useTestStore.getState().double); // getter
    // useTestStore.setState(() => ({ double: "s" })); // => 이거 타입 체킹 왜 안될까

    useTestStore.setState(() => {
      return { double: count * 2 };
    });
    console.log(count, useTestStore.getState().double);
  }
);

//

// const { increase, decrease } = useCountStore(state => state.actions)

// 커스텀 미들웨도 추가할 수 있음.
// const logger = (config) => (set, get, api) =>
//   config(
//     (args) => {
//       console.log("prev state:", get());
//       console.log("  applying:", args);
//       set(args);
//       console.log("next state:", get());
//     },
//     get,
//     api
//   );

// // 적용
// export const useStore = create(logger(devtools(/* ... */)));

// •	React 컴포넌트 리렌더링 빈도를 조절하고 싶을 때
// •	간단한 lodash throttle/debounce를 액션 함수 내부에 감싸서 사용하거나, 미들웨어 형태로도 구현 가능
