const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// Notificación al crear una cita (simulada)
exports.sendAppointmentEmail = functions.firestore
  .document("citas/{citaId}")
  .onCreate(async (snap, context) => {
    const cita = snap.data();
    const email = cita.email;
    const fecha = cita.fecha;
    console.log(`[SIMULADO] Se enviaría un correo a ${email} por la cita agendada para el día ${fecha}.`);
    return null;
  });

// Recordatorio diario a las 8:00 am (simulado)
exports.dailyAppointmentReminder = functions.pubsub
  .schedule("0 8 * * *")
  .timeZone("America/Mexico_City")
  .onRun(async (context) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    const fechaStr = `${yyyy}-${mm}-${dd}`;

    const citasSnap = await admin.firestore().collection("citas")
      .where("fecha", "==", fechaStr).get();

    const emails = [];
    citasSnap.forEach(doc => {
      const data = doc.data();
      if (data.email) {
        emails.push(data.email);
      }
    });

    emails.forEach(email => {
      console.log(`[SIMULADO] Se enviaría un recordatorio a ${email} para la cita del día ${fechaStr}.`);
    });
    return null;
  });
