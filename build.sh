npx tsc
cd lib
npx terser Game2048.js -o Game2048.js
npx terser play.js -o play.js
npx terser test.js -o test.js
