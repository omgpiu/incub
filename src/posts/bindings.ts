import { ContainerModule, interfaces } from 'inversify';
import { PostsController } from './controller';
import { PostsService } from './service';
import { TYPES } from '../common';

export const postBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<PostsController>(TYPES.PostsController).to(PostsController);
  bind<PostsService>(TYPES.PostsService).to(PostsService);
});
