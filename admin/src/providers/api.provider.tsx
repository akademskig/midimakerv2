import jsonServerProvider from 'ra-data-json-server';
import { fetchUtils } from 'react-admin';
const httpClient = (url: string, options:any = { }) => {
    if (!options.headers) {
        options.headers= new Headers({ Accept: 'application/json' });
    }
    const token = localStorage.getItem('access_token');
    options.headers.set('Authorization', `Bearer ${token}`);
    return fetchUtils.fetchJson(url, options);
  };
  
  const dataProvider = jsonServerProvider('http://localhost:4000', httpClient);

  export  default dataProvider