// pnpm packages
import jwt from "jsonwebtoken";

// worksapce packages
import { JWT_SECRET } from "@repo/backend-common/config";

const checkToken = (token) => {
  const payload = jwt.verify(token, JWT_SECRET);

  if (!payload || !payload?.userId) {
    return null;
  }

  return payload.userId;
};

export { checkToken };
