import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const body = req.body;

    // Confirmación inmediata para las pruebas de conexión de Mercado Pago
    if (body?.type === 'mp-connect' || body?.action === 'test') {
      return res.status(200).json({ status: 'ok', message: 'Conexión probada' });
    }

    // Extraer email del comprador
    const recipient = body?.payer?.email || body?.data?.payer?.email || 'entrenafutsalush@gmail.com';

    // Enviar correo automático
    await resend.emails.send({
      from: 'Entrena Futsal PRO <onboarding@resend.dev>',
      to: recipient,
      subject: '¡Tu suscripción a Entrena Futsal PRO está activa! ⚽🔥',
      html: `
        <div style="font-family: sans-serif; padding: 20px; line-height: 1.5;">
          <h2>¡Bienvenido a Entrena Futsal PRO!</h2>
          <p>Tu pago ha sido procesado con éxito.</p>
          <p>Aquí tienes tu clave de activación / enlace de acceso:</p>
          <div style="background-color: #f4f4f4; padding: 15px; font-size: 18px; font-weight: bold; width: fit-content;">
            PRO-FUTSAL-2026
          </div>
          <p>Si tienes alguna consulta, responde directamente a este correo.</p>
        </div>
      `
    });

    return res.status(200).json({ success: true, message: 'Correo enviado' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
