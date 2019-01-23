// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  firebaseConfig : {
    apiKey: "AIzaSyCqZWcPHg7kwaldRzKcmS5Hs1pUkjSolb0",
    authDomain: "rastraroute.firebaseapp.com",
    databaseURL: "https://rastraroute.firebaseio.com",
    projectId: "rastraroute",
    storageBucket: "rastraroute.appspot.com",
    messagingSenderId: "977299048739"
  }
};
