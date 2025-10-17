import { useNavigate } from "react-router";

const Title = () => {
  const navigate = useNavigate();

  const lb = localStorage.getItem("localBullets") ?? "{}";
  const localBullets = JSON.parse(lb);

  return (
    <div className='flex flex-row items-start justify-between w-full'>
      <div className='font-black text-[32px] tracking-[-0.06em] font-dm-sans'>HAJA</div>
      <div
        className='font-light text-[14px] tracking-[0.03em] font-dm-sans'
        onClick={() => console.log(localBullets)}
      >
        {true ? "TO DO LIST" : "24.NOV"}
        <div className='flex justify-end'>
          <button onClick={() => navigate("/login")}>로그인</button>
        </div>
      </div>
    </div>
  );
};

export default Title;
