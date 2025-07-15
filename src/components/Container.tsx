import { PropsWithChildren } from "react";

export default function Container({ children }: PropsWithChildren) {
  return (
    <div className='bg-white w-full h-full min-h-screen flex flex-col items-center'>
      <div className='w-full flex-1 flex flex-col items-center pt-12 pb-10 px-6 gap-1.5'>
        {children}
      </div>
    </div>
  );
}
