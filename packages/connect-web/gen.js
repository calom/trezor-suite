const fs = require('fs');
const TC = require('trezor-connect').default;

// create file
// const keys = Object.keys(TC).forEach(method => {
//     fs.writeFileSync(`${__dirname}/api/${method}.d.ts`, '');
// });
// imports
const keys = Object.keys(TC)
    .sort()
    .forEach(method => {
        // console.log(`import { ${method} } from './${method}';`);
        console.log(
            `// https://github.com/trezor/trezor-suite/tree/develop/packages/connect-core/docs/methods/${method}.md`,
        );
        console.log(`${method}: typeof ${method};`);
        console.log(``);
        // fs.writeFileSync(`${__dirname}/api/${method}.d.ts`, '');
    });

// console.warn('keys', keys.length, `${__dirname}/api/${keys.length}.d.ts`);
// console.warn('FS', fs.writeSync);
// fs.writeFileSync(`${__dirname}/api/${keys.length}.d.ts`, '');

// fse.writeFileSync(
//     path.resolve(NPM, 'package.json'),
//     JSON.stringify(packageJSON, null, '  '),
//     'utf-8',
// );
