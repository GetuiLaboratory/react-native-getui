# Getui Android Maven Dependency Migration

## Scope

Only the Android library module is changed. Example applications, iOS code, HarmonyOS code, and Java sources remain unchanged.

## Dependency Changes

- Delete `android/libs/gtsdk-3.3.12.0.jar`.
- Delete `android/libs/gtc-3.2.18.0.jar`.
- Remove the `fileTree` dependency from `android/build.gradle`, because these are the only JAR files in `android/libs`.
- Add `com.getui:gtsdk:3.3.15.0` as an `implementation` dependency.
- Add `com.getui:gtc:3.3.3.0` as an `implementation` dependency.

## Repository Configuration

Keep the existing Getui releases repository in the Android library module:

```gradle
maven {
    url "https://mvn.getui.com/nexus/content/repositories/releases/"
}
```

No duplicate repository entry is required.

## Verification

- Confirm the old JAR files and their version strings are absent.
- Confirm both Maven coordinates are present in `android/build.gradle`.
- Run an available Gradle dependency-resolution or build task for the Android module.

