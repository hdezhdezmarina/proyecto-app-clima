'use strict';

//Seleccionamos los elementos de HTML que vamos a usar mediante su ID
const button = document.getElementById('localizacion');
const resultado = document.getElementById('resultado');
const container = document.getElementById('contenido');

//Establecemos las variables latitud y longitud (Es posible que debamos borrarlas y ponerlas dentro del if)
// let latitude;
// let longitude;

//Creamos un evento asociado al click en el botón
button.addEventListener('click', () => {
  //Dspués del click, si el navegador accede a la geolocalización nos devuelve la posición mediante lat y lon
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;

        //Establecemos la URL de la API modificada con los datos de latitud y longitud.
        //Podemos usar un template string para modificar el número de horas de la predicción (final de la url)
        const apiKey = 'cd6668e778614fef868940d1cf862875';
        const url = `https://api.weatherbit.io/v2.0/forecast/hourly?lat=${latitude}&lon=${longitude}&key=${apiKey}&hours=8`;

        //Comprobamos que podemos ver las propiedades de la API
        console.log(url);
        // resultado.textContent = `Latitud: ${latitude}, Longitud: ${longitude}`;

        // Hacemos las peticiones a la API mediante el método Fetch
        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            //Console log para ver los datos de la API
            console.log(data);

            //Establecemos una constante con los datos que queremos utilizar y comprobamos que funcione con console.log
            //También probamos a imprimir en el html
            const city = data.city_name;
            console.log(city);
            resultado.textContent = `${city}`;

            //Separamos las 8 primeras horas del array y las almacenamos en la variable datosHoras
            // const datosHoras = data.data.slice(0, 8);
            // console.log(datosHoras);

            //Obtenemos un array con los datos de lluvia (Esto es una prueba, pero funciona, falta interpretar esos datos)
            //La probabilidad de lluvia se mide con pop o conprecip (no tenemos ni puta idea)
            //ESto hay que revisarlo porque no funciona del todo bien (de la linea 50 a la 54)
            const problluvia = data.data.map((datos) => datos.precip);
            console.log(problluvia);

            let lluvia = problluvia >= 0.5 ? 'Llueve' : 'No llueve';
            console.log(lluvia);
          })
          //Usamos el método Catch por si hay algún error obteniendo info de la API
          .catch((error) => {
            console.error(
              'Error al obtener la información meteorológica',
              error
            );
          });
      },
      () => {
        resultado.textContent = 'No se pudo obtener la ubicación';
      }
    );
  } else {
    resultado.textContent = 'El navegador no soporta geolocalización';
  }
});

// const horaLluvia = (num) => {
//   return num < 0.5 ? 'Llueve' : 'No llueve'
// // 3. Función que recibe un valor numérico (una temperatura) y retorna un string con la clase
// //    que corresponda.
// const getProbLluvia = (temp) => {
//     if (temp < 4) {
//         return 'lower';
//     } else if (temp < 20) {
//         return 'low';
//     } else if (temp < 30){
//         return 'medium';d
//     } else {
//         return 'high';
//     }
// }
// }
