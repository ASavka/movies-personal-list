import { Router } from 'express';
import movieController from '../controllers/movie-controller';

const movieRouter = Router();

movieRouter.get('/movies', movieController.getAll);

movieRouter.get('/movies/:id', movieController.getById);

movieRouter.post('/movies', movieController.create);

movieRouter.patch('/movies/:id', movieController.patchById);

movieRouter.delete('/movies/:id', movieController.deleteById);

export default movieRouter;
