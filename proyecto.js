'use strict';

//Seleccionamos los elementos de HTML que vamos a usar mediante su ID
const button = document.getElementById('localizacion');
const resultado = document.getElementById('resultado');
const container = document.getElementById('contenido');

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

            //Prueba de formateo de hora
            const arrHoras = data.data.map((datos) => datos.timestamp_local);
            console.log(arrHoras);

            //Aquí hacemos un bucle que recorra los datos de la lluvia en cada hora evaluando su probabilidad
            const problluvia = data.data.map((datos) => datos.pop * 100);

            for (let i = 0; i < problluvia.length; i++) {
              const hora = new Date(arrHoras[i]).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
              });
              const lluvia = problluvia[i] > 50 ? 'Llueve' : 'No llueve';
              console.log(`A las ${hora} ${lluvia}`);
            }
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
