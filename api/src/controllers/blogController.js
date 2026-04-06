const { cloudinary } = require('../config/cloudinaryConfig');
const Blog = require('../models/Blog');

exports.createBlog = async (req, res) => {
  const { text, title, type_id, createBy, professional_id, image, id_image } = req.body;

  try {
    if (!image || !id_image) {
      return res.status(400).json({ message: 'Imagen requerida' });
    }
    const newBlog = {
      text,
      title,
      type_id,
      createBy: createBy || professional_id,
      image,
      id_image,
    };
    const blog = new Blog(newBlog);
    await blog.save();
    return res.status(200).json({ blog });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};
exports.getAllBlog = async (req, res) => {
  const { search, sortBy, order, status, professionalId, page = 1, limit = 9 } = req.query;
  try {
    const query = {};

    // Status filter: si no se pasa, solo mostrar activos
    if (status !== undefined) {
      query.status = status === 'true';
    } else {
      query.status = true;
    }

    if (search && search.trim() !== '') {
      query.title = { $regex: search.trim(), $options: 'i' };
    }

    if (professionalId) {
      query.createBy = professionalId;
    }

    const sortOptions = {};
    if (sortBy && order) {
      sortOptions[sortBy] = order === 'desc' ? -1 : 1;
    } else {
      sortOptions.createdDate = -1;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .populate('type_id')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      blogs,
      totalBlogs: total,
      totalPages: Math.ceil(total / Number(limit)),
      hasMoreToLoad: skip + blogs.length < total,
      page: Number(page),
    });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

exports.getProfessionalBlogs = async (req, res) => {
  const { professionalId } = req.params;
  const { page = 1, limit = 6 } = req.query;
  try {
    const query = { createBy: professionalId, status: true };
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .populate('type_id', 'name')
      .sort({ createdDate: -1 })
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      blogs,
      totalBlogs: total,
      totalPages: Math.ceil(total / Number(limit)),
      hasMoreToLoad: skip + blogs.length < total,
      page: Number(page),
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
exports.updateBlog = async (req, res) => {
  const id = req.params.id;
  const { text, title, type_id, createBy, id_image, image } = req.body;
  console.log({ type_id });
  try {
    const newData = {
      text,
      title,
      createBy,
      type_id,
      ...(image && { image }),
      ...(id_image && { id_image }),
    };

    const condition = await Blog.findByIdAndUpdate({ _id: id }, newData);
    if (!condition) throw new Error('blog not found');
    return res.status(200).json({ message: 'Blog has been updated' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
exports.statusBlog = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const blog = await Blog.findById(id);
    if (!blog) throw new Error('the blog does not exist');

    blog.status = status;
    await blog.save();

    return res
      .status(200)
      .json({ message: `the blog with id ${id} has been removed` });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
exports.getBlogDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id).populate('type_id', 'name');
    console.log('ENTRY', { blog });
    return res.status(200).json({ blog });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.deleteBlog = async (req, res) => {
  const id = req.params.id;

  try {
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) throw new Error('the blog does not exist');
    await cloudinary.uploader.destroy(blog.id_image);

    return res.status(200).json({ message: 'blog has been deleted' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getBlogRemodev = async (req, res) => {
  try {
    const blogRemoved = await Blog.find({ status: false }).populate('type_id', 'name');

    return res.status(200).json({ blogRemoved });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
