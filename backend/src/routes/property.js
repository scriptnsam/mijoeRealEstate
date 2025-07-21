const router = require('express').Router();
const { createProperty, getPropertyById, getAllProperties, updateProperty, deleteProperty } = require('../controllers/propertyController');
const { authenticate, restrictTo } = require('../middleware/auth');
const upload = require('../middleware/multer');

router.post('/', authenticate, restrictTo('admin', 'agent'), upload.array('images'), createProperty); // protected: admin/owner
router.get('/', getAllProperties);
router.get('/:id', getPropertyById);
router.put('/:id', authenticate, restrictTo('admin', 'agent'), updateProperty); // protected: admin/owner
router.delete('/:id', authenticate, restrictTo('admin', 'agent'), deleteProperty); // protected

module.exports = router;
