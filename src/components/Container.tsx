import { PropsWithChildren } from "react";

export default function Container({ children }: PropsWithChildren) {
  return (
    <div
      style={{
        backgroundColor: "rgba(0,0,0,0.1)",
        // opacity: 0.2,
        width: "100vw",
        height: "100vh",
        padding: "35px 25px",
        // margin: "35px 25px"
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", backgroundColor: "white", height: "100%" }}>{children}</div>
    </div>
  );
}
