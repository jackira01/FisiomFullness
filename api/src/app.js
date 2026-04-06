const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const dotenv = require('dotenv');
dotenv.config();
const userRouter = require('./routes/userRoutes');
const blogRouter = require('./routes/blogRoutes');
const typeRouter = require('./routes/typeRoutes');
const commentRouter = require('./routes/commentRoutes');
const loginRouter = require('./routes/loginRoutes');
const productRouter = require('./routes/productRoutes');
const registerRouter = require('./routes/registerRoutes');
const { optionCors } = require('./config/corsConfig');
const categoryRouter = require('./routes/categoryRoutes');
const chatRouter = require('./routes/chatRoutes');
const questionRouter = require('./routes/questionRoutes');
const specialtyRouter = require('./routes/specialtyRoutes');
const authRouter = require('./routes/authRoutes');
const appointmentRouter = require('./routes/appointmentRoutes');
const professionalRouter = require('./routes/professionalRoutes');
const serviceRouter = require('./routes/serviceRoutes');

const app = express();

app.use(compression());
app.use(express.json());
app.use(cors(optionCors));
app.use(morgan('dev'));

app.use('/users', userRouter);
app.use('/blogs', blogRouter);
app.use('/types', typeRouter);
app.use('/comments', commentRouter);
app.use('/login', loginRouter);
app.use('/products', productRouter);
app.use('/register', registerRouter);
app.use('/category', categoryRouter);
app.use('/chat', chatRouter);
app.use('/questions', questionRouter);
app.use('/specialty', specialtyRouter);
app.use('/auth', authRouter);
app.use('/appointments', appointmentRouter);
app.use('/professionals', professionalRouter);
app.use('/services', serviceRouter);

require('./db');
module.exports = { app };
