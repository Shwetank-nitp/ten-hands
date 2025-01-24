import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

const decodeToken = (req, res, next) => {
  const token = req.headers?.authorization;

  if (!token) {
    res.status(401).send("no token found");
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded;
    next();
  } catch (error) {
    res.status(401).send("invalid token");
  }
};

export { decodeToken };
