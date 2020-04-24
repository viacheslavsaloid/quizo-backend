import { UseRoles } from 'nest-access-control';

export const Role = params => {
  const defaultPossessions = {
    create: 'own',
    update: 'own',
    delete: 'own',
    read: 'any '
  };

  const { resource, action, possession = defaultPossessions[params.action] } = params;

  return UseRoles({
    resource,
    action,
    possession
  });
};

export const GetRolesAccessesTo = resource => (action, possession?) => Role({ resource, action, possession });
