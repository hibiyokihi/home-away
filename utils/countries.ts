import countries from 'world-countries';

export const formattedCountries = countries.map((item) => ({
  code: item.cca2,
  name: item.name.common,
  flag: item.flag,
  location: item.latlng,
  region: item.region,
  // world-countriesのプロパティ名がいまいちだから、renameする目的
}));

export const findCountryByCode = (code: string) =>
  formattedCountries.find((item) => item.code === code);