# Bigkas — Technical Documentation

> Complete variable reference for every screen and context provider.  
> Use this when building the **web version** — variable names, types, and sources are identical.

---

## Table of Contents

1. [Design System Tokens](#1-design-system-tokens)
2. [Auth Context (Global State)](#2-auth-context-global-state)
3. [Session Context (Global State)](#3-session-context-global-state)
4. [Screen-by-Screen Variable Reference](#4-screen-by-screen-variable-reference)
   - [LoginScreen](#41-loginscreen)
   - [RegisterScreen](#42-registerscreen)
   - [NicknameScreen](#43-nicknamescreen)
   - [DashboardScreen](#44-dashboardscreen)
   - [PracticeScreen](#45-practicescreen)
   - [HistoryScreen](#46-historyscreen)
   - [SessionDetailScreen](#47-sessiondetailscreen)
   - [SessionResultScreen](#48-sessionresultscreen)
   - [DetailedFeedbackScreen](#481-detailedfeedbackscreen)
   - [AudioCameraTestScreen](#482-audiocameratestscreen)
   - [ProfileScreen](#49-profilescreen)
   - [EditProfileScreen](#410-editprofilescreen)
   - [ProgressScreen](#411-progressscreen)
   - [ScriptsScreen](#412-scriptsscreen)
   - [SettingsScreen](#413-settingsscreen)
   - [TrainingSetupScreen](#414-trainingsetupscreen)
   - [GenerateScriptScreen](#415-generatescriptscreen)
   - [TrainingScriptedScreen](#416-trainingscriptedscreen)
   - [ChangePasswordScreen](#417-changepasswordscreen)
   - [AccountSettingsScreen](#418-accountsettingsscreen)
5. [Reusable Component Props](#5-reusable-component-props)
5b. [API Modules](#5b-api-modules)
6. [Utility Functions](#6-utility-functions)
7. [Navigation Map](#7-navigation-map)

---

## 1. Design System Tokens

### Colors (`src/styles/colors.js`)

| Token            | Value                  | Usage                         |
| ---------------- | ---------------------- | ----------------------------- |
| `primary`        | `#FBAF00`              | Brand yellow — buttons, accents |
| `background`     | `#F5F5F5`              | Page background               |
| `black`          | `#010101`              | Dark elements, hero card bg   |
| `secondary`      | `#010101`              | Alias of black                |
| `white`          | `#FFFFFF`              | Cards, input backgrounds      |
| `textPrimary`    | `#010101`              | Default text                  |
| `textSecondary`  | `rgba(1,1,1,0.6)`     | 60% opacity black text        |
| `textInverse`    | `#FFFFFF`              | Text on dark backgrounds      |
| `border`         | `#E0E0E0`              | Input / card borders          |
| `error`          | `#FF3B30`              | Validation errors             |
| `success`        | `#34C759`              | Positive score / success      |
| `warning`        | `#FF9500`              | Medium score                  |
| `gray200`        | `#E5E5E5`              | Progress bar bg               |

### Typography (`src/styles/typography.js`)

| Variant      | Font            | Size | Weight  |
| ------------ | --------------- | ---- | ------- |
| `h1`         | Inter-Bold      | 32   | 700     |
| `h2`         | Inter-Bold      | 24   | 700     |
| `h3`         | Inter-Bold      | 20   | 700     |
| `h4`         | Inter-Medium    | 18   | 500     |
| `body`       | Inter-Regular   | 16   | 400     |
| `bodySmall`  | Inter-Regular   | 14   | 400     |
| `caption`    | Inter-Regular   | 12   | 400     |
| `display`    | Inter-Bold      | 48   | 700     |

### Spacing (`src/styles/spacing.js`)

| Token   | Value | Usage              |
| ------- | ----- | ------------------ |
| `xs`    | 4     | Minimal gap        |
| `sm`    | 8     | Small gap          |
| `md`    | 16    | Standard padding   |
| `lg`    | 24    | Section padding    |
| `xl`    | 32    | Large spacing      |
| `xxl`   | 48    | Extra large        |
| `xxxl`  | 64    | Hero-level spacing |

#### Border Radius

| Token   | Value |
| ------- | ----- |
| `sm`    | 4     |
| `md`    | 8     |
| `lg`    | 12    |
| `xl`    | 16    |
| `full`  | 9999  |

---

## 2. Auth Context (Global State)

**File**: `src/context/AuthContext.jsx`  
**Hook**: `useAuth()` (from `src/hooks/useAuth.js`)

### State Shape

| Variable          | Type      | Default   | Description                                |
| ----------------- | --------- | --------- | ------------------------------------------ |
| `user`            | `object \| null` | `null` | Current authenticated user object        |
| `isLoading`       | `boolean` | `true`    | Auth operation in progress                 |
| `isAuthenticated` | `boolean` | `false`   | Whether user is logged in                  |
| `error`           | `string \| null` | `null` | Last auth error message                  |

### User Object Shape

| Property    | Type              | Description                         |
| ----------- | ----------------- | ----------------------------------- |
| `id`        | `string`          | Unique user ID                      |
| `name`      | `string`          | Full display name                   |
| `email`     | `string`          | User email address                  |
| `nickname`  | `string \| null`  | Optional display alias              |
| `avatar_url`| `string \| null`  | Avatar image URL                    |
| `createdAt` | `string`          | ISO 8601 timestamp                  |

### Actions / Methods

| Method                      | Signature                                     | Description                                    |
| --------------------------- | --------------------------------------------- | ---------------------------------------------- |
| `login`                     | `(email: string, password: string) → Promise<{success, error?}>` | Authenticate user                |
| `register`                  | `(userData: {name, email, password}) → Promise<{success, error?}>` | Create new account           |
| `logout`                    | `() → Promise<void>`                          | Clear session from state + AsyncStorage        |
| `clearError`                | `() → void`                                   | Reset error to null                            |
| `updateNickname`            | `(nickname: string) → Promise<{success, error?}>` | Set/update user nickname                  |

### Reducer Action Types

| Action Type        | Payload                     | Effect                           |
| ------------------ | --------------------------- | -------------------------------- |
| `SET_LOADING`      | `boolean`                   | Toggle loading state             |
| `LOGIN_SUCCESS`    | `{ user }`                  | Set user, isAuthenticated=true   |
| `LOGOUT`           | —                           | Reset all to initial             |
| `SET_ERROR`        | `string`                    | Set error, isLoading=false       |
| `CLEAR_ERROR`      | —                           | Clear error                      |
| `RESTORE_SESSION`  | `{ user }`                  | Rehydrate from AsyncStorage      |
| `UPDATE_PROFILE`   | `user` (full updated user)  | Replace user object              |

---

## 3. Session Context (Global State)

**File**: `src/context/SessionContext.jsx`  
**Hook**: `useSessions()` (from `src/hooks/useSessions.js`)

### State Shape

| Variable         | Type                   | Default                              | Description                              |
| ---------------- | ---------------------- | ------------------------------------ | ---------------------------------------- |
| `sessions`       | `Session[]`            | `[]`                                 | Array of past practice sessions          |
| `currentSession` | `Session \| null`      | `null`                               | Active/viewed session                    |
| `practiceWords`  | `PracticeWord[]`       | `[]`                                 | Words available for practice             |
| `practicePhrases`| `PracticePhrase[]`     | `[]`                                 | Phrases available for practice           |
| `isLoading`      | `boolean`              | `false`                              | Data fetch in progress                   |
| `error`          | `string \| null`       | `null`                               | Last session error                       |
| `pagination`     | `Pagination`           | `{ page: 1, total: 0, hasMore: true }` | Pagination metadata for session list  |

### Session Object Shape

| Property      | Type          | Description                               |
| ------------- | ------------- | ----------------------------------------- |
| `id`          | `string`      | Unique session ID                         |
| `targetText`  | `string`      | Word/phrase that was practiced             |
| `translation` | `string`      | English translation                       |
| `score`       | `number`      | Final pronunciation score (0–1)           |
| `duration`    | `number`      | Session duration in seconds               |
| `attempts`    | `number`      | Number of recording attempts              |
| `difficulty`  | `string`      | `'easy'` \| `'medium'` \| `'hard'`       |
| `feedback`    | `string`      | AI pronunciation feedback text            |
| `createdAt`   | `string`      | ISO 8601 timestamp                        |

### PracticeWord Object Shape

| Property      | Type     | Description                               |
| ------------- | -------- | ----------------------------------------- |
| `text`        | `string` | Filipino word to pronounce                |
| `translation` | `string` | English translation                       |
| `difficulty`  | `string` | `'easy'` \| `'medium'` \| `'hard'`       |

### Pagination Object Shape

| Property  | Type      | Description                |
| --------- | --------- | -------------------------- |
| `page`    | `number`  | Current page number        |
| `total`   | `number`  | Total count of sessions    |
| `hasMore` | `boolean` | More pages available       |

### Actions / Methods

| Method              | Signature                                                          | Description                           |
| ------------------- | ------------------------------------------------------------------ | ------------------------------------- |
| `fetchSessions`     | `(page?: number, refresh?: boolean) → Promise<{success, error?}>`  | Fetch session list (page 1 = refresh) |
| `loadMoreSessions`  | `() → Promise<void>`                                              | Fetch next page of sessions           |
| `fetchSessionById`  | `(sessionId: string) → Promise<{success, session?, error?}>`      | Fetch single session detail           |
| `uploadAudio`       | `({audioUri, targetText, language}) → Promise<{success, session?}>`| Upload recording, create session      |
| `fetchPracticeWords`| `() → Promise<{success, error?}>`                                 | Fetch available practice words        |
| `clearCurrentSession`| `() → void`                                                      | Reset currentSession to null          |
| `reset`             | `() → void`                                                       | Reset entire session state            |

### Reducer Action Types

| Action Type          | Payload                           | Effect                              |
| -------------------- | --------------------------------- | ----------------------------------- |
| `SET_LOADING`        | `boolean`                         | Toggle loading state                |
| `SET_SESSIONS`       | `{ sessions, page, total }`       | Replace session list                |
| `APPEND_SESSIONS`    | `{ sessions, page, total }`       | Append to existing list             |
| `SET_CURRENT_SESSION`| `Session`                         | Set active session                  |
| `SET_PRACTICE_WORDS` | `PracticeWord[]`                  | Set practice word list              |
| `SET_PRACTICE_PHRASES`| `PracticePhrase[]`               | Set practice phrase list            |
| `ADD_SESSION`        | `Session`                         | Prepend new session                 |
| `REMOVE_SESSION`     | `string` (session ID)             | Remove from list by ID              |
| `SET_ERROR`          | `string`                          | Set error message                   |
| `CLEAR_ERROR`        | —                                 | Clear error                         |
| `RESET`              | —                                 | Reset to initialState               |

---

## 4. Screen-by-Screen Variable Reference

---

### 4.1 LoginScreen

**File**: `src/screens/Auth/LoginScreen.jsx`  
**Route**: `Login` (inside AuthNavigator stack)

#### Hook Destructuring

```js
const { login, isLoading, error, clearError } = useAuth();
```

#### State Variables

| Variable           | Type                         | Initial Value | Description                          |
| ------------------ | ---------------------------- | ------------- | ------------------------------------ |
| `email`            | `string`                     | `''`          | Email input value                    |
| `password`         | `string`                     | `''`          | Password input value                 |
| `validationErrors` | `{ email?: string, password?: string }` | `{}` | Client-side validation error map |
| `verificationExpanded` | `boolean`                | `false`       | Controls email verification card collapse/expand state |

#### From Hooks

| Variable     | Source       | Type               | Description                     |
| ------------ | ------------ | ------------------ | ------------------------------- |
| `login`      | `useAuth()`  | `function`         | Trigger login API call          |
| `isLoading`  | `useAuth()`  | `boolean`          | Shows spinner on button         |
| `error`      | `useAuth()`  | `string \| null`   | Server-side error message       |
| `clearError` | `useAuth()`  | `function`         | Dismiss server error            |

#### Handlers

| Handler             | Trigger                        | Action                                            |
| ------------------- | ------------------------------ | ------------------------------------------------- |
| `validate()`        | Called inside `handleLogin`    | Validates email format and non-empty password; sets `validationErrors` |
| `handleLogin()`     | "Log In" button press          | Calls `clearError()`, validates, then `login(email, password)` |
| `handleGoogleLogin()` | Google social button press   | Placeholder — Alert for Google OAuth status       |
| `handleResendVerificationEmail()` | Resend button in expanded verification card | Sets `resendLoading`, calls `resendVerificationEmail()` |

#### Email Verification UI (Pending Verification State)

When `pendingEmailVerification = true`:
- **Collapsed State** (default): Compact bar showing mail icon + "Email Verification Pending" text + chevron-down
  - Only spans minimal vertical space on screen
  - Background: Warning color with 9% opacity (`${colors.warning}15`)
  - Border-left: 4px warning accent for visual emphasis
  
- **Expanded State** (on tap): Shows full details
  - Displays pending email address
  - Shows verification instructions
  - "Resend Email" button appears
  - Chevron changes to chevron-up to indicate expandable state
  - Automatically collapses when user taps elsewhere or logs in

#### Navigation Actions

| Action                 | Destination        |
| ---------------------- | ------------------ |
| `navigation.navigate('Register')` | RegisterScreen |
| `navigation.navigate('ForgotPassword')` | ForgotPasswordScreen |

#### Validation Logic

- `isValidEmail(email)` — imported from `src/utils/validators.js`
- `email.trim()` — checks non-empty
- `!password` — checks non-empty

---

### 4.2 RegisterScreen

**File**: `src/screens/Auth/RegisterScreen.jsx`  
**Route**: `Register` (inside AuthNavigator stack)

#### Hook Destructuring

```js
const { register, isLoading, error, clearError } = useAuth();
```

#### State Variables

| Variable           | Type     | Initial Value | Description                      |
| ------------------ | -------- | ------------- | -------------------------------- |
| `formData`         | `object` | (see below)   | All form field values            |
| `validationErrors` | `object` | `{}`          | Per-field validation errors      |

#### `formData` Shape

| Key               | Type     | Initial | Description                  |
| ----------------- | -------- | ------- | ---------------------------- |
| `firstName`       | `string` | `''`    | First name input             |
| `lastName`        | `string` | `''`    | Last name input              |
| `email`           | `string` | `''`    | Email input                  |
| `password`        | `string` | `''`    | Password input               |
| `confirmPassword` | `string` | `''`    | Confirm password input       |

#### `validationErrors` Keys

| Key               | Message Examples                           |
| ----------------- | ------------------------------------------ |
| `firstName`       | `'First name is required'`                 |
| `lastName`        | `'Last name is required'`                  |
| `email`           | `'Email is required'`, `'Please enter a valid email'` |
| `password`        | Dynamic from `validatePassword()` result   |
| `confirmPassword` | `'Passwords do not match'`                 |

#### From Hooks

| Variable     | Source       | Type             | Description                    |
| ------------ | ------------ | ---------------- | ------------------------------ |
| `register`   | `useAuth()`  | `function`       | Trigger register API call      |
| `isLoading`  | `useAuth()`  | `boolean`        | Shows spinner on button        |
| `error`      | `useAuth()`  | `string \| null` | Server-side error              |
| `clearError` | `useAuth()`  | `function`       | Dismiss server error           |

#### Handlers

| Handler              | Trigger                    | Action                                             |
| -------------------- | -------------------------- | -------------------------------------------------- |
| `updateField(field, value)` | Any input change    | Updates `formData[field]`, clears matching validation error |
| `validate()`         | Called in `handleRegister`  | Validates all fields; sets `validationErrors`      |
| `handleRegister()`   | "Create Account" press     | Clears error, validates, then calls `register({ name, email, password })` |

#### Navigation Actions

| Action                       | Destination      |
| ---------------------------- | ---------------- |
| `navigation.goBack()`       | Back to Login    |

#### Validation Functions Used

- `isNotEmpty(value)` — from `src/utils/validators.js`
- `isValidEmail(email)` — from `src/utils/validators.js`
- `validatePassword(password)` — from `src/utils/validators.js` (returns `{ isValid, message }`)

---

### 4.3 NicknameScreen

**File**: `src/screens/Onboarding/NicknameScreen.jsx`  
**Route**: `Nickname` (AppNavigator — shown when user has no nickname)

#### Hook Destructuring

```js
const { updateNickname, isLoading } = useAuth();
```

#### State Variables

| Variable   | Type     | Initial Value | Description                  |
| ---------- | -------- | ------------- | ---------------------------- |
| `nickname` | `string` | `''`          | Nickname text input value    |
| `error`    | `string` | `''`          | Local validation error text  |

#### From Hooks

| Variable         | Source       | Type       | Description                         |
| ---------------- | ------------ | ---------- | ----------------------------------- |
| `updateNickname` | `useAuth()`  | `function` | Updates user.nickname in context + storage |
| `isLoading`      | `useAuth()`  | `boolean`  | Shows spinner on Continue button    |

#### Handlers

| Handler           | Trigger              | Action                                                     |
| ----------------- | -------------------- | ---------------------------------------------------------- |
| `handleContinue()` | "Continue" press    | Clears local error, calls `updateNickname(nickname)`, sets error if failed |

#### Navigation

- No manual navigation — `AppNavigator` automatically routes to Main when nickname is set.

---

### 4.4 DashboardScreen

**File**: `src/screens/Main/DashboardScreen.jsx`  
**Route**: `Dashboard` (BottomTabNavigator — centre tab)

#### Hook Destructuring

```js
const { user } = useAuth();
const { sessions, isLoading, fetchSessions } = useSessions();
```

#### State Variables

| Variable | Type                              | Initial Value | Description                                |
| -------- | --------------------------------- | ------------- | ------------------------------------------ |
| `quote`  | `{ text: string, author: string}` | Fallback quote | Daily motivational quote from ZenQuotes API |

#### Derived Variables

| Variable       | Type     | Derivation                                        | Description                      |
| -------------- | -------- | ------------------------------------------------- | -------------------------------- |
| `displayName`  | `string` | `user?.nickname \|\| user?.name \|\| 'Speaker'`   | Greeting name shown on dashboard |
| `greeting`     | `string` | Based on `new Date().getHours()` via `useMemo`    | `'Good morning,'` / `'Good afternoon,'` / `'Good evening,'` |
| `todayCount`   | `number` | `sessions?.length \|\| 0`                         | Daily session count              |
| `averageScore` | `number` | `84` (hardcoded placeholder)                      | Average score stat               |
| `streakCount`  | `number` | `3` (hardcoded placeholder)                       | Streak days stat                 |
| `tip`          | `{ title: string, body: string }` | `getDailyTip()` via `useMemo` | Rotates daily from curated list |

#### External APIs

| API            | Endpoint                         | Docs                        | Purpose                              |
| -------------- | -------------------------------- | --------------------------- | -----------------------------------  |
| **ZenQuotes**  | `https://zenquotes.io/api/today` | https://docs.zenquotes.io   | Fetches one daily motivational quote |

> Fallback: if the API is unreachable, a hardcoded Churchill quote is shown.

#### Daily Tip Source

The "Tip of the Day" rotates from a built-in curated list of 10 speaking tips.  
The index is derived deterministically from the day-of-year (`dayOfYear % tips.length`),  
so the same tip shows all day and changes at midnight.

#### From Hooks

| Variable        | Source           | Type         | Description                  |
| --------------- | ---------------- | ------------ | ---------------------------- |
| `user`          | `useAuth()`      | `object`     | Current user object          |
| `sessions`      | `useSessions()`  | `Session[]`  | Session list for stats       |
| `isLoading`     | `useSessions()`  | `boolean`    | Pull-to-refresh indicator    |
| `fetchSessions` | `useSessions()`  | `function`   | Load/refresh session list    |

#### Handlers

| Handler                | Trigger                   | Action                              |
| ---------------------- | ------------------------- | ----------------------------------- |
| `handleRefresh()`      | Pull-to-refresh           | `fetchSessions(1, true)` + re-fetch quote |
| `handleStartPractice()`| "Start Practice" press    | `navigation.navigate('Practice')`   |
| `handleStartTraining()`| "Start Training" press    | `navigation.navigate('Practice')`   |

#### UI Sections (top → bottom)

| Section          | Content                                                          |
| ---------------- | ---------------------------------------------------------------- |
| Top Row          | `BrandLogo` + profile circle icon button                         |
| Greeting         | Italic greeting (primary colour) + bold `displayName`            |
| Hero Card        | Black bg card with "Ready to speak?" + Start Practice / Training |
| Stats Row        | `todayCount` · `averageScore` · `streakCount` (yellow dividers)  |
| Motivation Card  | Daily quote from ZenQuotes API (italic text + author)            |
| Tip of the Day   | Bold tip title + descriptive body (rotates daily)                |

#### Bottom Tab Navigation

| Tab Order | Route      | Icon (Ionicons)         | Screen         |
| --------- | ---------- | ----------------------- | -------------- |
| 1         | Scripts    | `document-text-outline` | ScriptsScreen  |
| 2         | Progress   | `stats-chart-outline`   | ProgressScreen |
| 3 (centre)| Dashboard  | `home-outline`          | DashboardScreen|
| 4         | Profile    | `person-outline`        | ProfileScreen  |
| 5         | Settings   | `settings-outline`      | SettingsScreen |

- **No labels** — icon-only tabs  
- Active icon colour: `#010101` (black)  
- Inactive icon colour: `rgba(1,1,1,0.45)` (textMuted)  
- Centre Home icon is slightly larger (28px vs 24px)

---

### 4.5 PracticeScreen

**File**: `src/screens/Main/PracticeScreen.jsx`  
**Route**: `Practice` (BottomTabNavigator — second tab)

#### Hook Destructuring

```js
const { practiceWords, fetchPracticeWords, uploadAudio, isLoading } = useSessions();
```

#### State Variables

| Variable           | Type      | Initial Value | Description                           |
| ------------------ | --------- | ------------- | ------------------------------------- |
| `currentWordIndex` | `number`  | `0`           | Index into `practiceWords` array      |
| `isRecording`      | `boolean` | `false`       | Whether microphone is active          |
| `isProcessing`     | `boolean` | `false`       | Whether audio analysis is running     |
| `audioLevel`       | `number`  | `0`           | Current mic level (0–1) for visualizer|

#### Derived Variables

| Variable      | Type           | Derivation                                             | Description                     |
| ------------- | -------------- | ------------------------------------------------------ | ------------------------------- |
| `currentWord` | `PracticeWord` | `practiceWords[currentWordIndex] \|\| { text: 'Kumusta', translation: 'Hello / How are you?', difficulty: 'easy' }` | Active word to practice |

#### From Hooks

| Variable             | Source           | Type         | Description                     |
| -------------------- | ---------------- | ------------ | ------------------------------- |
| `practiceWords`      | `useSessions()`  | `PracticeWord[]` | Available words             |
| `fetchPracticeWords` | `useSessions()`  | `function`   | Load words from API             |
| `uploadAudio`        | `useSessions()`  | `function`   | Submit recording for scoring    |
| `isLoading`          | `useSessions()`  | `boolean`    | Loading indicator               |

#### Handlers

| Handler              | Trigger                    | Action                                                                     |
| -------------------- | -------------------------- | -------------------------------------------------------------------------- |
| `handleRecordPress()`| Record button press        | Toggles `isRecording`; on stop → sets `isProcessing`, navigates to result  |
| `handleSkip()`       | "Skip" button press        | Increments `currentWordIndex` (wraps to 0)                                |
| `handlePrevious()`   | "Previous" button press    | Decrements `currentWordIndex` (min 0)                                     |

#### Navigation Actions

| Action                                           | Destination          |
| ------------------------------------------------ | -------------------- |
| `navigation.navigate('TrainingScripted', { scriptId, focusMode, scriptType, autoStart, entryPoint })` | TrainingScriptedScreen |

#### Components Used

| Component             | Props                        | Description                |
| --------------------- | ---------------------------- | -------------------------- |
| `AudioRecordButton`   | `isRecording`, `onPress`, `isProcessing` | Mic record toggle |
| `AudioLevelIndicator` | `level`, `isActive`          | Audio waveform visualizer  |

---

### 4.6 HistoryScreen

**File**: `src/screens/Main/HistoryScreen.jsx`  
**Route**: `History` (BottomTabNavigator — third tab)

#### Hook Destructuring

```js
const { sessions, isLoading, fetchSessions, loadMoreSessions, pagination } = useSessions();
```

#### From Hooks

| Variable           | Source           | Type         | Description                       |
| ------------------ | ---------------- | ------------ | --------------------------------- |
| `sessions`         | `useSessions()`  | `Session[]`  | Array rendered in FlatList        |
| `isLoading`        | `useSessions()`  | `boolean`    | Refresh / load-more indicator     |
| `fetchSessions`    | `useSessions()`  | `function`   | Fetch first page or refresh       |
| `loadMoreSessions` | `useSessions()`  | `function`   | Infinite scroll next page         |
| `pagination`       | `useSessions()`  | `Pagination` | `{ page, total, hasMore }`        |

#### Handlers

| Handler              | Trigger                       | Action                                  |
| -------------------- | ----------------------------- | --------------------------------------- |
| `handleRefresh()`    | Pull-to-refresh               | `fetchSessions(1, true)`               |
| `handleLoadMore()`   | FlatList `onEndReached`       | Calls `loadMoreSessions()` if `hasMore && !isLoading` |
| `handleSessionPress(session)` | Session card tap     | `navigation.navigate('SessionDetail', { sessionId: session.id })` |

#### Render Helpers

| Helper               | Description                                   |
| -------------------- | --------------------------------------------- |
| `renderSessionItem({ item })` | Renders single session Card with score badge |
| `renderEmptyState()` | Shows "No Sessions Yet" placeholder message   |
| `renderFooter()`     | Shows "Loading more..." text during pagination|

#### Item Display Fields

| Field from `item`     | Displayed As                  |
| --------------------- | ----------------------------- |
| `item.targetText`     | Session card title            |
| `item.score`          | Score badge (via `formatScore`) |
| `item.createdAt`      | Date/time (via `formatDate`)  |
| `item.duration`       | Duration in seconds suffix    |

---

### 4.7 SessionDetailScreen

**File**: `src/screens/Session/SessionDetailScreen.jsx`  
**Route**: `SessionDetail` (MainNavigator stack)

#### Route Params

| Param       | Type     | Description                      |
| ----------- | -------- | -------------------------------- |
| `sessionId` | `string` | ID of the session to fetch       |

#### Hook Destructuring

```js
const { currentSession, fetchSessionById, isLoading, clearCurrentSession } = useSessions();
```

#### From Hooks

| Variable              | Source           | Type              | Description                        |
| --------------------- | ---------------- | ----------------- | ---------------------------------- |
| `currentSession`      | `useSessions()`  | `Session \| null` | Fetched session data               |
| `fetchSessionById`    | `useSessions()`  | `function`        | Fetches session by `sessionId`     |
| `isLoading`           | `useSessions()`  | `boolean`         | Loading spinner state              |
| `clearCurrentSession` | `useSessions()`  | `function`        | Cleanup on unmount                 |

#### Displayed Session Fields

| Field                       | Format                 | Section            |
| --------------------------- | ---------------------- | ------------------ |
| `currentSession.createdAt`  | `formatDate(_, 'datetime')` | Header subtitle |
| `currentSession.score`      | `formatScore()`        | Score Card (large) |
| `currentSession.targetText` | Raw string             | Word/Phrase Card   |
| `currentSession.translation`| Raw string (optional)  | Word/Phrase Card   |
| `currentSession.duration`   | `formatDuration()`     | Details Card       |
| `currentSession.attempts`   | Number (default: 1)    | Details Card       |
| `currentSession.difficulty` | String (default: 'Standard') | Details Card |
| `currentSession.feedback`   | Raw string (optional)  | Feedback Card      |

#### Handlers

| Handler               | Trigger                 | Action                             |
| --------------------- | ----------------------- | ---------------------------------- |
| `handleGoBack()`      | "Go Back" button        | `navigation.goBack()`             |
| `handlePracticeAgain()` | "Practice Again" button | `navigation.navigate('Practice')`|

#### Lifecycle

- `useEffect` on mount: calls `fetchSessionById(sessionId)`
- `useEffect` cleanup: calls `clearCurrentSession()`

---

### 4.8 SessionResultScreen

**File**: `src/screens/Session/SessionResultScreen.jsx`  
**Route**: `SessionResult` (MainNavigator stack)

#### Route Params

| Param             | Type     | Description                           |
| ----------------- | -------- | ------------------------------------- |
| `confidenceScore` | `number` | Vocal confidence score (0–100)        |
| `summary`         | `string` | Summary message under the score       |
| `pitchStability`  | `string` | Pitch stability badge text            |
| `paceWpm`          | `number` | Speaking pace in WPM                  |
| `paceRating`      | `string` | Speaking pace badge text              |
| `resultMode`      | `string` | `'training'` \| `'practice'`        |
| `trainingParams`  | `object` | Params to restart training session    |

#### Derived Variables

No local state — all data comes from route params.

#### UI Sections

| Section            | Content                                         |
| ------------------ | ----------------------------------------------- |
| Header             | Back button + "Analysis Result" title          |
| Score block        | Score number, `/100`, and summary text          |
| Pitch Stability    | Waveform strip + `pitchStability` badge         |
| Speaking Pace      | WPM value + `paceRating` badge + pace bar       |
| Actions            | "Practice Again" and "Cancel" buttons          |

#### Analysis Cards (UI)

| Card            | Description                              |
| --------------- | ---------------------------------------- |
| Pitch Stability | Waveform + `pitchStability` badge        |
| Speaking Pace   | `paceWpm` + `paceRating` badge + progress |

#### Handlers

| Handler               | Trigger                | Action                              |
| --------------------- | ---------------------- | ----------------------------------- |
| `handlePracticeAgain()` | "Practice Again" press | `navigate('Practice')` when `resultMode = 'practice'`; otherwise `goBack()` or `navigate('TrainingSetup')` |
| `handleCancel()`      | "Cancel" press        | `navigation.navigate('Dashboard')` |
| `handleGoBack()`      | Back arrow press       | `navigation.goBack()` or Dashboard |
| `handleViewDetailedFeedback()` | "View Detailed Feedback" press | `navigation.navigate('DetailedFeedback', params)` |

---

### 4.8.1 DetailedFeedbackScreen

**File**: `src/screens/Session/DetailedFeedbackScreen.jsx`  
**Route**: `DetailedFeedback` (MainNavigator stack)

#### Layout

1. Back button
2. "Detailed Feedback" title
3. Performance flow timeline card + legend
4. Metrics cards (Eye Contact, Body Gestures, Voice)
5. Feedback list cards with timestamps
6. "Train Again" / "Practice Again" button + Cancel

#### Route Params

| Param            | Type     | Description                           |
| ---------------- | -------- | ------------------------------------- |
| `resultMode`     | `string` | `'training'` \| `'practice'`         |
| `trainingParams` | `object` | Params to restart training session     |
| `timelinePoints` | `Array<{time: string, value: number}>` | Timeline points for chart      |
| `eyeContact`     | `{ score: number, status: string, note: string }` | Eye contact metric      |
| `bodyGestures`   | `{ status: string, note: string }` | Body gesture metric             |
| `voice`          | `{ status: string, note: string }` | Voice metric                     |
| `feedbackItems`  | `Array<{ title: string, time: string, body: string, tone: string }>` | Detailed feedback list |

#### Handlers

| Handler               | Trigger                | Action                              |
| --------------------- | ---------------------- | ----------------------------------- |
| `handleGoBack()`      | Back arrow press       | `navigation.goBack()` or Dashboard |
| `handlePracticeAgain()` | "Practice/Train Again" press | `navigate('Practice')` when practice; otherwise `goBack()` or `navigate('TrainingSetup')` |
| `handleCancel()`      | "Cancel" press        | `navigation.navigate('Dashboard')` |

---

### 4.8.2 AudioCameraTestScreen

**File**: `src/screens/Main/AudioCameraTestScreen.jsx`  
**Route**: `AudioCameraTest` (MainNavigator stack — opened from Settings → "Test Audio / Video")

#### State Variables

| Variable           | Type      | Initial Value | Description                           |
| ------------------ | --------- | ------------- | ------------------------------------- |
| `cameraPermission` | `boolean` | `false`       | Whether camera permission is granted  |
| `audioPermission`  | `boolean` | `false`       | Whether microphone permission granted |
| `facing`           | `string`  | `'front'`     | Active camera direction (`'front'` \| `'back'`) |
| `isMicTesting`     | `boolean` | `false`       | Whether microphone level test is running |
| `audioLevel`       | `number`  | `0`           | Current simulated mic level (0–1)     |
| `cameraReady`      | `boolean` | `false`       | Whether CameraView has initialised    |

#### Refs

| Ref                   | Type     | Description                                        |
| --------------------- | -------- | -------------------------------------------------- |
| `micIntervalRef`      | `number` | setInterval ID for audio level polling              |
| `soundStartTimeRef`   | `number` | Timestamp when sound first exceeded threshold       |
| `autoStopTimeoutRef`  | `number` | setTimeout ID for deferred auto-stop                |

#### Constants

| Constant          | Value  | Description                                         |
| ----------------- | ------ | --------------------------------------------------- |
| `SOUND_THRESHOLD` | `0.15` | Audio level above which "sound" is considered detected |
| `AUTO_STOP_DELAY` | `3000` | Milliseconds of continuous sound before auto-stopping  |

#### Handlers

| Handler                | Trigger                    | Action                                     |
| ---------------------- | -------------------------- | ------------------------------------------ |
| `handleGoBack()`       | Back arrow / Done press    | Stops mic test, clears timeouts, `navigation.goBack()` |
| `handleFlipCamera()`   | Flip camera icon press     | Toggles `facing` between front and back    |
| `handleToggleMicTest()`| Start / Stop Mic Test btn  | Starts/stops simulated audio level polling with auto-stop logic |
| `stopMicTest()`        | Auto-stop timer / manual   | Clears interval, timeout, refs; resets audioLevel and isMicTesting |

#### Auto-Stop Mic Behaviour

When mic test is active, the audio level is polled every 120 ms. If the level stays above `SOUND_THRESHOLD` (0.15) for `AUTO_STOP_DELAY` (3 000 ms), `stopMicTest()` is scheduled on the next tick to cleanly stop the test. If the level drops below the threshold, the timer resets.

#### Components Used

| Component             | Props                                       | Description                 |
| --------------------- | ------------------------------------------- | --------------------------- |
| `CameraView`          | `facing`, `onCameraReady`                   | Live camera preview         |
| `AudioLevelIndicator` | `level`, `isActive`, `barCount=20`, `width` | Mic waveform visualiser     |
| `PrimaryButton`       | `title`, `onPress`, `variant`, `disabled`   | Mic toggle + Done buttons   |

#### UI Sections (top → bottom)

| Section           | Content                                                        |
| ----------------- | -------------------------------------------------------------- |
| Header            | Back button + "Test Audio / Video" title                       |
| Camera Preview    | Live CameraView with flip-camera overlay + status dot          |
| Microphone Test   | 20-bar AudioLevelIndicator + status dot + Start/Stop button    |
| Done              | Full-width "Done" button returning to Settings                 |

---

### 4.9 ProfileScreen

**File**: `src/screens/Main/ProfileScreen.jsx`  
**Route**: `Profile` (BottomTabNavigator — fourth tab)

#### Hook Destructuring

```js
const { user, logout, isLoading, updateNickname } = useAuth();
```

#### State Variables

| Variable   | Type     | Initial Value                                   | Description                   |
| ---------- | -------- | ----------------------------------------------- | ----------------------------- |
| `formData` | `object` | (see below)                                     | Editable profile fields       |
| `errors`   | `object` | `{}`                                            | Per-field validation errors   |
| `isSaving` | `boolean`| `false`                                         | Save operation in progress    |

#### `formData` Shape

| Key          | Type              | Initial Value                          | Description               |
| ------------ | ----------------- | -------------------------------------- | ------------------------- |
| `firstName`  | `string`          | `user?.name?.split(' ')[0] \|\| ''`    | First name input          |
| `lastName`   | `string`          | `user?.name?.split(' ').slice(1).join(' ') \|\| ''` | Last name input (optional) |
| `nickname`   | `string`          | `user?.nickname \|\| ''`               | Display nickname input    |
| `email`      | `string`          | `user?.email \|\| ''`                  | Email input (read-only)   |
| `avatarUri`  | `string \| null`  | `user?.avatar_url \|\| null`           | Selected avatar image URI |

#### Validation

| Key         | Message                         | Required? |
| ----------- | ------------------------------- | --------- |
| `firstName` | `'First name is required'`      | Yes       |
| `lastName`  | —                               | No (optional) |

#### From Hooks

| Variable         | Source       | Type       | Description                       |
| ---------------- | ------------ | ---------- | --------------------------------- |
| `user`           | `useAuth()`  | `object`   | Pre-populate form fields          |
| `logout`         | `useAuth()`  | `function` | Clears auth state + storage       |
| `isLoading`      | `useAuth()`  | `boolean`  | Loading indicator                 |
| `updateNickname` | `useAuth()`  | `function` | Update nickname in context + Supabase |

#### Handlers

| Handler                   | Trigger                    | Action                                              |
| ------------------------- | -------------------------- | --------------------------------------------------- |
| `updateField(field, value)` | Any input change         | Updates `formData[field]`, clears matching error    |
| `handleSaveChanges()`     | "Save Changes" press       | Validates, uploads avatar if changed, updates Supabase user_metadata (full_name, nickname, avatar_url), syncs nickname via context |
| `handleAvatarAutoSave(localUri)` | Callback from AvatarPicker after image selection | Immediately updates local state, uploads avatar to Supabase Storage, updates user_metadata with new avatar URL, shows success alert |
| `handleCancel()`          | "Cancel" press             | Resets form to initial user values                  |
| `handleGoBack()`          | Back arrow press           | `navigation.goBack()` or `navigation.navigate('Dashboard')` |
| `handleChangePassword()`  | "Change Password" row     | `navigation.navigate('ChangePassword')`             |
| `handleAccountSettings()` | "Account Settings" row    | `navigation.navigate('AccountSettings')`            |
| `uploadAvatar(localUri)`  | Called by handleSaveChanges or handleAvatarAutoSave | Uploads image to Supabase Storage `avatars` bucket, returns public URL |
| `uploadAvatarInBackground(localUri)` | Called for background upload | Uploads avatar and updates Supabase user_metadata without blocking UI |

#### Avatar Upload Flow

**Auto-Save Flow (Recommended):**
1. User taps avatar with camera icon → AvatarPicker opens image picker
2. User selects and crops image → local URI obtained
3. `handleAvatarAutoSave` immediately called with URI
4. Form state updated with new URI + success alert shown
5. Upload happens in background: image → Supabase Storage → public URL → user_metadata
6. No need to tap "Save Changes" button

**Manual Save Flow:**
1. User picks image via AvatarPicker → URI stored in `formData.avatarUri`
2. User taps "Save Changes" button
3. `handleSaveChanges()` detects `formData.avatarUri` differs from `user.avatar_url`
4. Calls `uploadAvatar()` immediately (blocking)
5. All changes saved atomically to Supabase

#### Components Used

| Component      | Props                                        | Description               |
| -------------- | -------------------------------------------- | ------------------------- |
| `AvatarPicker` | `uri`, `username`, `size`, `editable`, `onImageSelectAndUpload` | Avatar selection with camera icon; calls callback after image selection |
| `TextField`    | `label`, `value`, `onChangeText`, `error`    | Form inputs               |
| `PrimaryButton`| `title`, `onPress`, `loading`, `variant`     | Save/Cancel buttons       |

---

### 4.10 EditProfileScreen

**File**: `src/screens/Main/EditProfileScreen.jsx`  
**Route**: `EditProfile` (MainNavigator stack)

#### Hook Destructuring

```js
const { user, updateNickname, isLoading } = useAuth();
```

#### State Variables

| Variable   | Type     | Initial Value                                   | Description                   |
| ---------- | -------- | ----------------------------------------------- | ----------------------------- |
| `formData` | `object` | (see below)                                     | Editable profile fields       |
| `errors`   | `object` | `{}`                                            | Per-field validation errors   |

#### `formData` Shape

| Key          | Type              | Initial Value                          | Description               |
| ------------ | ----------------- | -------------------------------------- | ------------------------- |
| `firstName`  | `string`          | `user?.name?.split(' ')[0] \|\| ''`    | First name input          |
| `lastName`   | `string`          | `user?.name?.split(' ')[1] \|\| ''`    | Last name input           |
| `email`      | `string`          | `user?.email \|\| ''`                  | Email input (display)     |
| `avatarUri`  | `string \| null`  | `user?.avatar_url \|\| null`           | Selected avatar image URI |

#### `errors` Keys

| Key         | Message                         |
| ----------- | ------------------------------- |
| `firstName` | `'First name is required'`      |
| `lastName`  | `'Last name is required'`       |

#### From Hooks

| Variable         | Source       | Type       | Description                       |
| ---------------- | ------------ | ---------- | --------------------------------- |
| `user`           | `useAuth()`  | `object`   | Pre-populate form fields          |
| `updateNickname` | `useAuth()`  | `function` | Update profile (wired for nickname) |
| `isLoading`      | `useAuth()`  | `boolean`  | Save button spinner               |

#### Handlers

| Handler                 | Trigger                    | Action                                              |
| ----------------------- | -------------------------- | --------------------------------------------------- |
| `updateField(field, value)` | Any input change       | Updates `formData[field]`, clears matching error    |
| `handleSaveChanges()`   | "Save Changes" press       | Validates, shows success Alert + navigates back     |
| `handleCancel()`        | "Cancel" press             | `navigation.goBack()`                               |
| `handleGoBack()`        | Back arrow press           | `navigation.goBack()`                               |
| `handleChangePassword()` | "Change Password" row    | `navigation.navigate('ChangePassword')`             |
| `handleAccountSettings()` | "Account Settings" row  | `navigation.navigate('AccountSettings')`            |

#### Components Used

| Component      | Props                                 | Description               |
| -------------- | ------------------------------------- | ------------------------- |
| `AvatarPicker` | `uri`, `onImageSelected`, `size`, `editable` | Avatar selection with camera icon |
| `TextField`    | `label`, `value`, `onChangeText`, `error` | Form inputs              |

---

### 4.11 ProgressScreen

**File**: `src/screens/Main/ProgressScreen.jsx`  
**Route**: `Progress` (BottomTabNavigator — third tab)

#### Hook Destructuring

```js
const { sessions, isLoading, fetchSessions } = useSessions();
```

#### State Variables

| Variable    | Type                            | Initial Value | Description                           |
| ----------- | ------------------------------- | ------------- | ------------------------------------- |
| `timeRange` | `'week' \| 'month' \| 'year'`   | `'week'`      | Selected time period filter           |

#### From Hooks

| Variable        | Source           | Type         | Description                  |
| --------------- | ---------------- | ------------ | ---------------------------- |
| `sessions`      | `useSessions()`  | `Session[]`  | Session list for metrics     |
| `isLoading`     | `useSessions()`  | `boolean`    | Data loading indicator       |
| `fetchSessions` | `useSessions()`  | `function`   | Load session data            |

#### Derived Variables

| Variable                 | Type     | Derivation                                    | Description                              |
| ------------------------ | -------- | --------------------------------------------- | ---------------------------------------- |
| `performancePercentage`  | `number` | Avg of all session scores * 100               | Overall performance score (0-100)        |
| `improvementPercentage`  | `number` | `12` (placeholder)                            | Improvement from previous period         |
| `betterThanLastWeek`     | `number` | `12` (placeholder)                            | Week-over-week improvement percentage    |
| `averageScore`           | `number` | Avg of all session scores * 100               | Average score across all sessions        |
| `chartData`              | `ChartDataPoint[]` | Aggregated data based on `timeRange` | Array for ProgressChart visualization    |
| `recentSessions`         | `SessionDisplay[]` | First 5 sessions with formatted data | Sessions for display list                |

#### ChartDataPoint Shape

| Property | Type     | Description                              |
| -------- | -------- | ---------------------------------------- |
| `label`  | `string` | X-axis label (Mon, Tue, Wk1, Jan, etc.)  |
| `value`  | `number` | Y-axis value (performance metric 0-100)  |

#### SessionDisplay Shape

| Property   | Type     | Description                          |
| ---------- | -------- | ------------------------------------ |
| `id`       | `string` | Session ID                           |
| `title`    | `string` | Session title                        |
| `subtitle` | `string` | Date + duration (e.g., "Oct 23 • 4 mins") |
| `score`    | `number` | Score value 0-100                    |

#### Handlers

| Handler              | Trigger                  | Action                                      |
| -------------------- | ------------------------ | ------------------------------------------- |
| `handleGoBack()`     | Back arrow press         | `navigation.goBack()`                       |
| `handleSessionPress(sessionId)` | Session card tap | `navigation.navigate('SessionDetail', { sessionId })` |
| `handleViewAll()`    | "VIEW ALL" link press    | `navigation.navigate('History')`            |

#### UI Sections

| Section            | Content                                                |
| ------------------ | ------------------------------------------------------ |
| Performance Trend  | Large percentage, improvement badge, chart, time selector |
| Stats Row          | "Better than last week" + "Avg Score" cards            |
| Recent Sessions    | List of SessionScoreCard components (max 5)            |

#### Components Used

| Component             | Props                               | Description                    |
| --------------------- | ----------------------------------- | ------------------------------ |
| `TimeRangeSelector`   | `selected`, `onSelect`              | Week/Month/Year pill selector  |
| `ProgressChart`       | `data`                              | Line chart visualization       |
| `SessionScoreCard`    | `title`, `subtitle`, `score`, `onPress` | Individual session card   |

---

### 4.12 ScriptsScreen

**File**: `src/screens/Main/ScriptsScreen.jsx`  
**Route**: `Scripts` (MainNavigator stack)

> **Data source**: All script data comes from Supabase via `src/api/scriptsApi.js`.  
> Scripts are reloaded on every screen focus (`navigation.addListener('focus')`).

#### State Variables

| Variable     | Type                                | Initial Value      | Description                           |
| ------------ | ----------------------------------- | ------------------ | ------------------------------------- |
| `filterType` | `'self-authored' \| 'auto-generated'` | `'self-authored'` | Selected script type filter           |
| `scripts`    | `Script[]`                          | `[]`               | Array of all script objects from Supabase |
| `isLoading`  | `boolean`                           | `false`            | Data loading indicator (shows ActivityIndicator) |

#### Script Object Shape (from Supabase `scripts` table)

| Property      | Type           | Description                          |
| ------------- | -------------- | ------------------------------------ |
| `id`          | `uuid`         | Primary key                          |
| `user_id`     | `uuid`         | FK → `profiles.id`                   |
| `title`       | `text`         | Script title/name                    |
| `content`     | `text`         | Full script body text                |
| `type`        | `text`         | `'self-authored'` \| `'auto-generated'` |
| `created_at`  | `timestamptz`  | Creation timestamp                   |
| `updated_at`  | `timestamptz`  | Last update timestamp                |

#### Derived Variables

| Variable          | Type            | Derivation                                    | Description                           |
| ----------------- | --------------- | --------------------------------------------- | ------------------------------------- |
| `filteredScripts` | `Script[]`      | Filtered by `filterType`                      | Scripts matching current filter       |
| `filterTabs`      | `TabOption[]`   | `[{value, label}, ...]`                       | Filter tab options (memoized)         |

#### TabOption Shape

| Property | Type     | Description              |
| -------- | -------- | ------------------------ |
| `value`  | `string` | Tab identifier           |
| `label`  | `string` | Tab display text         |

#### Handlers

| Handler                    | Trigger                     | Action                                                  |
| -------------------------- | --------------------------- | ------------------------------------------------------- |
| `handleGoBack()`           | Back arrow press            | `navigation.goBack()`                                   |
| `handleWriteScript()`      | "Write Script" button       | `navigate('ScriptEditor', { isNew: true })`             |
| `handleGenerateScript()`   | "Generate Script" button    | `navigate('GenerateScript', { entryPoint: 'scripts' })` |
| `handleEditScript(id)`     | "Edit" in ScriptCard menu   | `navigate('ScriptEditor', { scriptId, script })`        |
| `handleDeleteScript(id)`   | "Delete" in ScriptCard menu | Alert confirmation → `deleteScript(id)` → removes from state |
| `handleFilterChange(val)`  | Filter tab selection        | Updates `filterType` state                              |
| `loadScripts()`            | Screen focus event          | `fetchScripts()` → sets `scripts` state (useCallback)  |
| `formatEditedTime(iso)`    | Called during render        | Converts ISO timestamp to readable format               |

#### API Calls

| Call                  | Module         | Trigger            | Description                           |
| --------------------- | -------------- | ------------------ | ------------------------------------- |
| `fetchScripts()`      | `scriptsApi`   | Screen focus       | Fetches all user scripts, ordered by `updated_at` desc |
| `deleteScript(id)`    | `scriptsApi`   | Delete confirmation| Deletes a single script by ID         |

#### formatEditedTime Return Values

| Condition                | Return Value                          |
| ------------------------ | ------------------------------------- |
| < 24 hours ago           | `'EDITED TODAY'`                      |
| 1 day ago                | `'EDITED YESTERDAY'`                  |
| 2-6 days ago             | `'EDITED X DAYS AGO'`                 |
| 7+ days ago              | `'EDITED MMM DD'`                     |

#### Components Used

| Component      | Props                                                       | Description                    |
| -------------- | ----------------------------------------------------------- | ------------------------------ |
| `PrimaryButton`| `title`, `onPress`, `variant`, `style`                      | Write/Generate action buttons  |
| `FilterTabs`   | `tabs`, `selected`, `onSelect`                              | Self-Authored/Auto-Generated filter |
| `ScriptCard`   | `title`, `description`, `editedTime`, `onEdit`, `onDelete`  | Script card with 3-dot overflow menu |
| `ActivityIndicator` | —                                                      | Loading spinner while fetching |

---

### 4.13 SettingsScreen

**File**: `src/screens/Main/SettingsScreen.jsx`  
**Route**: `Settings` (MainNavigator stack)

#### State Variables

| Variable           | Type                                        | Initial Value | Description                           |
| ------------------ | ------------------------------------------- | ------------- | ------------------------------------- |
| `microphoneSource` | `'default' \| 'bluetooth' \| 'external'`   | `'default'`   | Selected microphone input device      |
| `cameraSource`     | `'front' \| 'back'`                        | `'front'`     | Selected camera device                |

#### From Hooks

| Variable  | Source        | Type       | Description                  |
| --------- | ------------- | ---------- | ---------------------------- |
| `logout`  | `useAuth()`   | `function` | Clear user session           |
| `reset`   | `useSessions()` | `function` | Clear session data          |

#### Dropdown Options

| Variable             | Type                                  | Description                           |
| -------------------- | ------------------------------------- | ------------------------------------- |
| `microphoneOptions`  | `Array<{label: string, value: string}>` | Microphone source choices           |
| `cameraOptions`      | `Array<{label: string, value: string}>` | Camera source choices               |

#### microphoneOptions Values

| Value      | Label                             |
| ---------- | --------------------------------- |
| `default`  | Default - Built-in Microphone     |
| `bluetooth`| Bluetooth Microphone              |
| `external` | External Microphone               |

#### cameraOptions Values

| Value   | Label        |
| ------- | ------------ |
| `front` | Front Camera |
| `back`  | Back Camera  |

#### Handlers

| Handler                     | Trigger                     | Action                                                  |
| --------------------------- | --------------------------- | ------------------------------------------------------- |
| `handleGoBack()`            | Back arrow press            | `navigation.goBack()`                                   |
| `handleMicrophoneChange(val)` | Microphone dropdown change | Updates `microphoneSource` state and AsyncStorage      |
| `handleCameraChange(val)`   | Camera dropdown change      | Updates `cameraSource` state and AsyncStorage           |
| `handleTestAudioVideo()`    | Test Audio/Video button     | `navigation.navigate('AudioCameraTest')` — opens hardware test screen |
| `handleClearCache()`        | Clear Cache button          | Shows confirmation, then clears non-essential AsyncStorage keys |
| `handleLogout()`            | Logout button               | Shows confirmation, then calls `reset()` and `logout()` |

#### AsyncStorage Keys

| Key                | Preserved on Cache Clear? | Description                      |
| ------------------ | ------------------------- | -------------------------------- |
| `microphone_source`| ✅ Yes                    | Saved microphone preference      |
| `camera_source`    | ✅ Yes                    | Saved camera preference          |
| `auth_token`       | ✅ Yes                    | Auth token (STORAGE_KEYS)        |
| `user_data`        | ✅ Yes                    | User data (STORAGE_KEYS)         |
| Other keys         | ❌ No                     | Cache data (cleared)             |

#### UI Sections

| Section   | Content                                                      |
| --------- | ------------------------------------------------------------ |
| Header    | Back button + "Settings" title                               |
| HARDWARE  | Microphone dropdown, Camera dropdown, Test Audio/Video button |
| STORAGE   | Clear Local Cache button (gray), Log out button (red)        |

#### Components Used

| Component      | Props                                      | Description                    |
| -------------- | ------------------------------------------ | ------------------------------ |
| `Dropdown`     | `value`, `options`, `onSelect`             | Microphone/camera selectors    |
| `PrimaryButton`| `title`, `onPress`, `variant`, `style`     | Test Audio/Video button        |
| `TouchableOpacity` | `onPress`, `style`                     | Clear Cache and Logout buttons |

---

### 4.14 TrainingSetupScreen

**File**: `src/screens/Main/TrainingSetupScreen.jsx`  
**Route**: `TrainingSetup` (MainNavigator stack)

#### Layout

1. Back button
2. "Training Setup" header (split line)
3. Script type selector tabs (Pre-written / Auto-Generated)
4. Script dropdown selector OR Generate Speech button (conditionally rendered)
5. Focus mode radio buttons (Scripted Accuracy / Free Speech)
6. Start Training + Cancel buttons

#### State Variables

| Variable           | Type      | Initial Value | Description                              |
| ------------------ | --------- | ------------- | ---------------------------------------- |
| `selectedScriptType` | `string` | `'prewritten'` | `'prewritten'` \| `'autogenerated'`     |
| `allScripts`       | `array`   | `[]`          | Available scripts matching type         |
| `selectedScriptId` | `string`  | `''`          | Currently selected script ID             |
| `selectedFocus`    | `string \| null`  | `null`      | `'accuracy'` \| `'free'` \| `null`       |
| `isLoading`        | `boolean` | `false`       | Supabase fetch in progress              |
| `isStarting`       | `boolean` | `false`       | Start action in progress                |

#### Derived Variables

| Variable                | Type     | Derivation                                      | Description                          |
| ----------------------- | -------- | ----------------------------------------------- | ------------------------------------ |
| `scriptDropdownOptions` | `array`  | `allScripts.filter(s => s.type === selectedScriptType).map(...)` | Filtered scripts for dropdown |
| `focusOptions`          | `array`  | `[{value: 'accuracy', label: 'Scripted Accuracy'}, {value: 'free', label: 'Free Speech'}]` | Static options |

#### Handlers

| Handler              | Trigger                    | Action                                                                     |
| -------------------- | -------------------------- | -------------------------------------------------------------------------- |
| `handleGoBack()`     | Back button press          | Navigate back or to Dashboard                                             |
| `handleCancel()`     | Cancel button press        | Navigate back or to Dashboard                                             |
| `handleStartTraining()` | Start Training button     | Navigate to `TrainingScripted` with focusMode, autoStart, script params  |
| `handleOpenGenerate()` | Generate Speech button    | Navigate to `GenerateScript` screen                                       |

#### Navigation Actions

| Action                             | Destination          | Params                                                 |
| ---------------------------------- | -------------------- | ------------------------------------------------------ |
| `navigate('TrainingScripted', ...)`| TrainingScriptedScreen | `{focusMode, autoStart, scriptId?, scriptType?}`                  |
| `navigate('GenerateScript')`       | GenerateScriptScreen | None                                                   |

#### Conditional UI

| Condition | Rendered                              | Hidden                      |
| --------- | ------------------------------------- | --------------------------- |
| `selectedScriptType === 'autogenerated'` | PrimaryButton "Generate Speech" | Dropdown component |
| `selectedScriptType === 'prewritten'`    | Dropdown component                | PrimaryButton               |
| `selectedFocus` not set                  | Start Training button disabled   | —                          |
| `selectedFocus === 'accuracy'`           | Auto-switch to prewritten + auto-select first script | — |
| `selectedFocus === 'free'`               | Script dropdown disabled         | — |

#### Components Used

| Component      | Props                                 | Description                  |
| -------------- | ------------------------------------- | ---------------------------- |
| `FilterTabs`   | `tabs`, `selected`, `onSelect`        | Pre-written / Auto-Generated |
| `Dropdown`     | `value`, `options`, `onSelect`        | Script selector              |
| `PrimaryButton`| `title`, `onPress`, `loading`         | Generate Speech / Start      |
| `Typography`   | `variant`, `color`, `align`           | Headers and labels           |

---

### 4.15 GenerateScriptScreen

**File**: `src/screens/Main/GenerateScriptScreen.jsx`  
**Route**: `GenerateScript` (MainNavigator stack)

#### Route Params

| Param        | Type                       | Default      | Description                                |
| ------------ | -------------------------- | ------------ | ------------------------------------------ |
| `entryPoint` | `'scripts'` \| `'training'` | `'training'` | Determines save-only vs save-and-train flow |

#### Layout

1. Back button
2. "Generate Script" header (split line)
3. Multiline prompt input + "Random Topic" action
4. "What's the vibe?" section + ChoiceChips (Professional, Casual, Humorous, Inspirational)
5. "Approx. Duration" section + ChoiceChips (Short 1-2m, Medium 3-5m, Long 5m+)
6. Dynamic primary button: "Generate and Save" (scripts) or "Generate and Start" (training)

#### State Variables

| Variable           | Type      | Initial Value | Description                              |
| ------------------ | --------- | ------------- | ---------------------------------------- |
| `promptText`       | `string`  | `''`          | User input for script generation         |
| `selectedVibe`     | `string`  | `'inspirational'` | `'professional'` \| `'casual'` \| `'humorous'` \| `'inspirational'` |
| `selectedDuration` | `string`  | `'medium'`    | `'short'` \| `'medium'` \| `'long'`     |
| `isGenerating`     | `boolean` | `false`       | Supabase Edge Function call in progress  |
| `modalVisible`     | `boolean` | `false`       | Whether generated-script review modal is shown |
| `generatedTitle`   | `string`  | `''`          | Title of the generated script (editable in modal) |
| `generatedContent` | `string`  | `''`          | Body of the generated script (editable in modal)  |
| `isSaving`         | `boolean` | `false`       | Whether script is being saved to Supabase |

#### Derived Variables

| Variable             | Type     | Derivation                                         | Description                              |
| -------------------- | -------- | -------------------------------------------------- | ---------------------------------------- |
| `vibeOptions`        | `array`  | Static array of 4 vibe options                     | Memoized vibe choices                    |
| `durationOptions`    | `array`  | Static array of 3 duration options                 | Memoized duration choices                |
| `primaryButtonLabel` | `string` | `entryPoint === 'scripts' ? 'Generate and Save' : 'Generate and Start'` | Dynamic button text |

#### Handlers

| Handler                   | Trigger                        | Action                                                                     |
| ------------------------- | ------------------------------ | -------------------------------------------------------------------------- |
| `handleGoBack()`          | Back button press              | Navigate back or to Dashboard                                             |
| `handleRandomTopic()`     | "Random Topic" action          | TODO: Call Supabase function; set `promptText` to random topic            |
| `handleGenerateStart()`   | Primary button press           | Calls Supabase Edge Function (TODO); opens review Modal with generated content |
| `handleRegenerate()`      | "Regenerate" button in modal   | Re-calls generation (TODO); replaces modal content with new result        |
| `handleConfirmGenerated()`| "Save" / "Save & Start" button | Saves script to Supabase via `createScript`, then navigates              |

#### Navigation Actions

| Condition                  | Action                              | Destination            | Params                                                 |
| -------------------------- | ----------------------------------- | ---------------------- | ------------------------------------------------------ |
| `entryPoint === 'scripts'` | `navigation.goBack()`               | ScriptsScreen          | —  (Scripts reloads on focus)                          |
| `entryPoint === 'training'`| `navigate('TrainingScripted', ...)` | TrainingScriptedScreen | `{focusMode: 'free', autoStart: true, scriptType: 'autogenerated', entryPoint: 'training', scriptId}` |

#### API Calls

| Call                        | Module       | Params                                           | Returns                           |
| --------------------------- | ------------ | ------------------------------------------------ | --------------------------------- |
| Supabase Edge Function (TODO) | —          | `{promptText, selectedVibe, selectedDuration}`   | `{title, body}`                   |
| `createScript()`            | `scriptsApi` | `{title, content, type: 'auto-generated'}`       | `{success, script?, error?}`      |

#### Review Modal

After generation, a bottom-sheet-style Modal is displayed with:
- **Title input** — editable TextInput prefilled with generated title
- **Content editor** — multiline TextInput in a ScrollView, prefilled with generated body
- **Regenerate button** — outline style, calls `handleRegenerate()`
- **Save / Save & Start button** — primary, calls `handleConfirmGenerated()`

#### Components Used

| Component      | Props                                 | Description                      |
| -------------- | ------------------------------------- | -------------------------------- |
| `ChoiceChips`  | `options`, `selected`, `onSelect`     | Vibe / Duration selector         |
| `PrimaryButton`| `title`, `onPress`, `loading`         | Primary action + modal buttons   |
| `TextInput`    | `value`, `onChangeText`, `multiline`  | Prompt input + modal editors     |
| `Typography`   | `variant`, `color`, `align`           | Headers and labels               |
| `Modal`        | `visible`, `transparent`, `animationType` | Review/edit generated script |

---

### 4.16 TrainingScriptedScreen

**File**: `src/screens/Main/TrainingScriptedScreen.jsx`  
**Route**: `TrainingScripted` (MainNavigator stack)

#### Enhanced Layout

1. Header (back button | script title | settings icon)
2. "Training" title
3. Teleprompter area with camera feed behind text (free speech: camera only)
4. **Enhanced audio waveform visualizer** (history + real-time peak)
5. Recording indicator (red dot + "Recording" / "Paused")
6. **Recording timer** (MM:SS format)
7. Control buttons (Pause | Record [large red] | Restart)
8. **Countdown modal** (3...2...1...Start)

#### State Variables

| Variable          | Type      | Initial Value | Description                              |
| ----------------- | --------- | ------------- | ---------------------------------------- |
| `scriptData`      | `object`  | `null`        | `{id, title, body, type}` fetched from Supabase |
| `isLoadingScript` | `boolean` | `true`        | Script fetch in progress                 |
| `isRecording`     | `boolean` | `false`       | Audio recording active                   |
| `isPaused`        | `boolean` | `false`       | Recording paused                         |
| `audioLevel`      | `number`  | `0`           | Current microphone level (0-1)           |
| `recordingDuration` | `number`| `0`           | Elapsed seconds since recording started  |
| `showCountdown`   | `boolean` | `false`       | Countdown modal visibility (3-2-1-Start) |
| `countdownValue`  | `number`  | `3`           | Countdown display value (3, 2, 1, 0→Start) |
| `showSettings`    | `boolean` | `false`       | Settings modal visibility                |
| `fontSize`        | `number`  | `16`          | Teleprompter font size (12-24)           |
| `scrollSpeed`     | `number`  | `0`           | Auto-scroll speed (0 = off, 1-10)        |
| `autoScroll`      | `boolean` | `false`       | Enable auto-scroll during recording      |
| `wpm`             | `number`  | `120`         | Words per minute (60-200) for highlighting |
| `highlightedWordIndex` | `number` | `0`      | Index of currently highlighted word      |
| `hasCamera`       | `boolean` | `false`       | Camera permission granted                |
| `cameraPermission`| `boolean` | `null`        | Camera permission granted                      |
| `cameraUri`       | `string`  | `null`        | Camera photo URI for display             |

#### Derived Variables

| Variable     | Type      | Description                              |
| ------------ | --------- | ---------------------------------------- |
| `isFreeMode` | `boolean` | `focusMode === 'free'` (hides teleprompter/settings) |

#### Route Params

| Param       | Type     | Source                | Description                      |
| ----------- | -------- | --------------------- | -------------------------------- |
| `scriptId`  | `string` | TrainingSetup / Practice / GenerateScript | Script to fetch (required for scripted accuracy) |
| `focusMode` | `string` | TrainingSetup / GenerateScript | `'accuracy'` \| `'free'`         |
| `scriptType`| `string` | TrainingSetup / GenerateScript | `'prewritten'` \| `'autogenerated'` |
| `autoStart` | `boolean` | TrainingSetup / Practice / GenerateScript | Auto-start 3-2-1 countdown on entry |
| `entryPoint` | `string` | TrainingSetup / Practice | `'training'` \| `'practice'` (used to label results) |

#### Ref Variables

| Ref                | Type      | Purpose                                     |
| ------------------ | --------- | ------------------------------------------- |
| `cameraRef`        | `Camera`  | Reference to camera component for photo capture |
| `audioLevelRefs`   | `array`   | History of recent audio levels (50pt array) |
| `scrollViewRef`    | `ScrollView` | Reference to teleprompter scroll view    |
| `countdownTimerRef`| `timeout` | Countdown timer interval                    |
| `recordingTimerRef`| `interval` | Recording duration timer                    |

#### Handlers

| Handler                | Trigger                    | Action                                                                     |
| ---------------------- | -------------------------- | -------------------------------------------------------------------------- |
| `handleGoBack()`       | Back button press          | Pause active session and show exit warning before navigating              |
| `handleCaptureCameraPhoto()` | Camera button press   | Capture front camera photo (quality: 0.6) and store as `cameraUri`        |
| `handleStartCountdown()`| Record button 1st press    | Show countdown modal, trigger 3-2-1-Start sequence                       |
| `handleStartRecordingAuto()` | Countdown complete  | Start audio recording, reset DurationMeter, set `isRecording = true`     |
| `handleRecordPress()`  | Record button press        | If recording: stop and navigate to analysis result; else: start countdown |
| `handlePausePress()`   | Pause button press         | Toggle `isPaused` (only when recording)                                   |
| `handleRestartPress()` | Restart button press       | Reset: recording, pause, duration, audio level, highlight index, scroll top |
| `handleOpenSettings()` | Settings icon press        | Open teleprompter settings modal                                          |
| `handleCloseSettings()`| Modal close                | Close settings modal                                                       |
| `formatDuration(seconds)` | Internal           | Convert seconds to MM:SS format string                                    |
| `getHighlightedScript()` | Internal           | Get script with word indices for conditional highlighting                 |

#### Settings Modal Controls

| Setting         | Range       | Default | Description                              |
| --------------- | ----------- | ------- | ---------------------------------------- |
| Font Size       | 12–24 px    | 16      | Teleprompter text size                   |
| WPM             | 60–200      | 120     | Words per minute for highlighting sync   |
| Auto Scroll     | On/Off      | Off     | Toggle automatic scrolling               |
| Scroll Speed    | 0–10        | 0       | Auto-scroll velocity (only if enabled)   |

#### WPM Highlighting Feature

When recording, script words are highlighted as user reads:
- **Past words** (`idx < highlightedWordIndex`): `textMuted` color (gray)
- **Current word** (`idx === highlightedWordIndex`): Yellow background + bold
- **Future words** (`idx > highlightedWordIndex`): `textSecondary` color (lighter gray)

Calculation: `wordsElapsed = Math.floor(recordingDuration * (wpm / 60))`

#### Camera & Microphone Integration

| Feature          | Implementation                                 |
| ---------------- | ---------------------------------------------- |
| Front Camera     | `CameraView` with `facing="front"`             |
| Camera Overlay   | Camera sits behind teleprompter text at reduced opacity (full opacity in free speech) |
| Phone Microphone | `expo-audio` Audio.Recording (TODO: integrate)   |
| Audio Level      | Simulates realistic levels with peaks/valleys  |

#### Countdown Sequence

1. User presses Record button
2. `showCountdown = true`, `countdownValue = 3`
3. Every 1 second: decrement `countdownValue`
4. When `countdownValue === 0`: "Start!" text, then auto-call `handleStartRecordingAuto()`
5. Recording begins, countdown modal closes

#### API Calls (TODOs)

| Call                        | Params                                           | Returns                           |
| --------------------------- | ------------------------------------------------ | --------------------------------- |
| Supabase Query              | `SELECT * FROM practice_scripts WHERE id = scriptId` | `{id, title, body, type}`         |
| Audio Upload + Scoring      | `{audioUri, scriptId, focusMode, duration}`     | `{sessionId, score, feedback}`    |
| Audio.Recording Start       | Audio recording settings (TODO)                  | Recording object for capture      |
| Random Topic                | Auto-called from GenerateScript                  | Script text suggestion            |

#### Effects

| Effect                    | Dependencies                  | Action                                                                 |
| ------------------------- | ----------------------------- | ---------------------------------------------------------------------- |
| Load Script               | `[scriptId, isFreeMode]`      | Fetch script from Supabase unless in free speech mode                  |
| Request Camera Permission | `[]` (mount)                  | Call `Camera.requestCameraPermissionsAsync()`, set `hasCamera`         |
| Countdown Timer           | `[showCountdown, countdownValue]` | Decrement countdown, trigger auto-start when 0                     |
| Recording Duration        | `[isRecording, isPaused]`     | Increment duration timer every 1 second if recording and not paused   |
| Audio Level Simulation    | `[isRecording, isPaused]`     | Generate realistic audio levels with sin() peaks every 100ms          |
| WPM Highlighting          | `[recordingDuration, wpm, isRecording, isPaused, scriptWords]` | Calculate highlighted word index from elapsed time + WPM |

#### Components Used

| Component      | Props                                 | Description                          |
| -------------- | ------------------------------------- | ------------------------------------ |
| `CameraView`   | `ref`, `facing`                        | Front-facing camera feed             |
| `ScrollView`   | `ref`, `showsVerticalScrollIndicator` | Teleprompter area                    |
| `PrimaryButton`| `title`, `onPress`, `loading`        | Pause/Record/Restart/Settings        |
| `Typography`   | `variant`, `color`, `align`          | Headers and labels                   |
| `Modal`        | `visible`, `animationType`           | Countdown modal, Settings panel      |
| `View`         | `style`, `children`                  | Layout containers                    |
| `TouchableOpacity` | `onPress`, `activeOpacity`       | Buttons and interactions             |

#### Recording Flow

1. User presses red Record button → show 3-2-1 countdown overlay
2. Countdown completes → "Start!" appears → auto-start recording
3. `isRecording = true`, `recordingDuration` timer starts, audio captured from phone mic
4. Scripted mode: teleprompter displays script with **WPM-based word highlighting**
5. Free speech mode: camera only (no teleprompter)
6. Audio waveform updates live with microphone input
7. User can pause/resume with Pause button
8. User presses Record button again → `isRecording = false`, navigate to analysis result

---

### 4.17 ChangePasswordScreen

**File**: `src/screens/Main/ChangePasswordScreen.jsx`  
**Route**: `ChangePassword` (MainNavigator stack)

#### State Variables

| Variable          | Type      | Initial Value | Description                          |
| ----------------- | --------- | ------------- | ------------------------------------ |
| `oldPassword`     | `string`  | `''`          | Current password input               |
| `newPassword`     | `string`  | `''`          | New password input                   |
| `confirmPassword` | `string`  | `''`          | Confirm new password input           |
| `errors`          | `object`  | `{}`          | Per-field validation errors          |
| `isSaving`        | `boolean` | `false`       | Save operation in progress           |

#### `errors` Keys

| Key               | Message Examples                              |
| ----------------- | --------------------------------------------- |
| `oldPassword`     | `'Old password is required'`, `'Incorrect current password'` |
| `newPassword`     | `'New password is required'`, `'Password must be at least 6 characters'` |
| `confirmPassword` | `'Please confirm your new password'`, `'Passwords do not match'` |

#### Handlers

| Handler                    | Trigger                  | Action                                              |
| -------------------------- | ------------------------ | --------------------------------------------------- |
| `updateField(field, value)` | Any input change        | Updates field state, clears matching error          |
| `handleSaveNewPassword()`  | "Save New Password" press | Validates fields, verifies old password via `supabase.auth.signInWithPassword`, updates via `supabase.auth.updateUser({ password })` |
| `handleGoBack()`           | Back arrow / Cancel press | `navigation.goBack()`                              |

#### Password Change Flow

1. User enters old password, new password, and confirms new password
2. Client-side validation: all fields required, new password ≥ 6 chars, passwords match
3. Old password verified via `supabase.auth.signInWithPassword({ email, password: oldPassword })`
4. If incorrect, sets `errors.oldPassword = 'Incorrect current password'`
5. If correct, calls `supabase.auth.updateUser({ password: newPassword })`
6. Success: Alert shown, navigates back

#### Components Used

| Component       | Props                                        | Description               |
| --------------- | -------------------------------------------- | ------------------------- |
| `PasswordField` | `label`, `placeholder`, `value`, `onChangeText`, `error` | Password input with toggle visibility |
| `PrimaryButton` | `title`, `onPress`, `loading`, `variant`     | Save/Cancel buttons       |

---

### 4.18 AccountSettingsScreen

**File**: `src/screens/Main/AccountSettingsScreen.jsx`  
**Route**: `AccountSettings` (MainNavigator stack)

#### State Variables

| Variable          | Type      | Initial Value | Description                          |
| ----------------- | --------- | ------------- | ------------------------------------ |
| `showDeleteModal` | `boolean` | `false`       | Whether delete confirmation modal is visible |
| `password`        | `string`  | `''`          | Password input in delete modal       |
| `confirmText`     | `string`  | `''`          | "CONFIRM DELETE" text input in modal |
| `isDeleting`      | `boolean` | `false`       | Delete operation in progress         |

#### Derived Variables

| Variable               | Type      | Derivation                                              | Description                              |
| ---------------------- | --------- | ------------------------------------------------------- | ---------------------------------------- |
| `isConfirmDeleteValid` | `boolean` | `password.trim() && confirmText === 'CONFIRM DELETE'`   | Enables delete button when both valid    |

#### Hook Destructuring

```js
const { logout } = useAuth();
```

#### Handlers

| Handler                    | Trigger                        | Action                                              |
| -------------------------- | ------------------------------ | --------------------------------------------------- |
| `handleGoBack()`           | Back arrow / Cancel press      | `navigation.goBack()`                               |
| `handleDeactivateProfile()`| "Deactivate Profile" press     | Shows Alert with confirm (TODO: Supabase integration) |
| `handleDeleteAccountPress()` | "Delete Account" press       | Resets modal fields, opens delete confirmation modal |
| `handleConfirmDelete()`    | Modal "Delete Account" press   | Validates password + confirmText, calls `supabase.auth.admin.deleteUser()`, then logout + navigate to Login |

#### Delete Account Flow

1. User clicks "Delete Account" red button
2. Modal slides up with password input + "CONFIRM DELETE" text input
3. Both fields must be valid for Delete button to enable
4. On confirm: password verified, account deleted via Supabase, user logged out
5. Navigates to Login screen

#### UI Sections

| Section             | Content                                                         |
| ------------------- | --------------------------------------------------------------- |
| Deactivate Profile  | Description + "Deactivate Profile" outline button               |
| Delete Account      | Warning text + red "Delete Account" button (white text)         |
| Cancel              | Fixed at bottom of screen with border separator                 |
| Delete Modal        | Bottom-sheet style: password input, confirm text input, Cancel/Delete buttons |

---

## 5. Reusable Component Props

### BackButton (`src/components/common/BackButton.jsx`)

Shared circular back button used consistently across **all** screens.  
Design: 48×48 white circle with light gray border (`colors.border`), centered 22px `arrow-back` Ionicon.

| Prop     | Type        | Default              | Description                                      |
| -------- | ----------- | -------------------- | ------------------------------------------------ |
| `onPress`| `function`  | `navigation.goBack()`| Custom press handler. Falls back to goBack()     |
| `style`  | `ViewStyle` | —                    | Override container style (e.g., add marginBottom)|

**Used in:** ForgotPasswordScreen, RegisterScreen, SessionResultScreen, DetailedFeedbackScreen, TrainingSetupScreen, TrainingScriptedScreen, SettingsScreen, ScriptsScreen, ScriptEditorScreen, ProgressScreen, ProfileScreen, PracticeScreen, HistoryScreen, GenerateScriptScreen, EditProfileScreen, ChangePasswordScreen, AudioCameraTestScreen, AllSessionsScreen, AccountSettingsScreen (19 screens total).

### BrandLogo (`src/components/common/BrandLogo.jsx`)

| Prop     | Type           | Default | Description          |
| -------- | -------------- | ------- | -------------------- |
| `style`  | `ViewStyle`    | —       | Container style override |

### TextField (`src/components/common/TextField.jsx`)

| Prop              | Type       | Default | Description                           |
| ----------------- | ---------- | ------- | ------------------------------------- |
| `label`           | `string`   | —       | Uppercase label text above input      |
| `value`           | `string`   | —       | Controlled input value                |
| `onChangeText`    | `function` | —       | Text change callback                  |
| `placeholder`     | `string`   | —       | Input placeholder                     |
| `error`           | `string`   | —       | Error message (shows in red below)    |
| `rightAdornment`  | `ReactNode`| —       | Right-side slot (e.g., icon)          |
| `autoCapitalize`  | `string`   | —       | RN autoCapitalize prop                |
| `keyboardType`    | `string`   | —       | RN keyboardType prop                  |
| `...rest`         | —          | —       | Passed through to TextInput          |

### PasswordField (`src/components/common/PasswordField.jsx`)

| Prop              | Type       | Default | Description                     |
| ----------------- | ---------- | ------- | ------------------------------- |
| `label`           | `string`   | —       | Label text                      |
| `value`           | `string`   | —       | Controlled input value          |
| `onChangeText`    | `function` | —       | Text change callback            |
| `placeholder`     | `string`   | —       | Input placeholder               |
| `error`           | `string`   | —       | Validation error message        |

Internal state: `secureTextEntry` toggle via Ionicons eye icon.

### PrimaryButton (`src/components/common/PrimaryButton.jsx`)

| Prop        | Type       | Default     | Description                     |
| ----------- | ---------- | ----------- | ------------------------------- |
| `title`     | `string`   | —           | Button label text               |
| `onPress`   | `function` | —           | Press handler                   |
| `variant`   | `string`   | `'primary'` | `'primary'` \| `'secondary'` \| `'outline'` |
| `size`      | `string`   | `'medium'`  | `'small'` \| `'medium'` \| `'large'` |
| `loading`   | `boolean`  | `false`     | Shows ActivityIndicator         |
| `disabled`  | `boolean`  | `false`     | Disable press + dim opacity     |
| `style`     | `ViewStyle`| —           | Container style override        |
| `textStyle` | `TextStyle`| —           | Label style override            |

### SocialButton (`src/components/common/SocialButton.jsx`)

| Prop      | Type       | Default | Description              |
| --------- | ---------- | ------- | ------------------------ |
| `onPress` | `function` | —       | Press handler            |
| `title`   | `string`   | —       | Button label             |

Uses FontAwesome `google` icon with outline border style.

### AvatarPicker (`src/components/common/AvatarPicker.jsx`)

| Prop              | Type       | Default | Description                     |
| ----------------- | ---------- | ------- | ------------------------------- |
| `uri`             | `string`   | `null`  | Current avatar image URI        |
| `username`        | `string`   | `'U'`   | Fallback initial character      |
| `size`            | `number`   | `120`   | Circle diameter in pixels       |
| `editable`        | `boolean`  | `false` | Show camera overlay icon        |
| `onImageSelect`   | `function` | —       | Callback with selected URI (optional form field update) |
| `onImageSelectAndUpload` | `function` | — | Callback for auto-save/upload after selection `(uri) => Promise<void>` |
| `style`           | `ViewStyle`| —       | Container style override        |

**Usage Notes:**
- When `editable={true}`, tapping avatar opens image picker
- If `onImageSelectAndUpload` provided, fires after image selection with auto-upload flow
- If `onImageSelect` provided, fires to update form field
- Both callbacks can be provided simultaneously

### Typography (`src/components/common/Typography.jsx`)

| Prop      | Type       | Default    | Description                     |
| --------- | ---------- | ---------- | ------------------------------- |
| `variant` | `string`   | `'body'`   | `h1-h4`, `body`, `bodySmall`, `caption`, `display` |
| `color`   | `string`   | `'textPrimary'` | Key from `colors` object   |
| `weight`  | `string`   | —          | Override: `'regular'`, `'medium'`, `'semibold'`, `'bold'` |
| `align`   | `string`   | —          | Text alignment                  |
| `style`   | `TextStyle`| —          | Style override                  |

### Card (`src/components/common/Card.jsx`)

| Prop      | Type        | Default | Description              |
| --------- | ----------- | ------- | ------------------------ |
| `style`   | `ViewStyle` | —       | Container style override |
| `children`| `ReactNode` | —       | Card content             |

### TimeRangeSelector (`src/components/common/TimeRangeSelector.jsx`)

| Prop       | Type                           | Default  | Description                           |
| ---------- | ------------------------------ | -------- | ------------------------------------- |
| `selected` | `'week' \| 'month' \| 'year'`  | `'week'` | Currently selected time range         |
| `onSelect` | `function`                     | —        | Callback when range is selected       |

### ProgressChart (`src/components/charts/ProgressChart.jsx`)

| Prop   | Type                                  | Default | Description                        |
| ------ | ------------------------------------- | ------- | ---------------------------------- |
| `data` | `Array<{label: string, value: number}>` | `[]`  | Chart data points                  |

Data structure:
- `label`: X-axis label (Mon, Tue, Wk1, Jan, etc.)
- `value`: Y-axis value (0-100 performance metric)

### SessionScoreCard (`src/components/common/SessionScoreCard.jsx`)

| Prop       | Type       | Default | Description                              |
| ---------- | ---------- | ------- | ---------------------------------------- |
| `title`    | `string`   | —       | Session title/name                       |
| `subtitle` | `string`   | —       | Session metadata (date, duration)        |
| `score`    | `number`   | —       | Score value (0-100)                      |
| `onPress`  | `function` | —       | Press handler                            |

### FilterTabs (`src/components/common/FilterTabs.jsx`)

| Prop              | Type                                    | Default | Description                           |
| ----------------- | --------------------------------------- | ------- | ------------------------------------- |
| `tabs`            | `Array<{value: string, label: string}>` | `[]`    | Array of tab options                  |
| `selected`        | `string`                                | —       | Currently selected tab value          |
| `onSelect`        | `function`                              | —       | Callback when a tab is selected       |
| `containerStyle`  | `object`                                | —       | Optional container style override     |
| `tabStyle`        | `object`                                | —       | Optional tab style override           |
| `activeTabStyle`  | `object`                                | —       | Optional active tab style override    |
| `labelStyle`      | `object`                                | —       | Optional label style override         |
| `activeLabelStyle`| `object`                                | —       | Optional active label style override  |

**Default Pill Design:**
- Container: `borderRadius.full`, `gray100` bg, `1px gray300` border, 3px padding
- Tab: `borderRadius.full`, `paddingVertical: xs + 2`
- Active tab: `primary` background
- Label: `fontSize: 13`, `bodySmall` variant, `medium` weight

### ScriptCard (`src/components/common/ScriptCard.jsx`)

| Prop              | Type       | Default           | Description                              |
| ----------------- | ---------- | ----------------- | ---------------------------------------- |
| `title`           | `string`   | —                 | Script title/name                        |
| `description`     | `string`   | —                 | Script description/preview text          |
| `editedTime`      | `string`   | —                 | Last edited timestamp text               |
| `type`            | `string`   | `'self-authored'` | Script type (`'self-authored'` \| `'auto-generated'`) |
| `onEdit`          | `function` | —                 | Handler for Edit action (from 3-dot menu) |
| `onDelete`        | `function` | —                 | Handler for Delete action (from 3-dot menu) |
| `onPress`         | `function` | —                 | Handler for card press (optional)        |

**Internal State:**
- `menuVisible`: boolean — controls visibility of the overflow menu Modal

**3-Dot Overflow Menu:**
- Triggered by tapping the ellipsis-vertical icon in the top-right corner of the card
- Modal with fade animation shows two options:
  - **Edit** (create-outline icon) → calls `onEdit()`
  - **Delete** (trash-outline icon, red text) → calls `onDelete()`
- Menu closes on backdrop press or option selection

### Dropdown (`src/components/common/Dropdown.jsx`)

| Prop          | Type                                    | Default        | Description                              |
| ------------- | --------------------------------------- | -------------- | ---------------------------------------- |
| `value`       | `string`                                | —              | Currently selected value                 |
| `options`     | `Array<{label: string, value: string}>` | `[]`           | Array of selectable options              |
| `onSelect`    | `function`                              | —              | Callback when option is selected         |
| `placeholder` | `string`                                | `'Select...'`  | Placeholder text when no value selected  |

**Internal State:**
- `isOpen`: boolean for dropdown modal visibility

**Modal Behavior:**
- Shows overlay with dimmed background
- Displays options in a scrollable list
- Selected option is highlighted with checkmark icon
- Close on overlay tap or option selection

---

## 5b. API Modules

### scriptsApi (`src/api/scriptsApi.js`)

> Supabase CRUD operations for user scripts. Requires a `scripts` table in Supabase (see DDL below).

#### Exported Functions

| Function                     | Signature                                              | Returns                                  | Description                                          |
| ---------------------------- | ------------------------------------------------------ | ---------------------------------------- | ---------------------------------------------------- |
| `fetchScripts()`             | `() → Promise<{success, scripts?, error?}>`            | All scripts for current user, ordered by `updated_at` desc | Fetches all rows from `scripts` where `user_id` matches auth user |
| `fetchScriptById(scriptId)`  | `(string) → Promise<{success, script?, error?}>`       | Single script object                     | Fetches one script by primary key                    |
| `createScript(scriptData)`   | `({title, content, type}) → Promise<{success, script?, error?}>` | Newly created script row      | Inserts a new row with `user_id` auto-set from auth  |
| `updateScript(scriptId, updates)` | `(string, {title?, content?, type?}) → Promise<{success, script?, error?}>` | Updated script row | Patches a script and sets `updated_at` to `now()` |
| `deleteScript(scriptId)`     | `(string) → Promise<{success, error?}>`                | Success/error                            | Deletes a script by ID                               |

#### Required Supabase Table

```sql
CREATE TABLE public.scripts (
  id          uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id     uuid NOT NULL,
  title       text NOT NULL,
  content     text NOT NULL DEFAULT '',
  type        text NOT NULL DEFAULT 'self-authored'
                CHECK (type IN ('self-authored','auto-generated')),
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now(),
  CONSTRAINT scripts_pkey PRIMARY KEY (id),
  CONSTRAINT scripts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
```

> RLS policies should scope rows to the authenticated user's `user_id`.

### supabaseClient (`src/api/supabaseClient.js`)

Exports a configured `supabase` client instance used by all API modules. Uses `@supabase/supabase-js` with AsyncStorage for session persistence.

### authApi (`src/api/authApi.js`)

Handles authentication operations (login, register, logout, profile updates) via Supabase Auth.

### sessionApi (`src/api/sessionApi.js`)

Handles analysis session CRUD operations (fetch sessions, upload audio recordings, get session details).

---

## 6. Utility Functions

### Validators (`src/utils/validators.js`)

| Function                | Signature                              | Returns                     |
| ----------------------- | -------------------------------------- | --------------------------- |
| `isValidEmail(email)`   | `(string) → boolean`                  | Email format validity       |
| `validatePassword(pwd)` | `(string) → { isValid, message }`     | Password strength check     |
| `isNotEmpty(value)`     | `(string) → boolean`                  | Non-empty after trim        |

### Formatters (`src/utils/formatters.js`)

| Function                   | Signature                           | Returns              |
| -------------------------- | ----------------------------------- | -------------------- |
| `formatDate(date, type)`   | `(string, 'date'\|'datetime') → string` | Formatted date   |
| `formatDuration(seconds)`  | `(number) → string`                | Human-readable time  |
| `formatScore(score)`       | `(number) → string`                | Score as percentage  |

### Constants (`src/utils/constants.js`)

| Constant             | Value                    | Usage                     |
| -------------------- | ------------------------ | ------------------------- |
| `STORAGE_KEYS.AUTH_TOKEN` | `'auth_token'`       | AsyncStorage key          |
| `STORAGE_KEYS.USER_DATA` | `'user_data'`        | AsyncStorage key          |

---

## 7. Navigation Map

```
AppNavigator (root stack)
│
├── [Not Authenticated]
│   └── AuthNavigator (stack, animation: slide_from_right 200ms)
│       ├── Login        → LoginScreen
│       └── Register     → RegisterScreen
│
├── [Authenticated + No Nickname]
│   └── Nickname         → NicknameScreen
│
└── [Authenticated + Has Nickname]
    └── MainNavigator (stack, animation: slide_from_right 200ms)
        ├── MainTabs     → BottomTabNavigator
        │   ├── Scripts   → ScriptsScreen      (tab 1)
        │   ├── Progress  → ProgressScreen     (tab 2)
        │   ├── Dashboard → DashboardScreen    (tab 3, centre)
        │   ├── Profile   → ProfileScreen      (tab 4)
        │   └── Settings  → SettingsScreen     (tab 5)
        ├── Practice      → PracticeScreen     (stack screen)
        ├── GenerateScript → GenerateScriptScreen (stack screen)
        ├── TrainingSetup → TrainingSetupScreen (stack screen)
        ├── TrainingScripted → TrainingScriptedScreen (stack screen)
        ├── History       → HistoryScreen      (stack screen)
        ├── AllSessions   → AllSessionsScreen  (stack screen)
        ├── ScriptEditor  → ScriptEditorScreen (stack screen)
        ├── SessionDetail → SessionDetailScreen
        ├── SessionResult → SessionResultScreen
        ├── DetailedFeedback → DetailedFeedbackScreen
        ├── EditProfile   → EditProfileScreen
        ├── AccountSettings → AccountSettingsScreen
        ├── ChangePassword → ChangePasswordScreen
        └── AudioCameraTest → AudioCameraTestScreen
```

### BottomTabNavigator Keyboard Behavior

| Option                  | Value    | Description                                         |
| ----------------------- | -------- | --------------------------------------------------- |
| `tabBarHideOnKeyboard`  | `true`   | Hides floating tab bar when keyboard opens           |

### KeyboardAvoidingView Behavior

All form screens use `KeyboardAvoidingView` with:
- **iOS**: `behavior="padding"` — adjusts padding to keep fields visible
- **Android**: `behavior={undefined}` — relies on system `windowSoftInputMode` to handle keyboard avoidance without pushing the bottom navigation bar up

### Route Params Summary

| Route              | Params                                                    |
| ------------------ | --------------------------------------------------------- |
| `TrainingSetup`    | None (context from Dashboard "Start Training")           |
| `GenerateScript`   | `{entryPoint?: 'scripts' \| 'training'}`                 |
| `TrainingScripted` | `{focusMode, autoStart, scriptId?, scriptType?, entryPoint?}` |
| `Practice`         | None                                                      |
| `SessionDetail`    | `{sessionId}`                                             |
| `SessionResult`    | `{confidenceScore, summary, pitchStability, paceWpm, paceRating, resultMode}` |
| `DetailedFeedback` | `{resultMode, trainingParams, timelinePoints, eyeContact, bodyGestures, voice, feedbackItems}` |
| `AudioCameraTest`  | None (opened from Settings "Test Audio / Video")              |
| `ChangePassword`   | None (opened from Edit Profile "Change Password")             |
| `AccountSettings`  | None (opened from Edit Profile "Account Settings")            |
| All others         | No params                                                 |

### Screen Flow Diagram

```
Dashboard
  ├─→ "Start Training" button
  │    ↓
  │   TrainingSetup
  │    ├─→ Pre-written tab → Dropdown selector + Start Training button
  │    │    ↓
  │    │   TrainingScripted (focusMode: 'accuracy'|'free')
  │    │
  │    └─→ Auto-Generated tab → Generate Speech button
  │         ↓
  │        GenerateScript (entryPoint: 'training')
  │         ↓
  │        [Generate] → Review/Edit Modal → Save to Supabase
  │         ↓
  │        TrainingScripted (focusMode: 'free')
  │
  ├─→ "Start Practice" button
  │    ↓
  │   Practice
  │    ├─→ Pre-written tab → Script card list
  │    │    ├─(click script)→ TrainingScripted (focusMode: 'free')
  │    │
  │    └─→ Generate tab → Generate Speech button
  │         ↓
  │        GenerateScript (entryPoint: 'training')
  │         ↓
  │        TrainingScripted (focusMode: 'free')
  │
Scripts (tab 1)
  ├─→ "Generate Script" button
  │    ↓
  │   GenerateScript (entryPoint: 'scripts')
  │    ↓
  │   [Generate] → Review/Edit Modal → Save to Supabase → goBack()
  │
  ├─→ ScriptCard 3-dot → Edit → ScriptEditor
  └─→ ScriptCard 3-dot → Delete → Alert confirm → deleteScript()
  │
  └─→ [Other navigation paths...]
```

---

*Document generated for cross-platform variable reuse (React Native → Web).*
