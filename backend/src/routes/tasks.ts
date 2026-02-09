import { Router } from 'express';
import { listTasks, createTask, updateTask, deleteTask } from '../controllers/taskController';
import { authenticate } from '../middleware/auth';
import { apiLimiter, createLimiter } from '../middleware/rateLimiter';

const router = Router({ mergeParams: true });

router.use(authenticate);
router.use(apiLimiter);

router.get('/', listTasks);
router.post('/', createLimiter, createTask);
router.put('/:taskId', updateTask);
router.delete('/:taskId', deleteTask);

export default router;
