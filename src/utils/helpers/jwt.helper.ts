import { JwtPayload } from 'src/models';

export const getToken = async (payload: JwtPayload) => ({
  token: await this.jwtService.sign(payload)
});
