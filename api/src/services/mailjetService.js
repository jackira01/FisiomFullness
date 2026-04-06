require('dotenv').config();

const Mailjet = require('node-mailjet');

class EmailService {
  constructor() {
    this.mailjet = null;
    this.senderEmail = '';
    this.appName = '';
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    const apiKeyPublic = process.env.MJ_APIKEY_PUBLIC;
    const apiKeyPrivate = process.env.MJ_APIKEY_PRIVATE;

    if (!apiKeyPublic || !apiKeyPrivate) {
      throw new Error(
        'Mailjet API keys are required. Please set MJ_APIKEY_PUBLIC and MJ_APIKEY_PRIVATE environment variables.'
      );
    }

    this.senderEmail = process.env.EMAIL_SENDER;
    this.appName = process.env.APP_NAME || 'Fisium Fulness';

    if (!this.senderEmail) {
      throw new Error(
        'Sender email is required. Please set EMAIL_SENDER in your environment variables.'
      );
    }

    this.mailjet = new Mailjet({
      apiKey: apiKeyPublic,
      apiSecret: apiKeyPrivate,
    });

    this.initialized = true;
  }

  /**
   * Envía un email usando Mailjet
   * @param {Object} options
   * @param {string} options.to - Email del destinatario
   * @param {string} options.subject - Asunto del email
   * @param {string} options.html - Contenido HTML del email
   * @param {string} [options.text] - Contenido de texto plano (opcional)
   * @returns {Promise<Object>}
   */
  async sendEmail({ to, subject, html, text = '' }) {
    try {
      await this.initialize();

      if (!to || !subject || !html) {
        throw new Error('El email, asunto y contenido HTML son requeridos');
      }

      const request = this.mailjet
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [
            {
              From: {
                Email: this.senderEmail,
                Name: this.appName,
              },
              To: [{ Email: to }],
              Subject: subject,
              HTMLPart: html,
              TextPart: text || subject,
            },
          ],
        });

      const result = await request;
      const messageInfo = result.body.Messages[0];

      if (messageInfo.Status === 'success') {
        return { success: true, messageId: messageInfo.To[0].MessageID.toString() };
      } else {
        return {
          success: false,
          error: messageInfo.Errors?.[0]?.ErrorMessage || 'Unknown error occurred',
        };
      }
    } catch (error) {
      console.error('Error al enviar email con Mailjet:', error);
      return { success: false, error: error.message || 'Failed to send email' };
    }
  }

  /**
   * Envía un email de confirmación de cuenta
   */
  async sendConfirmationEmail(user, token, confirmUrl = 'http://localhost:5173/confirm') {
    const { email, username } = user;

    const html = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>¡Bienvenido a Fisium Fulness!</h2>
            <p>Hola ${username},</p>
            <p>Gracias por registrarte. Para completar tu registro, confirma tu cuenta haciendo clic en el siguiente enlace:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmUrl}/${token}" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Confirmar Cuenta
              </a>
            </div>
            <p style="word-break: break-all; color: #666;">${confirmUrl}/${token}</p>
            <p style="font-size: 12px; color: #999;">Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({ to: email, subject: 'Confirma tu cuenta - Fisium Fulness', html });
  }

  /**
   * Envía un email de recuperación de contraseña
   */
  async sendPasswordRecoveryEmail(user, newPassword, loginUrl = 'http://localhost:5173/login') {
    const { email, username } = user;

    const html = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Recuperación de Contraseña</h2>
            <p>Hola ${username},</p>
            <p>Hemos recibido una solicitud para restablecer tu contraseña en Fisium Fulness.</p>
            <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <strong>Tu nueva contraseña temporal es:</strong><br/>
              <code style="font-size: 16px; letter-spacing: 2px;">${newPassword}</code>
            </p>
            <p>Usa esta contraseña para acceder y luego cámbiala por una más segura.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${loginUrl}" style="display: inline-block; background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Ir a Iniciar Sesión
              </a>
            </div>
            <p style="font-size: 12px; color: #999;">Si no solicitaste este cambio, contáctanos inmediatamente.</p>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({ to: email, subject: 'Recuperación de Contraseña - Fisium Fulness', html });
  }
}

module.exports = new EmailService();
