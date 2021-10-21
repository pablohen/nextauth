import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import validateUserPermissions from '../utils/validateUserPermissions';

interface Props {
  permissions?: string[];
  roles?: string[];
}

const useCan = ({ permissions, roles }: Props) => {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return false;
  }

  const userHasValidPermissions = validateUserPermissions({
    user,
    permissions,
    roles,
  });

  return userHasValidPermissions;
};

export default useCan;
