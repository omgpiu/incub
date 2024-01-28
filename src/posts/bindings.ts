import { ContainerModule, interfaces } from 'inversify';
import { PostsController } from './controller';
import { PostsService } from './service';
import { TYPES } from '../common';
import { PostsQueryRepository, PostsRepository } from './repository';

export const postBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<PostsController>(TYPES.PostsController).to(PostsController);
  bind<PostsService>(TYPES.PostsService).to(PostsService);
  bind<PostsRepository>(TYPES.PostsRepository)
    .to(PostsRepository)
    .inSingletonScope();
  bind<PostsQueryRepository>(TYPES.PostsQueryRepository)
    .to(PostsQueryRepository)
    .inSingletonScope();
});
