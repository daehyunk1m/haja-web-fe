import { PropsWithChildren } from "react";

export default function Ico({ children, size = 24 }: PropsWithChildren<{ size?: number }>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      {children}
    </svg>
  );
}

Ico.Todo = () => {
  return (
    <Ico>
      <path d='M21 21.6667H3V3.66669H21V21.6667ZM4 20.6667H20V4.66669H4V20.6667Z' fill='black' />
    </Ico>
  );
};

Ico.Ongoing = () => {
  return (
    <Ico>
      <path d='M21 3.66669V21.6667H3V3.66669H21ZM12 20.6667H20V4.66669H12V20.6667Z' fill='black' />
    </Ico>
  );
};

Ico.Done = () => {
  return (
    <Ico>
      <path d='M21 21.6667H3V3.66669H21V21.6667Z' fill='black' />
    </Ico>
  );
};

Ico.Delay = () => {
  return (
    <Ico>
      <path
        d='M12 3.66669L21 12.6657V12.6667L12 21.6667H3V3.66669H12ZM4 4.66669V20.6667H11.5859L19.5859 12.6667L11.5859 4.66669H4Z'
        fill='black'
      />
    </Ico>
  );
};

Ico.Cancel = () => {
  return (
    <Ico>
      <path
        d='M21 21.6667H3V3.66669H21V21.6667ZM4.81445 20.6667H20V5.48114L4.81445 20.6667ZM4 20.0671L19.4004 4.66669H4V20.0671Z'
        fill='black'
      />
    </Ico>
  );
};

Ico.Add = ({ fill = "black" }: { fill?: string }) => {
  return (
    <Ico size={40}>
      <path
        d='M33 30.3333L26 37.3333H7V3.33331H33V30.3333ZM8 36.3333H25V29.3333H32V4.33331H8V36.3333ZM26 35.9193L31.5859 30.3333H26V35.9193ZM20.5 17.3333H27V18.3333H20.5V25.3333H19.5V18.3333H13V17.3333H19.5V11.3333H20.5V17.3333Z'
        fill={fill}
      />
    </Ico>
  );
};

Ico.Delete = () => {
  return (
    <Ico>
      <path
        d='M21 7.33331H20V22.3333H4V7.33331H3V6.33331H21V7.33331ZM5 21.3333H19V7.33331H5V21.3333ZM9.5 18.3333H8.5V10.3333H9.5V18.3333ZM12.5 18.3333H11.5V10.3333H12.5V18.3333ZM15.5 18.3333H14.5V10.3333H15.5V18.3333ZM17 3.33331H7V2.33331H17V3.33331Z'
        fill='black'
      />
    </Ico>
  );
};

Ico.Send = () => {
  return (
    <Ico>
      <path
        d='M21 12.3323V12.3333L12 21.3333H3V19.9193L10.5859 12.3333L3 4.74738V3.33331H12L21 12.3323ZM12 12.3323V12.3333L4 20.3333H11.5859L19.5859 12.3333L11.5859 4.33331H4L12 12.3323Z'
        fill='black'
      />
    </Ico>
  );
};

Ico.Arrow = ({ direction }: { direction: "up" | "down" | "left" | "right" }) => {
  const rotate = { down: 0, up: 180, left: 90, right: 270 }[direction];
  return (
    <Ico size={16}>
      <path
        d='M4 6L8 10L12 6'
        stroke='currentColor'
        strokeWidth={1.75}
        strokeLinecap='round'
        strokeLinejoin='round'
        fill='none'
        transform={`rotate(${rotate} 8 8)`}
      />
    </Ico>
  );
};
