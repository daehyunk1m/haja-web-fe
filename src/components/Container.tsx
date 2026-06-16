import { PropsWithChildren } from "react";

export default function Container({ children }: PropsWithChildren) {
  return (
    <div className='bg-white w-full h-dvh overflow-hidden flex flex-col items-center pt-12 pb-10 px-6'>
      <div className='w-full min-w-[313px] flex-1 min-h-0 flex flex-col items-center gap-1.5'>
        {children}
      </div>
    </div>
  );
}
