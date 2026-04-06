const Question = require('../models/Question');
const User = require('../models/User');

/**
 * Populates the professional field inside answer and the creator of the question.
 * Returns the plain question object with those fields set.
 */
const populateQuestion = async (question) => {
  const plain = question.toObject ? question.toObject() : { ...question };
  if (plain.answer?.professionalId) {
    const professional = await User.findById(plain.answer.professionalId).select(
      '_id firstname lastname username image'
    );
    plain.answer = { ...plain.answer, professional: professional ?? null };
  }
  if (plain.userId) {
    const creator = await User.findById(plain.userId).select('_id firstname lastname image');
    plain.creator = creator ?? null;
  }
  return plain;
};

/**
 * GET /questions
 * Query: offset, limit, specialtyId, search
 */
const getQuestions = async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 30;
    const { specialtyId, search } = req.query;

    const filter = {};
    if (specialtyId) filter.specialtyId = specialtyId;
    if (search) filter.text = { $regex: search, $options: 'i' };

    const total = await Question.countDocuments(filter);
    const questions = await Question.find(filter)
      .sort({ createdDate: -1 })
      .skip(offset)
      .limit(limit)
      .lean();

    // Populate professionals for answered questions and creator for all questions
    const populated = await Promise.all(
      questions.map(async (q) => {
        let result = { ...q };
        if (q.answer?.professionalId) {
          const professional = await User.findById(q.answer.professionalId).select(
            '_id firstname lastname username image'
          );
          result = { ...result, answer: { ...q.answer, professional: professional ?? null } };
        }
        if (q.userId) {
          const creator = await User.findById(q.userId).select('_id firstname lastname image');
          result = { ...result, creator: creator ?? null };
        }
        return result;
      })
    );

    return res.json({
      questions: populated,
      totalQuestions: total,
      hasMoreToLoad: offset + limit < total,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * POST /questions/create
 * Body: { text, specialtyId? }
 * Requires authToken middleware
 */
const createQuestion = async (req, res) => {
  try {
    const { text, specialtyId } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length < 10) {
      return res.status(400).json({ message: 'El texto de la pregunta debe tener al menos 10 caracteres' });
    }

    const newQuestion = await Question.create({
      text: text.trim(),
      specialtyId: specialtyId ?? null,
      userId: req.user.userId,
    });

    const plain = newQuestion.toObject();

    // Populate creator info
    const creator = await User.findById(req.user.userId).select('_id firstname lastname image');
    const plainWithCreator = { ...plain, creator: creator ?? null };

    // Notify all clients about the new question in real time
    const io = req.app.get('io');
    if (io) {
      io.emit('question:new', { question: plainWithCreator });
    }

    return res.status(201).json({ newQuestion: plainWithCreator });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * PUT /questions/response/:questionId
 * Body: { text, professionalId }
 * Requires authToken middleware
 */
const respondQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { text, professionalId } = req.body;

    if (!text || !professionalId) {
      return res.status(400).json({ message: 'text y professionalId son requeridos' });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Pregunta no encontrada' });
    }

    // Prevent the creator from answering their own question
    if (question.userId && question.userId === req.user.userId) {
      return res.status(403).json({ message: 'No puedes responder tu propia pregunta' });
    }

    await Question.findByIdAndUpdate(
      questionId,
      { isAnswered: true, answer: { text, professionalId } },
      { new: true }
    );

    const updatedDoc = await Question.findById(questionId);
    const updatedQuestion = await populateQuestion(updatedDoc);

    // Notify all clients about the answered question in real time
    const io = req.app.get('io');
    if (io) {
      io.emit('question:answered', { question: updatedQuestion });
    }

    return res.json({ updatedQuestion });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE /questions/:questionId
 * Requires authToken middleware (admin/super_admin enforced in route)
 */
const deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    const question = await Question.findByIdAndDelete(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Pregunta no encontrada' });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getQuestions, createQuestion, respondQuestion, deleteQuestion };
