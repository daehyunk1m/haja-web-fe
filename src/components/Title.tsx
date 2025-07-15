import React from "react";

const Title = () => {
  const lb = localStorage.getItem("localBullets") ?? "{}";
  const localBullets = JSON.parse(lb);

  return (
    // <div
    //   className='self-stretch inline-flex justify-between items-start'
    //   style={{ display: "flex", flex: 1, justifyContent: "space-between" }}
    // >
    //   <h1 className='text-3xl font-bold'>HAJA</h1>
    //   <h3 className='text-xl font-bold' onClick={() => console.log(localBullets)}>
    //     {true ? "TO DO LIST" : "24.NOV"}
    //   </h3>
    // </div>
    <div className='flex flex-row items-start justify-between w-full'>
      <div className='font-black text-[32px] tracking-[-0.06em] font-dm-sans'>HAJA</div>
      <div
        className='font-light text-[14px] tracking-[0.03em] font-dm-sans'
        onClick={() => console.log(localBullets)}
      >
        {true ? "TO DO LIST" : "24.NOV"}
      </div>
    </div>
  );
};

export default Title;
