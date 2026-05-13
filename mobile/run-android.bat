@echo off
SET "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot"
SET "ANDROID_HOME=C:\Users\silve\AppData\Local\Android\Sdk"
SET "ANDROID_SDK_ROOT=C:\Users\silve\AppData\Local\Android\Sdk"
SET "PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\emulator;%PATH%"

echo [OpenPrimer] Starting Android Emulator (Pixel_7a)...
start "" "%ANDROID_HOME%\emulator\emulator.exe" -avd Pixel_7a -no-snapshot-load

echo [OpenPrimer] Waiting for device to be ready...
"%ANDROID_HOME%\platform-tools\adb.exe" wait-for-device

echo [OpenPrimer] Launching Expo project...
npm run android
