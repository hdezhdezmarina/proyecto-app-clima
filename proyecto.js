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
                codigoPrecipitacion: datos.weather.code,
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

              //Hacemos una constante con el código meteorológico de cada hora y lo utilizamos para
              //crear un if else que nos diga que tiempo hace y una imagen que lo represente
              const prevision = datosHoraYLluvia[i].codigoPrecipitacion;
              let tiempo = '';
              let icono = '';
              if (prevision > 199 && prevision < 203) {
                tiempo = 'Lluvia tormentosa';
                icono = '/iconosMeteo/tormenta.svg';
              } else if (prevision > 229 && prevision < 234) {
                tiempo = 'Tormenta eléctrica';
                icono = '/iconosMeteo/tormenta.svg';
              } else if (
                (prevision > 299 && prevision <= 500) ||
                (prevision >= 520 && prevision <= 521)
              ) {
                tiempo = 'Lluvia ligera';
                icono = '/iconosMeteo/lluvia-ligera.svg';
              } else if (prevision === 511) {
                tiempo = 'Granizo';
                icono = '/iconosMeteo/granizo.svg';
              } else if (
                prevision === 501 ||
                prevision === 502 ||
                prevision === 522
              ) {
                tiempo = 'Lluvia intensa';
                icono = '/iconosMeteo/lluvia-intensa.svg';
              } else if (prevision > 599 && prevision < 624) {
                tiempo = 'Nieve';
                icono = '/iconosMeteo/nieve.svg';
              } else if (prevision > 699 && prevision < 752) {
                tiempo = 'Niebla';
                icono = '/iconosMeteo/nublado.svg';
              } else if (prevision === 800) {
                tiempo = 'Solazo';
                icono = '/iconosMeteo/solazo.svg';
              } else if (prevision > 800 && prevision < 805) {
                tiempo = 'Nublado';
                icono = '/iconosMeteo/nublado.svg';
              } else {
                tiempo = 'Desconocido';
                icono = '/iconosMeteo/weather.svg';
              }

              //Imprimimos la lista en HTML
              const meteo = document.createElement('li');

              meteo.innerHTML = `
                  <h2>${hora} ${tiempo}</h2>
                  <img src="${icono}" alt="${tiempo}">
                
                  <p>Temperatura: ${datosHoraYLluvia[i].temperatura}º</p>
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
