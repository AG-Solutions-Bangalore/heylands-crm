export const checkPermission = (userId, button, permissions) => {
  const userIdStr = String(userId);

  const permission = permissions.find((p) => p.button == button);
  if (!permission) return false;
  return (
    permission.userIds.includes(userIdStr) && permission.status == "Active"
  );
};
