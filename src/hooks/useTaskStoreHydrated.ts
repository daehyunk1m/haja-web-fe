import { useEffect, useState } from "react";
import { useBulletStore } from "../shared/bulletStore";

export const useTaskStoreHydrated = () => {
  const [hasHydrated] = useState(useBulletStore.persist.hasHydrated);

  useEffect(() => {
    if (hasHydrated) return;
  });

  return hasHydrated;
};
