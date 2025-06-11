import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const data = req.body;

    // Basic validation: Check if required fields exist
    if (!data.folio || !data.nombreTrabajador || !data.rfc || !data.curp) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }

    console.log("Datos a guardar en la base de datos:", data); // Simula guardado en BD

    // In a real application, you would interact with your database here
    // For example: await db.collection('empleados').insertOne(data);

    return res
      .status(200)
      .json({
        success: true,
        message: "Datos del empleado guardados exitosamente.",
      });
  }

  return res.status(405).json({ error: "Método no permitido" });
}