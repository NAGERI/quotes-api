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

function isUserOrAdmin(req, res, next) {
  const role = res.tokenData.author_role;
  if (role !== "USER" && role !== "ADMIN")
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "Access denied, Not User or Admin" });
  next();
}

export { isAdmin, isUser, isUserOrAdmin };
