import { ContainerModule, interfaces } from 'inversify';
import { BlogsController } from './controller';
import { BlogsService } from './service';
import { BlogsRepository } from './repository';
import { TYPES } from '../common';

export const blogBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<BlogsController>(TYPES.BlogsController).to(BlogsController);
  bind<BlogsService>(TYPES.BlogsService).to(BlogsService);
  bind<BlogsRepository>(TYPES.BlogsRepository)
    .to(BlogsRepository)
    .inSingletonScope();
});
