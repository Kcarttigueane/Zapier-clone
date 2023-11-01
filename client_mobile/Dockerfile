FROM reactnativecommunity/react-native-android

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY package.json .

RUN npm install

COPY . .

RUN mkdir -p android/app/src/main/assets

RUN npx react-native bundle --platform android --dev false --entry-file index.js \
--bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

RUN rm -rf android/app/src/main/res/raw && rm -rf android/app/src/main/res/mipmap*/ && rm -rf android/app/src/main/res/drawable*/

COPY android/app/src/main/res/ android/app/src/main/res/

RUN echo fs.inotify.max_user_watches=524288 | tee -a /etc/sysctl.conf && sysctl -p

RUN cd android && ./gradlew assembleRelease

RUN mkdir -p /build

CMD ["cp", "android/app/build/outputs/apk/release/app-release.apk", "/build/app-release.apk"]