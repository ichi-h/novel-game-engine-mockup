import type { JSX } from 'react';

export type DriverComponent = ({
  children,
}: {
  children: React.ReactNode;
}) => JSX.Element;
