echo "Installing packages.in AppLayer.."
npm install --quiet

echo "Compiling AppLayer..."
tsc

echo "Creating directory..."
mkdir ./nodejs

echo "Moving files..."
cp package*.json nodejs/ && cd nodejs/ && npm ci --production
cp -r ../dist ./node_modules/AppLayer
cd ../

echo "Moving files a app-layer..."
mkdir ../app-layer
cp -r ./nodejs ../app-layer

echo "Limpiando directorios..."
rm -r ./nodejs
rm -r ./dist
echo "Done"