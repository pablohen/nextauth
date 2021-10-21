import React, { ReactNode } from 'react';
import useCan from '../hooks/useCan';

interface Props {
  children: ReactNode;
  permissions?: string[];
  roles?: string[];
}

const Can = ({ children, permissions, roles }: Props) => {
  const userCanSeeComponent = useCan({ permissions, roles });

  if (!userCanSeeComponent) {
    return null;
  }

  return <>{children}</>;
};

export default Can;
