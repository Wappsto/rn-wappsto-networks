import { useConfig } from '../src/override/config';

// overriding wappsto redux configuration
useConfig({
  baseUrl: 'https://qa.wappsto.com/services',
});
