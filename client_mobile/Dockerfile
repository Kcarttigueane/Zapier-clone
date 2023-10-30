FROM reactnativecommunity/react-native-android

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npx react-native bundle --platform android --dev false --entry-file index.js \
--bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res


RUN rm -rf android/app/src/main/res/drawable* && rm -rf android/app/src/main/res/raw && rm -rf android/app/src/main/res/mipmap*

RUN cd android && ./gradlew assembleRelease