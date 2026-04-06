const User = require("../models/User");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailService = require("../services/mailjetService");

const JWT_secret = process.env.JWT_secret;

// exports.login = async (req, res) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   const { email, password, username } = req.body;

//   if (!username || username.trim() === "") {
//     return res.status(400).json({ error: "Username is required" });
//   }

//   const newUser = new User({
//     username,
//     email,
//     password,
//   });

//   const salt = await bcrypt.genSalt(10);
//   newUser.password = await bcrypt.hashSync(newUser.password, salt);
//   await newUser.save();

//   // Envío del correo electrónico de confirmación
//   const emailConfirmation = async (data) => {
//     const transport = nodemailer.createTransport({
//       host: E_HOST,
//       port: E_PORT,
//       auth: {
//         user: E_USER,
//         pass: E_PASSWORD,
//       },
//     });
//     const { username, email, token } = data;
//     await transport.sendMail({
//       from: "fisiumfulness",
//       to: email,
//       subject: "Confirm account",
//       text: "Confirm account",
//       html: `
//         <p> Hi! ${username}, confirm account in Fisium Fulness </p>
//         <p> Confirm your account in the link :
//         <a href="http://localhost:5173/confirm/${token}"> Confirm Account </a></p>
//         <p> If you didn't create the account, ignore it</p>`,
//     });
//   };

//   emailConfirmation({
//     username: newUser.username,
//     email: newUser.email,
//     token: newUser.token,
//   });

//   res.status(200).send(newUser);
// };

exports.login = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { email, password } = req.body;

  try {
    // Validar que se proporcionaron email y password
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    // Buscar el usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Usuario o contraseña inválidos' });
    }

    // Comparar la contraseña proporcionada con el hash almacenado
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Usuario o contraseña inválidos' });
    }

    // Generar access token (1h) y refresh token (7d)
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_secret, { expiresIn: '1h' });

    const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || JWT_secret;
    const refreshToken = jwt.sign({ userId: user._id, role: user.role }, REFRESH_SECRET, { expiresIn: '7d' });

    const tokenExpiresInSeg = 3600;
    const refreshExpiresInSeg = 7 * 24 * 60 * 60;

    // Guardar el refresh token en cookie httpOnly
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: refreshExpiresInSeg * 1000,
    });

    return res.status(200).json({ user, token, refreshToken, tokenExpiresInSeg, refreshExpiresInSeg });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

exports.recoverAccount = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { email } = req.body;

  try {
    // Validar que se proporcionó email
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: "Email es requerido" });
    }

    // Buscar el usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Generar nueva contraseña temporal
    const newPassword = Math.random().toString(32).substring(2, 16);
    const salt = await bcrypt.genSalt(10);
    const passCrypt = await bcrypt.hash(newPassword, salt);
    user.password = passCrypt;

    // Guardar los cambios en la base de datos
    await user.save();

    // Enviar email de recuperación usando Mailjet
    const emailResult = await emailService.sendPasswordRecoveryEmail(
      {
        email: user.email,
        username: user.username,
      },
      newPassword,
      process.env.APP_URL || 'http://localhost:5173/login'
    );

    // Verificar si el email se envió correctamente
    if (!emailResult.success) {
      console.error("Email send failed:", emailResult.error);
      return res.status(500).json({
        error: "Email de recuperación no pudo ser enviado",
        details: emailResult.error
      });
    }

    // Respuesta exitosa
    return res.status(200).json({
      message: "Email de recuperación enviado correctamente",
      messageId: emailResult.messageId
    });

  } catch (error) {
    console.error("Error en recoverAccount:", error);
    return res.status(500).json({
      error: "Error al procesar la solicitud de recuperación",
      details: error.message
    });
  }
};

