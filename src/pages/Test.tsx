import React from "react";

const Test = () => {
  return (
    <div className='w-96 h-[844px] px-6 pt-12 pb-10 relative bg-white inline-flex flex-col justify-start items-center overflow-hidden'>
      <div className='w-80 pb-1.5 flex flex-col justify-start items-start gap-2.5'>
        <div className='self-stretch inline-flex justify-between items-start'>
          <div className="justify-center text-black text-3xl font-black font-['DM_Sans']">HAJA</div>
          <div className="justify-center text-black text-sm font-light font-['DM_Sans'] tracking-wide">
            TO DO LIST
          </div>
        </div>
        <div
          data-tracker='achivement'
          className='w-14 h-14 p-0.5 rounded-[30px] inline-flex justify-center items-center'
        >
          <div className='w-14 h-14 bg-black rounded-full border-1 border-black' />
        </div>
      </div>
      <div className='self-stretch flex-1 pl-0.5 pr-3 py-0.5 flex flex-col justify-center items-center'>
        <div className='self-stretch flex-1 flex flex-col justify-start items-end'>
          <div className='inline-flex justify-start items-center'>
            <div
              data-state='Date'
              className='w-32 h-9 px-2.5 py-2.5 bg-white rounded-tl-[10px] rounded-tr-[10px] outline outline-1 outline-black flex justify-center items-center'
            >
              <div className="flex-1 h-3 text-center justify-center text-black text-base font-semibold font-['Pretendard']">
                2025.08.29
              </div>
            </div>
            <div
              data-state='Today'
              className='w-32 h-9 px-4 py-2.5 bg-black rounded-tl-[10px] rounded-tr-[10px] outline outline-1 outline-black flex justify-center items-center gap-2.5'
            >
              <div className="text-center justify-center text-white text-base font-bold font-['Pretendard']">
                TODAY
              </div>
            </div>
          </div>
          <div className='self-stretch flex-1 min-h-5 outline outline-1 outline-black flex flex-col justify-start items-start'>
            <div className='self-stretch flex-1 py-2 bg-white border-black flex flex-col justify-start items-end gap-1 overflow-hidden'>
              <div
                data-state='default'
                className='self-stretch bg-zinc-100 inline-flex justify-between items-center overflow-hidden'
              >
                <div className='flex-1 h-9 px-5 py-1 bg-white flex justify-start items-center overflow-hidden'>
                  <div className='self-stretch flex justify-start items-center gap-2'>
                    <div data-state='Todo' className='w-6 h-6 relative overflow-hidden' />
                    <div className="min-h-7 justify-center text-black text-base font-medium font-['Pretendard']">
                      헬스장 가기
                    </div>
                  </div>
                </div>
              </div>
              <div
                data-state='default'
                className='self-stretch bg-zinc-100 inline-flex justify-between items-center overflow-hidden'
              >
                <div className='flex-1 px-5 py-1 bg-white flex justify-start items-center overflow-hidden'>
                  <div className='self-stretch flex justify-start items-center gap-2'>
                    <div data-state='Done' className='w-6 h-6 relative overflow-hidden' />
                    <div className="min-h-7 justify-center text-black text-base font-medium font-['Pretendard']">
                      오전 스크럼 주제 공유
                    </div>
                  </div>
                </div>
              </div>
              <div
                data-state='hover'
                className='self-stretch bg-zinc-100 inline-flex justify-between items-center overflow-hidden'
              >
                <div className='flex-1 h-9 px-5 py-1 bg-zinc-100 flex justify-start items-center overflow-hidden'>
                  <div className='self-stretch flex justify-start items-center gap-2'>
                    <div data-state='Delay' className='w-6 h-6 relative overflow-hidden' />
                    <div className="min-h-7 justify-center text-black text-base font-medium font-['Pretendard']">
                      저녁 재료 장보기
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='w-10 h-5 relative'>
            <div
              data-feature='Add'
              data-size='40dp'
              className='w-10 h-10 left-[20px] top-[-20px] absolute bg-white'
            />
          </div>
        </div>
        <div className='self-stretch flex-1 max-h-44 flex flex-col justify-start items-start'>
          <div
            data-state='Someday/fold'
            className='w-32 h-9 px-4 py-2.5 bg-black rounded-tl-[10px] rounded-tr-[10px] outline outline-1 outline-black inline-flex justify-center items-center gap-2.5'
          >
            <div className="text-center justify-center text-white text-base font-bold font-['Pretendard']">
              SOMEDAY 
            </div>
          </div>
          <div className='self-stretch flex-1 outline outline-1 outline-black flex flex-col justify-start items-start'>
            <div className='self-stretch flex-1 pt-2 bg-white flex flex-col justify-start items-start gap-1 overflow-hidden'>
              <div
                data-state='default'
                className='self-stretch bg-zinc-100 inline-flex justify-between items-center overflow-hidden'
              >
                <div className='flex-1 h-9 px-5 py-1 bg-white flex justify-start items-center overflow-hidden'>
                  <div className='self-stretch flex justify-start items-center gap-2'>
                    <div data-state='Delay' className='w-6 h-6 relative overflow-hidden' />
                    <div className="min-h-7 justify-center text-black text-base font-medium font-['Pretendard']">
                      이사준비
                    </div>
                  </div>
                </div>
              </div>
              <div
                data-state='swipe'
                className='self-stretch bg-zinc-100 inline-flex justify-between items-center overflow-hidden'
              >
                <div className='flex-1 px-5 py-1 bg-zinc-100 flex justify-start items-center overflow-hidden'>
                  <div className='self-stretch flex justify-start items-center gap-2'>
                    <div data-state='Cancel' className='w-6 h-6 relative overflow-hidden' />
                    <div className="min-h-7 justify-center text-black text-base font-medium font-['Pretendard']">
                      영화 예매하기
                    </div>
                  </div>
                </div>
                <div className='w-14 self-stretch bg-white flex justify-center items-center overflow-hidden'>
                  <div data-feature='Delete' data-size='24dp' className='w-6 h-6 relative' />
                </div>
              </div>
              <div
                data-state='default'
                className='self-stretch bg-zinc-100 inline-flex justify-between items-center overflow-hidden'
              >
                <div className='flex-1 h-9 px-5 py-1 bg-white flex justify-start items-center overflow-hidden'>
                  <div className='self-stretch flex justify-start items-center gap-2'>
                    <div data-state='Ongoing' className='w-6 h-6 relative overflow-hidden' />
                    <div className="min-h-7 justify-center text-black text-base font-medium font-['Pretendard']">
                      여행 일정 짜기
                    </div>
                  </div>
                </div>
              </div>
              <div
                data-state='default'
                className='self-stretch bg-zinc-100 inline-flex justify-between items-center overflow-hidden'
              >
                <div className='flex-1 h-9 px-5 py-1 bg-white flex justify-start items-center overflow-hidden'>
                  <div className='self-stretch flex justify-start items-center gap-2'>
                    <div data-state='Todo' className='w-6 h-6 relative overflow-hidden' />
                    <div className="min-h-7 justify-center text-black text-base font-medium font-['Pretendard']">
                      위시리스트 정리
                    </div>
                  </div>
                </div>
              </div>
              <div
                data-state='default'
                className='self-stretch bg-zinc-100 inline-flex justify-between items-center overflow-hidden'
              >
                <div className='flex-1 h-9 px-5 py-1 bg-white flex justify-start items-center overflow-hidden'>
                  <div className='self-stretch flex justify-start items-center gap-2'>
                    <div data-state='Todo' className='w-6 h-6 relative overflow-hidden' />
                    <div className="min-h-7 justify-center text-black text-base font-medium font-['Pretendard']">
                      인생네컷 찍기
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <img className='w-96 h-10 left-[-1px] top-0 absolute' src='https://placehold.co/391x40' />
    </div>
  );
};

export default Test;
