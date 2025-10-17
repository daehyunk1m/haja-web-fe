import Progress from "./Progress";
import Title from "./Title";

export default function Header() {
  return (
    <div className='w-full flex flex-col gap-2.5'>
      <Title />
      <Progress />
    </div>
  );
}
