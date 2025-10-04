import { Router } from 'express';
import { 
  generateCompanySummary, 
  generatePreparationTips, 
  getCompanyInsights 
} from '../controllers/aiController/index.js';
import authentication from '../middleware/authentication.js';

const aiRouter = Router();

// Public AI routes (no authentication required)
aiRouter.get('/company/:companyName/summary', generateCompanySummary);
aiRouter.get('/company/:companyName/insights', getCompanyInsights);

// Protected AI routes (authentication required)
aiRouter.get('/company/:companyName/role/:jobRole/tips', authentication, generatePreparationTips);

export default aiRouter;