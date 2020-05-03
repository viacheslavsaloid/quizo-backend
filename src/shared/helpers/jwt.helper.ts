import { JwtPayload } from 'src/shared/models';

export const getToken = async (payload: JwtPayload) => ({
  token: await this.jwtService.sign(payload)
});
