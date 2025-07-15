// 피그마 디자인 기반 TailwindCSS + React 컴포넌트 (동작/로직 제외)
// 이미지 경로는 실제 프로젝트에 맞게 교체 필요

// 예시: import bulletIcon from '../assets/bullet.svg';

export default function FigmaTest() {
  return (
    <div className='bg-white w-full h-full min-h-screen flex flex-col items-center'>
      {/* Header Section */}
      <div className='w-full flex flex-col items-center pt-12 pb-10 px-6'>
        <div className='w-full flex flex-col gap-2.5 pb-1.5'>
          <div className='flex flex-row items-start justify-between w-full'>
            <div className='font-black text-[32px] tracking-[-0.06em] font-dm-sans'>HAJA</div>
            <div className='font-light text-[14px] tracking-[0.03em] font-dm-sans'>TO DO LIST</div>
          </div>
          {/* Progress Pie (예시: 원형 프로그레스바) */}
          <div className='flex items-center justify-center rounded-[30px] w-[60px] h-[60px] p-[2px]'>
            {/* <img src={imgEllipse2} alt="progress" className="w-full h-full" /> */}
            <div className='bg-gray-200 w-full h-full rounded-full' />
          </div>
        </div>
      </div>
      {/* Contents Container */}
      <div className='w-full flex-1 flex flex-col items-center'>
        <div className='w-full flex flex-col items-center'>
          {/* Tabs */}
          <div className='flex flex-row items-center'>
            <button className='relative bg-white h-[35px] w-[125px] flex items-center justify-center rounded-tl-[10px] rounded-tr-[10px] border border-black'>
              <span className='font-semibold text-[16px] text-black tracking-[-0.03em]'>
                2025.08.29
              </span>
            </button>
            <div className='relative bg-black h-[35px] w-[125px] flex items-center justify-center rounded-tl-[10px] rounded-tr-[10px] border border-black'>
              <span className='font-bold text-[16px] text-white tracking-[-0.03em]'>TODAY</span>
            </div>
          </div>
          {/* Task List (오늘) */}
          <div className='w-full border border-black bg-white flex flex-col gap-1 py-2 px-0 mt-2 rounded-b-lg overflow-hidden'>
            {/* Task Item 1 */}
            <div className='bg-[#f0f0f0] flex flex-row items-center w-full'>
              <div className='bg-white h-[38px] flex flex-row items-center px-5 py-1 gap-2 w-full'>
                {/* <img src={img} alt="bullet" className="w-6 h-6" /> */}
                <div className='w-6 h-6 bg-gray-300 rounded-full' />
                <span className='font-medium text-[16px] text-black whitespace-nowrap'>
                  헬스장 가기
                </span>
              </div>
            </div>
            {/* Task Item 2 */}
            <div className='bg-[#f0f0f0] flex flex-row items-center w-full'>
              <div className='bg-white h-[38px] flex flex-row items-center px-5 py-1 gap-2 w-full'>
                {/* <img src={img1} alt="bullet" className="w-6 h-6" /> */}
                <div className='w-6 h-6 bg-gray-300 rounded-full' />
                <span className='font-medium text-[16px] text-black whitespace-nowrap'>
                  오전 스크럼 주제 공유
                </span>
              </div>
            </div>
            {/* Task Item 3 */}
            <div className='bg-[#f0f0f0] flex flex-row items-center w-full'>
              <div className='bg-[#f0f0f0] h-[38px] flex flex-row items-center px-5 py-1 gap-2 w-full'>
                {/* <img src={img2} alt="bullet" className="w-6 h-6" /> */}
                <div className='w-6 h-6 bg-gray-300 rounded-full' />
                <span className='font-medium text-[16px] text-black whitespace-nowrap'>
                  저녁 재료 장보기
                </span>
              </div>
            </div>
            {/* Add Button */}
            <div className='relative h-5 w-10 mt-2'>
              <button className='absolute left-5 -top-5 bg-white w-10 h-10 rounded-full flex items-center justify-center shadow'>
                {/* <img src={img3} alt="add" className="w-6 h-6" /> */}
                <div className='w-6 h-6 bg-gray-400 rounded-full' />
              </button>
            </div>
          </div>
          {/* Someday Tab & Task List */}
          <div className='w-full mt-4'>
            <div className='bg-black h-[35px] w-[125px] flex items-center justify-center rounded-tl-[10px] rounded-tr-[10px] border border-black'>
              <span className='font-bold text-[16px] text-white tracking-[-0.03em]'>SOMEDAY</span>
            </div>
            <div className='w-full border border-black bg-white flex flex-col gap-1 py-2 px-0 rounded-b-lg overflow-hidden'>
              {/* Task Item 예시 (반복) */}
              <div className='bg-[#f0f0f0] flex flex-row items-center w-full'>
                <div className='bg-white h-[38px] flex flex-row items-center px-5 py-1 gap-2 w-full'>
                  {/* <img src={img2} alt="bullet" className="w-6 h-6" /> */}
                  <div className='w-6 h-6 bg-gray-300 rounded-full' />
                  <span className='font-medium text-[16px] text-black whitespace-nowrap'>
                    이사준비
                  </span>
                </div>
              </div>
              <div className='bg-[#f0f0f0] flex flex-row items-center w-full'>
                <div className='bg-[#f0f0f0] h-[38px] flex flex-row items-center px-5 py-1 gap-2 w-full'>
                  {/* <img src={img4} alt="bullet" className="w-6 h-6" /> */}
                  <div className='w-6 h-6 bg-gray-300 rounded-full' />
                  <span className='font-medium text-[16px] text-black whitespace-nowrap'>
                    영화 예매하기
                  </span>
                  {/* <img src={img5} alt="feature" className="w-6 h-6 ml-2" /> */}
                  <div className='w-6 h-6 bg-gray-400 rounded-full ml-2' />
                </div>
              </div>
              <div className='bg-[#f0f0f0] flex flex-row items-center w-full'>
                <div className='bg-white h-[38px] flex flex-row items-center px-5 py-1 gap-2 w-full'>
                  {/* <img src={img6} alt="bullet" className="w-6 h-6" /> */}
                  <div className='w-6 h-6 bg-gray-300 rounded-full' />
                  <span className='font-medium text-[16px] text-black whitespace-nowrap'>
                    여행 일정 짜기
                  </span>
                </div>
              </div>
              <div className='bg-[#f0f0f0] flex flex-row items-center w-full'>
                <div className='bg-white h-[38px] flex flex-row items-center px-5 py-1 gap-2 w-full'>
                  {/* <img src={img} alt="bullet" className="w-6 h-6" /> */}
                  <div className='w-6 h-6 bg-gray-300 rounded-full' />
                  <span className='font-medium text-[16px] text-black whitespace-nowrap'>
                    위시리스트 정리
                  </span>
                </div>
              </div>
              <div className='bg-[#f0f0f0] flex flex-row items-center w-full'>
                <div className='bg-white h-[38px] flex flex-row items-center px-5 py-1 gap-2 w-full'>
                  {/* <img src={img} alt="bullet" className="w-6 h-6" /> */}
                  <div className='w-6 h-6 bg-gray-300 rounded-full' />
                  <span className='font-medium text-[16px] text-black whitespace-nowrap'>
                    인생네컷 찍기
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
