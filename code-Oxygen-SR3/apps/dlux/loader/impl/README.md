
The loader uses the following files from build:

cp ../../dlux-web/build/index.html ./src/main/resources/index/
cp ../../dlux-web/build/src/main.js ./src/main/resources/dlux/src/main.js
cp ../../dlux-web/build/src/app/app.controller.js ./src/main/resources/dlux/src/app/app.controller.js
cp ../../dlux-web/build/src/app/app.module.js ./src/main/resources/dlux/src/app/app.module.js
cp ../../dlux-web/build/src/app/routingConfig.js ./src/main/resources/dlux/src/app/routingConfig.js
cp -r ../../dlux-web/build/vendor/* ./src/main/resources/dlux/vendor/
cp -r ../../dlux-web/build/assets/* ./src/main/resources/dlux/assets/
rm -rf ./src/main/resources/dlux/assets/yang2xml