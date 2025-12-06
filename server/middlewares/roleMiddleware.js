export const allowRoles = (...roles) => {
  return (req, res, next) => {
    console.log(req.user.role)
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'No tiene permisos' });
    }
    next();
  };
};