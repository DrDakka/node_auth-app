import { AuthError } from "../errors";
import { TKN } from "../static";
import { JWTPayload, verifyToken } from "../utils/jwt";

function validateAuth(authHeader: string | undefined): JWTPayload {
  if (!authHeader) {
    throw new AuthError('Authorization header is required');
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new AuthError(
      'Invalid authorization header format. Expected: Bearer <token>',
    );
  }

  const token = parts[1];

  if (!token) {
    throw new AuthError('Token is missing');
  }

  const decoded = verifyToken(token);

  if (decoded.type !== TKN.ACC) {
    throw new AuthError('Invalid token type. Access token required');
  }

  return decoded;
}

export default validateAuth;