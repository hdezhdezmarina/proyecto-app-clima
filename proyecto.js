'use strict';

//Seleccionamos los elementos de HTML que vamos a usar mediante su ID
const button = document.getElementById('localizacion');
const resultado = document.getElementById('resultado');
const listaOchoHoras = document.getElementById('lista');

//Creamos un evento asociado al click en el botón
button.addEventListener('click', () => {
  //Hacemos desaparecer el botón después del primer click
  button.style.display = 'none';

  //Dspués del click, si el navegador accede a la geolocalización nos devuelve la posición mediante lat y lon
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;

        //Establecemos la URL de la API modificada con los datos de latitud y longitud.
        const apiKey = 'cd6668e778614fef868940d1cf862875';
        const url = `https://api.weatherbit.io/v2.0/forecast/hourly?lat=${latitude}&lon=${longitude}&key=${apiKey}&hours=8`;

        // Hacemos las peticiones a la API mediante el método Fetch
        fetch(url)
          .then((response) => response.json())
          .then((body) => {
            //Console log para ver los datos de la API

            //Establecemos una constante con el nombre de la localización para imprimir en el HTML
            const city = body.city_name;
            resultado.textContent = `${city}`;

            //Aquí hacemos un map con las propiedades de la API que vamos a usar
            const datosHoraYLluvia = body.data.map((datos) => {
              return {
                precipitacion: datos.weather.description,
                horasLluvia: datos.timestamp_local,
                temperatura: datos.temp,
              };
            });

            //Creamos un bucle que recorra el objeto retornado y formatee los datos
            //de forma que devuelva la información que nosotros queremos para cada hora
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

              if (lluvia) {
                meteo.innerHTML = `
                  <p>A las ${hora} llueve.</p>
                  <img src="./animated/rainy-6.svg" alt="">
                  <p></p>
                `;
              } else {
                meteo.innerHTML = `
                <p>A las ${hora} no llueve.</p>
                <img src="./animated/cloudy-day-3.svg" alt="">
                <p></p>
              `;
              }

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
