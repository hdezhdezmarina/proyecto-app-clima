'use strict';

const button = document.getElementById('localizacion');
const resultado = document.getElementById('resultado');

button.addEventListener('load', () => {
  let lat;
  let lon;
  let temperaturavalor = document.getElementById('temp-valor');
  let temperaturaDesc = document.getElementById('temp-descripcion');
  let ubicacion = document.getElementById('ubicacion');
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=3ad8014553560d79f925a68e35ab1cb6`;
        console.log(url);
        resultado.textContent = `Latitud: ${lat} Longitud:${lon}`;
      },
      () => {
        resultado.textContent = 'No se pudo obtener la ubicación';
      }
    );
  } else {
    resultado.textContent = 'El navegador no soporta geolocalización';
  }
});

const apiKey = '';
const url = ``;

fetch(url)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    const rainChance = data.hourly[0].pop * 100; // La probabilidad de lluvia en la siguiente hora
    const time = new Date(data.hourly[0].dt * 1000); // La hora de la información meteorológica
    console.log(
      `La probabilidad de lluvia a las ${time.toLocaleTimeString()} es del ${rainChance}%`
    );
    console.log(data.main.name);
    ubicacion.textContent = name;
  })
  .catch((error) => {
    console.error('Error al obtener la información meteorológica', error);
  });
