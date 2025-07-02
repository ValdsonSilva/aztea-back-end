import { Router } from "express";
import SubmissionController from "../controllers/SubmissionController.js";

const submissionRoutes = Router();

submissionRoutes.get('/', SubmissionController.index);
submissionRoutes.get('/:id', SubmissionController.show);
submissionRoutes.get('/', SubmissionController.showByPending);
submissionRoutes.get('/:id', SubmissionController.showByUserId);
submissionRoutes.post('/', SubmissionController.store);
submissionRoutes.put('/:id', SubmissionController.approve);
submissionRoutes.put('/:id', SubmissionController.reject);

export default submissionRoutes;