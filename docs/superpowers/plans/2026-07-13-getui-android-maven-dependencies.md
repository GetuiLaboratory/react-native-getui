# Getui Android Maven Dependencies Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the bundled Getui Android SDK JAR files with the requested Maven dependencies.

**Architecture:** The Android library module will resolve Getui SDK artifacts from its existing Getui releases repository. Explicit `implementation` coordinates replace the generic local JAR file tree, so dependency versions are visible and managed by Gradle.

**Tech Stack:** Gradle Groovy DSL, Android library plugin, Getui Maven repository

## Global Constraints

- Only the Android library module may change.
- Use `com.getui:gtsdk:3.3.15.0`.
- Use `com.getui:gtc:3.3.3.0`.
- Keep `https://mvn.getui.com/nexus/content/repositories/releases/` as the Getui artifact repository.
- Do not change example applications, iOS code, HarmonyOS code, or Java sources.

---

### Task 1: Replace Local Getui JARs With Maven Dependencies

**Files:**
- Modify: `android/build.gradle:20`
- Delete: `android/libs/gtsdk-3.3.12.0.jar`
- Delete: `android/libs/gtc-3.2.18.0.jar`

**Interfaces:**
- Consumes: Gradle artifact resolution through the existing module-level `repositories` block.
- Produces: Compile-time Android dependencies `com.getui:gtsdk:3.3.15.0` and `com.getui:gtc:3.3.3.0`.

- [ ] **Step 1: Run the pre-change assertions**

Run:

```bash
test -f android/libs/gtsdk-3.3.12.0.jar \
  && test -f android/libs/gtc-3.2.18.0.jar \
  && rg -q 'implementation fileTree' android/build.gradle \
  && ! rg -q 'com\.getui:gtsdk:3\.3\.15\.0' android/build.gradle \
  && ! rg -q 'com\.getui:gtc:3\.3\.3\.0' android/build.gradle
```

Expected: exit status `0`, proving the repository is still in the old state.

- [ ] **Step 2: Replace the dependency declarations**

Change the beginning of the `dependencies` block to:

```gradle
dependencies {
    implementation 'com.getui:gtsdk:3.3.15.0'  // 个推SDK
    implementation 'com.getui:gtc:3.3.3.0'  // 个推核心组件
    implementation "com.facebook.react:react-native:+"  // From node_modules
```

Do not add another Getui Maven repository because the required URL already exists at `android/build.gradle:22`.

- [ ] **Step 3: Delete the obsolete local artifacts**

Run:

```bash
rm android/libs/gtsdk-3.3.12.0.jar android/libs/gtc-3.2.18.0.jar
```

Expected: both tracked JAR files are removed.

- [ ] **Step 4: Run static post-change assertions**

Run:

```bash
test ! -e android/libs/gtsdk-3.3.12.0.jar \
  && test ! -e android/libs/gtc-3.2.18.0.jar \
  && ! rg -q 'implementation fileTree' android/build.gradle \
  && rg -q "implementation 'com\.getui:gtsdk:3\.3\.15\.0'" android/build.gradle \
  && rg -q "implementation 'com\.getui:gtc:3\.3\.3\.0'" android/build.gradle \
  && rg -q 'https://mvn\.getui\.com/nexus/content/repositories/releases/' android/build.gradle
```

Expected: exit status `0`.

- [ ] **Step 5: Resolve the Android library dependencies**

Create `/tmp/react-native-getui-local.init.gradle` with:

```gradle
gradle.settingsEvaluated { settings ->
    settings.project(':react-native-getui').projectDir =
        new File(settings.settingsDir, '../../../android')
}
```

Then run:

```bash
example/AndroidDemo/android/gradlew \
  -p example/AndroidDemo/android \
  -I /tmp/react-native-getui-local.init.gradle \
  :react-native-getui:dependencies \
  --configuration debugCompileClasspath
```

Expected: exit status `0`, with `com.getui:gtsdk:3.3.15.0` and `com.getui:gtc:3.3.3.0` present in the dependency report for the current checkout.

- [ ] **Step 6: Review the final diff**

Run:

```bash
git diff --check
git diff -- android/build.gradle
git status --short
```

Expected: no whitespace errors; only `android/build.gradle`, the two deleted JARs, and this plan-related work are relevant to the migration. Existing untracked `node_modules` directories remain untouched.

- [ ] **Step 7: Commit the implementation**

Run:

```bash
git add android/build.gradle android/libs/gtsdk-3.3.12.0.jar android/libs/gtc-3.2.18.0.jar
git commit -m "build: use getui android maven dependencies"
```

Expected: one implementation commit containing the Gradle change and both JAR deletions.
