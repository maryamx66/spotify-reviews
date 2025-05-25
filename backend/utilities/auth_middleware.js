import { verify_jwt } from "./jwt.js";

/*
This middleware runs on every request. It checks the authentication token
and sets req.user to either null of the data of the user stored in the token.
*/
export const auth_middleware = (req, res, next) => {
  let auth_header = req.header("authorization");
  if (!auth_header) {
    req.user = null;
    return next();
  }
  // auth_header = "Bearer your_token_here"
  let auth_token = auth_header.split(" ")[1];
  let payload = verify_jwt(auth_token);
  req.user = payload;
  return next();
};
