export default function MainPage() {
  return (
    <div className='mx-auto max-w-[480px] w-full px-[1px]'>
      <div className='bg-white relative flex min-h-[844px] px-6 py-[45px] flex-col overflow-hidden'>
        {/* Status Bar */}
        <img
          src='https://cdn.builder.io/api/v1/image/assets/TEMP/e6a94b7fc06cd7948dc74f72477325e23767dd1e?placeholderIfAbsent=true'
          className='aspect-[9.8] object-contain object-center w-[391px] absolute z-0 left-1/2 top-0 -translate-x-1/2 h-10'
          alt='Status bar'
        />

        {/* Header Section */}
        <div className='self-center z-0 w-full max-w-[342px] pb-1.5'>
          <div className="flex w-full items-start gap-x-[100px] gap-y-10 font-['DM_Sans','-apple-system','Roboto','Helvetica','sans-serif'] text-black justify-between">
            <div className='text-[32px] font-black tracking-[-0.96px] leading-none'>HAJA</div>
            <div className='text-sm font-light tracking-[0.42px] leading-none border border-black px-2 py-1'>
              TO DO LIST
            </div>
          </div>

          {/* Progress Pie */}
          <div className='rounded-[30px] flex mt-2.5 min-h-[60px] w-[60px] items-center justify-center'>
            <img
              src='https://cdn.builder.io/api/v1/image/assets/TEMP/466515fdc338abac78b49c306ca72695fb5e05b7?placeholderIfAbsent=true'
              className='aspect-square object-contain object-center w-[60px] rounded-full'
              alt='Progress pie chart'
            />
          </div>
        </div>

        {/* Main Content Container */}
        <div className='z-0 flex w-full px-[2px] pr-[13px] py-0.5 flex-col items-stretch justify-center flex-1'>
          {/* Today Tasks Section */}
          <div className="flex w-full flex-col items-end font-['Pretendard','-apple-system','Roboto','Helvetica','sans-serif'] text-base justify-start flex-1">
            {/* Tab Container */}
            <div className='flex items-center whitespace-nowrap text-center tracking-[-0.48px] justify-start'>
              <div className='self-stretch flex-1 rounded-t-[10px] bg-white border border-black mt-auto mb-auto min-h-[35px] px-2.5 py-[11px] text-black font-semibold w-[125px]'>
                2025.08.29
              </div>
              <div className='self-stretch rounded-t-[10px] bg-black border border-black mt-auto mb-auto min-h-[35px] px-[17px] py-3 gap-2.5 text-white font-bold w-[125px]'>
                TODAY
              </div>
            </div>

            {/* Today Tasks Container */}
            <div className='border border-black self-stretch min-h-5 w-full text-black font-medium flex-1'>
              <div className='bg-white w-full py-2 overflow-hidden flex-1'>
                {/* Task Item 1 - Completed */}
                <div className='bg-gray-200 flex w-full items-center overflow-hidden justify-between'>
                  <div className='bg-white self-stretch flex min-w-[240px] mt-auto mb-auto min-h-[38px] w-full px-5 py-1 items-stretch overflow-hidden justify-start flex-1'>
                    <div className='flex items-center gap-2 justify-start h-full'>
                      <img
                        src='https://cdn.builder.io/api/v1/image/assets/TEMP/77b9d78e080c2d90be54a84e4880245333f398ca?placeholderIfAbsent=true'
                        className='aspect-square object-contain object-center w-6 self-stretch mt-auto mb-auto flex-shrink-0'
                        alt='Task icon'
                      />
                      <div className='text-ellipsis self-stretch min-h-[30px] mt-auto mb-auto overflow-hidden line-clamp-1'>
                        헬스장 가기
                      </div>
                    </div>
                  </div>
                </div>

                {/* Task Item 2 - Completed */}
                <div className='bg-gray-200 flex mt-1 w-full items-center overflow-hidden justify-between'>
                  <div className='bg-white self-stretch flex min-w-[240px] mt-auto mb-auto w-full px-5 py-1 items-stretch overflow-hidden justify-start flex-1'>
                    <div className='flex items-center gap-2 justify-start h-full'>
                      <img
                        src='https://cdn.builder.io/api/v1/image/assets/TEMP/25d1d8cb66b7d7244220a9516c13056b927f3ec2?placeholderIfAbsent=true'
                        className='aspect-square object-contain object-center w-6 self-stretch mt-auto mb-auto flex-shrink-0'
                        alt='Task icon'
                      />
                      <div className='text-ellipsis self-stretch min-h-[30px] mt-auto mb-auto overflow-hidden line-clamp-1'>
                        오전 스크럼 주제 공유
                      </div>
                    </div>
                  </div>
                </div>

                {/* Task Item 3 - Incomplete */}
                <div className='bg-gray-200 flex mt-1 w-full items-center overflow-hidden justify-between'>
                  <div className='bg-gray-200 self-stretch flex min-w-[240px] mt-auto mb-auto min-h-[38px] w-full px-5 py-1 items-stretch overflow-hidden justify-start flex-1'>
                    <div className='flex items-center gap-2 justify-start h-full'>
                      <img
                        src='https://cdn.builder.io/api/v1/image/assets/TEMP/7b234a5a70378aaff7ba979eb0d8dba95571988d?placeholderIfAbsent=true'
                        className='aspect-square object-contain object-center w-6 self-stretch mt-auto mb-auto flex-shrink-0'
                        alt='Task icon'
                      />
                      <div className='text-ellipsis self-stretch min-h-[30px] mt-auto mb-auto overflow-hidden line-clamp-1'>
                        저녁 재료 장보기
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Task Icon */}
            <img
              src='https://cdn.builder.io/api/v1/image/assets/TEMP/3cd2db7fb3d04eb7d1cc8199d46e4af7ff791387?placeholderIfAbsent=true'
              className='aspect-[2] object-contain object-center w-10'
              alt='Add task'
            />
          </div>

          {/* Someday Tasks Section */}
          <div className='w-full flex-1'>
            {/* Someday Tab */}
            <div className="self-stretch rounded-t-[10px] bg-black border border-black min-h-[35px] w-[125px] max-w-full px-4 py-3 gap-2.5 font-['Pretendard','-apple-system','Roboto','Helvetica','sans-serif'] text-base text-white font-bold text-center tracking-[-0.48px]">
              SOMEDAY
            </div>

            {/* Someday Tasks Container */}
            <div className='border border-black w-full flex-1'>
              <div className='bg-white w-full pt-2 overflow-hidden flex-1'>
                {/* Someday Task 1 */}
                <div className="bg-gray-200 flex w-full items-center overflow-hidden font-['Pretendard','-apple-system','Roboto','Helvetica','sans-serif'] text-base text-black font-medium whitespace-nowrap justify-between">
                  <div className='bg-white self-stretch flex min-w-[240px] mt-auto mb-auto min-h-[38px] w-full px-5 py-1 items-stretch overflow-hidden justify-start flex-1'>
                    <div className='flex items-center gap-2 justify-start h-full'>
                      <img
                        src='https://cdn.builder.io/api/v1/image/assets/TEMP/7b234a5a70378aaff7ba979eb0d8dba95571988d?placeholderIfAbsent=true'
                        className='aspect-square object-contain object-center w-6 self-stretch mt-auto mb-auto flex-shrink-0'
                        alt='Task icon'
                      />
                      <div className='text-ellipsis self-stretch min-h-[30px] mt-auto mb-auto overflow-hidden line-clamp-1'>
                        이사준비
                      </div>
                    </div>
                  </div>
                </div>

                {/* Someday Task 2 - With Swipe Action */}
                <div className='bg-gray-200 flex mt-1 w-full items-stretch overflow-hidden justify-between'>
                  <div className="bg-gray-200 flex min-w-[240px] mt-auto mb-auto px-5 py-1 items-stretch overflow-hidden font-['Pretendard','-apple-system','Roboto','Helvetica','sans-serif'] text-base text-black font-medium justify-start flex-1">
                    <div className='flex items-center gap-2 justify-start h-full'>
                      <img
                        src='https://cdn.builder.io/api/v1/image/assets/TEMP/efb846e034762430ef7a49b8c1aed4a6ac565251?placeholderIfAbsent=true'
                        className='aspect-square object-contain object-center w-6 self-stretch mt-auto mb-auto flex-shrink-0'
                        alt='Task icon'
                      />
                      <div className='text-ellipsis self-stretch min-h-[30px] mt-auto mb-auto overflow-hidden line-clamp-1'>
                        영화 예매하기
                      </div>
                    </div>
                  </div>
                  <div className='bg-white flex items-center overflow-hidden justify-center h-full w-[53px]'>
                    <img
                      src='https://cdn.builder.io/api/v1/image/assets/TEMP/6e442daef56d8df3a191ad135bedc604c4bda28e?placeholderIfAbsent=true'
                      className='aspect-square object-contain object-center w-6 self-stretch mt-auto mb-auto'
                      alt='Swipe action'
                    />
                  </div>
                </div>

                {/* Someday Task 3 */}
                <div className="bg-gray-200 flex mt-1 w-full items-center overflow-hidden font-['Pretendard','-apple-system','Roboto','Helvetica','sans-serif'] text-base text-black font-medium justify-between">
                  <div className='bg-white self-stretch flex min-w-[240px] mt-auto mb-auto min-h-[38px] w-full px-5 py-1 items-stretch overflow-hidden justify-start flex-1'>
                    <div className='flex items-center gap-2 justify-start h-full'>
                      <img
                        src='https://cdn.builder.io/api/v1/image/assets/TEMP/8d90472b2bdfbedd3a8e7b0f8566dd58c5996ed2?placeholderIfAbsent=true'
                        className='aspect-square object-contain object-center w-6 self-stretch mt-auto mb-auto flex-shrink-0'
                        alt='Task icon'
                      />
                      <div className='text-ellipsis self-stretch min-h-[30px] mt-auto mb-auto overflow-hidden line-clamp-1'>
                        여행 일정 짜기
                      </div>
                    </div>
                  </div>
                </div>

                {/* Someday Task 4 - No Icon */}
                <div className="bg-gray-200 flex mt-1 w-full items-center overflow-hidden font-['Pretendard','-apple-system','Roboto','Helvetica','sans-serif'] text-base text-black font-medium justify-between">
                  <div className='bg-white self-stretch flex min-w-[240px] mt-auto mb-auto min-h-[38px] w-full px-5 py-0.5 items-stretch overflow-hidden justify-start flex-1'>
                    <div className='flex items-center gap-2 justify-start h-full'>
                      <div className='self-stretch flex mt-auto mb-auto w-6 flex-shrink-0 h-0' />
                      <div className='text-ellipsis self-stretch min-h-[30px] mt-auto mb-auto overflow-hidden line-clamp-1'>
                        위시리스트 정리
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
