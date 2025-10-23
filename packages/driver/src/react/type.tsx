import type { JSX } from 'react';

export type ReactComponentDriver = ({
  children,
}: {
  children: React.ReactNode;
}) => JSX.Element;
