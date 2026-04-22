import { Resend } from 'resend';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Inicializar Resend con la API Key de las variables de entorno
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const { nombre, apellidos, correo, organizacion, puesto, numAbogados } = req.body;

    try {
      const { data, error } = await resend.emails.send({
        from: process.env.RESEND_FROM || 'onboarding@resend.dev',
        to: [process.env.RESEND_TO || 'info@iudex.ai'],
        replyTo: correo,
        subject: `Nueva Solicitud de Demo: ${organizacion}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #333;">Nueva Solicitud de Demo</h2>
            <p><strong>Nombre:</strong> ${nombre} ${apellidos}</p>
            <p><strong>Email:</strong> ${correo}</p>
            <p><strong>Organización:</strong> ${organizacion}</p>
            <p><strong>Puesto:</strong> ${puesto}</p>
            <p><strong>Número de Abogados:</strong> ${numAbogados}</p>
          </div>
        `,
      });

      if (error) {
        console.error('Error de Resend:', error);
        return res.status(400).json({ error: error.message || 'Error en el servicio de correo' });
      }

      return res.status(200).json({ 
        message: 'Email enviado con éxito',
        id: data?.id 
      });
    } catch (error: any) {
      console.error('Error enviando email:', error);
      return res.status(500).json({ error: 'Hubo un error al enviar el email' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
