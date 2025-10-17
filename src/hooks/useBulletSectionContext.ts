import { createContext, useContext } from "react";
import { TBulletSection } from "./useBulletSection";

export const BulletSectionContext = createContext<TBulletSection | null>(null);

export const useBulletSectionContext = () => {
  const context = useContext(BulletSectionContext);
  if (!context) throw new Error("Cannot find BulletSectionContext");
  return context;
};
