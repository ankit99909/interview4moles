#!/bin/bash

# Check if the correct number of arguments is provided
if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <path_to_project>"
  exit 1
fi

# Navigate to the project directory
project_path=$1
cd "$project_path"

# Check if the project directory exists
if [ ! -d "android" ]; then
  echo "Error: Invalid React Native project directory."
  exit 1
fi

# Navigate to the android directory
cd android

# Make the Gradle wrapper executable
chmod +x gradlew

# Build the release bundle
./gradlew bundleRelease

# Check if the build was successful
if [ $? -eq 0 ]; then
  echo "Release bundle created successfully."
else
  echo "Error: Failed to create release bundle."
  exit 1
fi

# Build the release APK from the bundle
./gradlew assembleRelease

# Check if the build was successful
if [ $? -eq 0 ]; then
  echo "Release APK created successfully."
else
  echo "Error: Failed to create release APK."
  exit 1
fi

# Print the path to the generated APK
release_apk_path="app/build/outputs/apk/release/app-release.apk"
echo "Release APK location: $project_path/$release_apk_path"
