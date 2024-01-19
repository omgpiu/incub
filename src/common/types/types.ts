const videos = {
  VideosController: Symbol.for('VideosController'),
  VideosService: Symbol.for('VideosService'),
  VideosRepository: Symbol.for('VideosRepository'),
};

const posts = {
  PostsService: Symbol.for('PostsService'),
  PostsController: Symbol.for('PostsController'),
  PostsRepository: Symbol.for('PostsRepository'),
};

const blogs = {
  BlogsController: Symbol.for('BlogsController'),
  BlogsService: Symbol.for('BlogsService'),
  BlogsRepository: Symbol.for('BlogsRepository'),
};
export const TYPES = {
  ...videos,
  ...blogs,
  ...posts,
  Application: Symbol.for('Application'),
  ILogger: Symbol.for('ILogger'),
  ExceptionFilter: Symbol.for('ExceptionFilter'),
  UtilsController: Symbol.for('UtilsController'),
  AuthMiddlewareService: Symbol.for('AuthMiddlewareService'),
  MongoDBClient: Symbol.for('MongoDBClient'),
};
