import { StatusCodes } from "http-status-codes";

function isAdmin(req, res, next) {
  if (res.tokenData.author_role !== "ADMIN")
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "Access denied, Not Admin" });
  next();
}

function isUser(req, res, next) {
  if (res.tokenData.author_role !== "USER")
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "Access denied, Not User" });
  next();
}

export { isAdmin, isUser };
