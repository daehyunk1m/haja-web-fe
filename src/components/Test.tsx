import { useEffect } from "react";
import { useTestStore } from "../shared/storesZustand";

export default function Test({ state }: { state: string }) {
  // 단일컴포넌트에서 구독 시 예제
  useEffect(() => {
    // 마운트 될 때 구독 시작
    const unsubscribe = useTestStore.subscribe(
      (state) => state.count,
      (count) => {
        // ...
      }
    );
    return () => {
      // 언마운트 시 리턴하여 구독 해제
      unsubscribe();
    };
  }, []);
  return (
    <div>
      {/* <h1 className='text-3xl font-bold underline'>hello world</h1> */}

      <h2 className='text-xl font-bold underline'>{state}</h2>
    </div>
  );
}
