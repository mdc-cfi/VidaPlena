// importData.js

// 1. Importamos Firebase Admin
const admin = require('firebase-admin');

// 2. Importamos el archivo de credenciales (Service Account)
//    Asegúrate de que el nombre sea exacto y que esté en la misma carpeta.
const serviceAccount = require('./gestion-de-mayores-firebase-adminsdk-fbsvc-711491c219.json');

// 3. Inicializamos la aplicación de Firebase Admin usando las credenciales
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// 4. Obtenemos la referencia a Firestore
const db = admin.firestore();

// 5. Importamos el archivo con los datos de los clientes
//    Asegúrate de que "data.json" esté en la misma carpeta que este script
const clientes = require('./data.json');

// 6. Función asíncrona para importar los clientes a la colección "clientes"
const importarDatos = async () => {
  // Apuntamos a la colección "clientes"
  const collectionRef = db.collection('clientes');

  // Recorremos cada cliente del array "clientes"
  for (const cliente of clientes) {
    try {
      // Usamos "cliente.id" como el ID del documento.
      // Si no deseas IDs personalizados, podrías usar "await collectionRef.add(cliente);"
      await collectionRef.doc(cliente.id).set(cliente);
      console.log(`Documento "${cliente.id}" importado correctamente.`);
    } catch (error) {
      console.error(`Error al importar "${cliente.id}":`, error);
    }
  }

  console.log('Importación finalizada.');
};

// 7. Llamamos a la función para ejecutar la importación
importarDatos();
