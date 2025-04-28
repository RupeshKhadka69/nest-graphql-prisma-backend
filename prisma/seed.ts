// prisma/seed.ts
import { PrismaClient, RoleTypes, Operation } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create roles
  const superAdminRole = await createRole('Super Admin', RoleTypes.SUPER_ADMIN);
  const adminRole = await createRole('Admin', RoleTypes.ADMIN);
  const editorRole = await createRole('Editor', RoleTypes.EDITOR);
  const authorRole = await createRole('Author', RoleTypes.AUTHOR);
  const readerRole = await createRole('Reader', RoleTypes.READER);

  // Create permissions for each role
  await createPermissions(superAdminRole.id, [
    { model: 'User', operations: Object.values(Operation) },
    { model: 'Role', operations: Object.values(Operation) },
    { model: 'Permission', operations: Object.values(Operation) },
    { model: 'Category', operations: Object.values(Operation) },
    { model: 'Article', operations: Object.values(Operation) },
    { model: 'Comment', operations: Object.values(Operation) },
    { model: 'Like', operations: Object.values(Operation) },
    { model: 'ArticleImage', operations: Object.values(Operation) },
  ]);

  await createPermissions(adminRole.id, [
    {
      model: 'User',
      operations: [
        Operation.list,
        Operation.get,
        Operation.create,
        Operation.update,
      ],
    },
    { model: 'Category', operations: Object.values(Operation) },
    { model: 'Article', operations: Object.values(Operation) },
    { model: 'Comment', operations: Object.values(Operation) },
    { model: 'Like', operations: Object.values(Operation) },
    { model: 'ArticleImage', operations: Object.values(Operation) },
  ]);

  await createPermissions(editorRole.id, [
    { model: 'Category', operations: [Operation.list, Operation.get] },
    {
      model: 'Article',
      operations: [Operation.list, Operation.get, Operation.update],
    },
    {
      model: 'Comment',
      operations: [
        Operation.list,
        Operation.get,
        Operation.create,
        Operation.update,
      ],
    },
    {
      model: 'Like',
      operations: [
        Operation.list,
        Operation.get,
        Operation.create,
        Operation.delete,
      ],
    },
    {
      model: 'ArticleImage',
      operations: [
        Operation.list,
        Operation.get,
        Operation.create,
        Operation.update,
        Operation.delete,
      ],
    },
  ]);

  await createPermissions(authorRole.id, [
    { model: 'Category', operations: [Operation.list, Operation.get] },
    {
      model: 'Article',
      operations: [
        Operation.list,
        Operation.get,
        Operation.create,
        Operation.update,
      ],
    },
    {
      model: 'Comment',
      operations: [
        Operation.list,
        Operation.get,
        Operation.create,
        Operation.update,
      ],
    },
    {
      model: 'Like',
      operations: [
        Operation.list,
        Operation.get,
        Operation.create,
        Operation.delete,
      ],
    },
    {
      model: 'ArticleImage',
      operations: [
        Operation.list,
        Operation.get,
        Operation.create,
        Operation.update,
        Operation.delete,
      ],
    },
  ]);

  await createPermissions(readerRole.id, [
    { model: 'Category', operations: [Operation.list, Operation.get] },
    { model: 'Article', operations: [Operation.list, Operation.get] },
    {
      model: 'Comment',
      operations: [
        Operation.list,
        Operation.get,
        Operation.create,
        Operation.update,
        Operation.delete,
      ],
    },
    {
      model: 'Like',
      operations: [
        Operation.list,
        Operation.get,
        Operation.create,
        Operation.delete,
      ],
    },
  ]);

  console.log('Database seeded successfully');
}

async function createRole(name: string, roleType: RoleTypes) {
  return await prisma.role.upsert({
    where: { id: `${roleType}_id` },
    update: { name, roleType },
    create: {
      id: `${roleType}_id`,
      name,
      roleType,
    },
  });
}

async function createPermissions(
  roleId: string,
  permissions: { model: string; operations: Operation[] }[],
) {
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { id: `${roleId}_${permission.model}` },
      update: { allowedOperations: permission.operations },
      create: {
        id: `${roleId}_${permission.model}`,
        modelName: permission.model,
        allowedOperations: permission.operations,
        rolePermissionsId: roleId,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
