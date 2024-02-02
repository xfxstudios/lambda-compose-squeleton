echo "Compiling AppLayer..."
tsc
cp -r ./dist/* ../app-layer/nodejs/node_modules/AppLayer
rm -r ./dist
echo "Done"