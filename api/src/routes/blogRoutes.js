const { Router } = require('express');
const {
  createBlog,
  getAllBlog,
  getBlogDetail,
  getProfessionalBlogs,
  updateBlog,
  statusBlog,
  deleteBlog,
  getBlogRemodev
} = require('../controllers/blogController.js');
const { adminAuthMiddleware } = require('../middleware/adminMiddleware.js');
const authAll = require('../middleware/authAll.js');

const router = Router();

router.post('/create', authAll, createBlog);
router.get('/', getAllBlog);
router.get('/removed', adminAuthMiddleware, getBlogRemodev);
router.get('/detail/:id', getBlogDetail);
router.put('/update/:id', authAll, updateBlog);
router.patch('/status/:id', authAll, statusBlog);
router.delete('/delete/:id', adminAuthMiddleware, deleteBlog);
router.get('/:professionalId', getProfessionalBlogs);

module.exports = router;
