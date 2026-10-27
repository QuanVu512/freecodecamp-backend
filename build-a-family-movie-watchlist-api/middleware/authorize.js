export function authorizeModification(req, res, next) {
  const { role, id } = req.user || {};
  const { userId } = req.params;

  // Quyền parent: được phép sửa đổi bất kỳ watchlist nào
  if (role === "parent") {
    return next();
  }

  // Quyền child: chỉ được sửa nếu userId trùng với id của chính mình
  if (role === "child" && String(id) === String(userId)) {
    return next();
  }

  return res.status(403).json({ error: "Access denied" });
}