import { ContainerModule, interfaces } from 'inversify';
import { IVideosService, VideosService } from './service';
import { IVideosController, VideosController } from './controller';
import { VideosRepository } from './repository';
import { TYPES } from '../common';

export const videoBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<IVideosService>(TYPES.VideosService).to(VideosService);
  bind<IVideosController>(TYPES.VideosController).to(VideosController);
  bind<VideosRepository>(TYPES.VideosRepository)
    .to(VideosRepository)
    .inSingletonScope();
});
