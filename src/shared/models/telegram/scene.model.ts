import { AppContext } from './context.model';
import { Repository } from 'typeorm';

export interface SceneProps {
  ctx: AppContext;
  repository?: Repository<any>;
  service?: any;
}
