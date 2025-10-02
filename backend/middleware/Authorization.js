export default function authorization(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorise User" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }
    next();
  };
}
