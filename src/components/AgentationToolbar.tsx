'use client';

import React, { useEffect, useState } from 'react';
import { Agentation } from 'agentation';

export function AgentationToolbar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <Agentation />;
}
