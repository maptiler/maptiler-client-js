import {
  config,
  geocoding,
  geolocation,
  coordinates,
  data,
  LanguageGeocoding,
} from '../dist/maptiler-client.mjs';

// For this examople to work, you must bring your own node-compatible fetch,
// unles you are using a version of Nodejs that already contains fetch (>=18)
// import fetch from 'node-fetch';

// config.fetch = fetch;
config.apiKey = 'YOUR_MAPTILER_CLOUD_API_KEY';

async function testGeocoding() {
  // const result1 = await geocoding.forward('bordeaux', {language: [LanguageGeocoding.AUTO, LanguageGeocoding.ENGLISH]});
  // console.log(result1);

  const result2 = await geocoding.reverse([6.249638, 46.402056], {language: ['es', 'en']});
  console.log(result2);
}

async function testGeolocation() {
  const result = await geolocation.info();
  console.log(result);
}

async function testCoordinates() {
  // searching
  console.log(await coordinates.search('mercator', {transformations: true}));
  console.log(await coordinates.search('plate carree'));
  console.log(await coordinates.search('france'));
  console.log(await coordinates.search('4326', {transformations: true}));
  console.log(await coordinates.search('4326'));

  // Transforming from wgs84 (default) to lambert93
  console.log(await coordinates.transform({lng: 1, lat: 45}, {targetCrs: 9793}));
  console.log(await coordinates.transform([{lng: 10, lat: 48},{lng: 1, lat: 45}], {targetCrs: 9793}));
}

async function testData() {
  console.log(await data.get('2dd5ecc4-3ae1-4d1e-99a2-182256486357'));
}

(async () => {
  await testGeocoding();
  // await testGeolocation();
  // await testCoordinates();
  // await testData();
})()