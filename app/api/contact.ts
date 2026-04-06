import nodemailer from 'nodemailer';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const { nombre, apellidos, correo, organizacion, puesto, numAbogados } = req.body;

    // Con transporte de GoDaddy (conseguido de Env Vars)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtpout.secureserver.net',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true, // Use SSL
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, 
      },
    });

    try {
      await transporter.sendMail({
        from: `"IUDEX Website" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER, // Recibe el equipo de IUDEX
        subject: `Nueva Solicitud de Demo: ${nombre} ${apellidos}`,
        text: `
          Nueva solicitud de demo desde el sitio web:
          
          Nombre Completo: ${nombre} ${apellidos}
          Email: ${correo}
          Organización: ${organizacion}
          Puesto: ${puesto}
          Número de Abogados: ${numAbogados}
        `,
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

      return res.status(200).json({ message: 'Email enviado con éxito' });
    } catch (error) {
      console.error('Error enviando email:', error);
      return res.status(500).json({ error: 'Hubo un error al enviar el email' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
