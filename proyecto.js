'use strict';

//Seleccionamos los elementos de HTML que vamos a usar mediante su ID
const button = document.getElementById('localizacion');
const resultado = document.getElementById('resultado');
const contenido = document.getElementById('contenido');
const listaOchoHoras = document.getElementById('lista');

//Creamos un evento asociado al click en el botón
button.addEventListener('click', (event) => {
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
        // Hacemos las peticiones a la API mediante el método Fetch
        fetch(url)
          .then((response) => response.json())
          .then((body) => {
            //Console log para ver los datos de la API

            //Establecemos una constante con los datos que queremos utilizar y comprobamos que funcione con console.log
            //También probamos a imprimir en el html
            const city = body.city_name;
            resultado.textContent = `${city}`;

            //Aquí hacemos un bucle que recorra los datos de la lluvia en cada hora evaluando su probabilidad
            const datosHoraYLluvia = body.data.map((datos) => {
              return {
                precipitacion: datos.weather.description,
                horasLluvia: datos.timestamp_local,
              };
            });

            for (let i = 0; i < datosHoraYLluvia.length; i++) {
              const hora = new Date(
                datosHoraYLluvia[i].horasLluvia
              ).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
              });
              const lluvia = datosHoraYLluvia[i].precipitacion.includes(
                'rain' || 'drizzle'
              )
                ? 'llueve'
                : 'no llueve';

              //Imprimimos la lista de horas en HTML
              const meteo = document.createElement('li');

              meteo.innerHTML = `
              <p>
              A las ${hora} ${lluvia}.
              </p>
              `;
              listaOchoHoras.appendChild(meteo);
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
