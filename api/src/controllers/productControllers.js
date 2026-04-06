const Product = require('../models/Product');
const { cloudinary } = require('../config/cloudinaryConfig.js');

exports.createProduct = async (req, res) => {
  const { name, price, stock, category, description, image, id_image } = req.body;
  try {
    if (!image || !id_image) {
      return res.status(400).json({ message: 'Imagen requerida' });
    }
    const newProduct = {
      name,
      price,
      stock,
      category,
      description,
      image,
      id_image,
    };

    const product = new Product(newProduct);
    await product.save();

    return res.status(200).json({ message: 'Create Product', product });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getAllProduct = async (req, res) => {
  const { title } = req.query;
  try {
    const products = await Product.find({ status: true }).populate(
      'category',
      'name'
    );

    if (!title) return res.status(200).json({ products });

    const productFilter = products.filter((product) =>
      product.title.toLowerCase().includes(title.toLowerCase())
    );
    if (!productFilter.length) throw new Error('no product found');

    return res.status(200).json({ productFilter });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  const id = req.params.id;
  const { name, price, stock, category, description, image, id_image } = req.body;
  try {
    const newData = {
      name,
      price,
      stock,
      category,
      description,
      ...(image && { image }),
      ...(id_image && { id_image }),
    };

    const condition = await Product.findByIdAndUpdate({ _id: id }, newData);
    if (!condition) throw new Error('product not found');

    return res.status(200).json({ message: 'Product has been updated' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.statusProduct = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const product = await Product.findById(id);
    if (!product) throw new Error('the product does not exist');

    product.status = status;
    await product.save();

    return res
      .status(200)
      .json({ message: `the product with id ${id} has been removed` });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getProductDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id).populate('category', 'name')

    return res.status(200).json({ product });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw new Error('the product does not exist');
    await cloudinary.uploader.destroy(product.id_image);

    return res
      .status(200)
      .json({ message: `the product with id ${id} has been removed` });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getProductRemodev = async (req, res) => {
  try {
    const productsRemoved = await Product.find({ status: false }).populate('category', 'name');

    return res.status(200).json({ productsRemoved });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
