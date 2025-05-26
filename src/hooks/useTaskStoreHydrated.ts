import React, { useEffect, useState } from "react";
import { useBulletStore } from "../shared/bulletStore";

export const useTaskStoreHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState(useBulletStore.persist.hasHydrated);

  useEffect(() => {
    if (hasHydrated) return;
  });

  return hasHydrated;
};
