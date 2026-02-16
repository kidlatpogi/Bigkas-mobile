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
   - [ProfileScreen](#49-profilescreen)
   - [EditProfileScreen](#410-editprofilescreen)
5. [Reusable Component Props](#5-reusable-component-props)
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

#### Navigation Actions

| Action                 | Destination        |
| ---------------------- | ------------------ |
| `navigation.navigate('Register')` | RegisterScreen |

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
**Route**: `Dashboard` (BottomTabNavigator — first tab)

#### Hook Destructuring

```js
const { user } = useAuth();
const { sessions, isLoading, fetchSessions } = useSessions();
```

#### Derived Variables

| Variable       | Type     | Derivation                                        | Description                      |
| -------------- | -------- | ------------------------------------------------- | -------------------------------- |
| `displayName`  | `string` | `user?.nickname \|\| user?.name \|\| 'Speaker'`   | Greeting name shown on dashboard |
| `greeting`     | `string` | Based on `new Date().getHours()` via `useMemo`    | `'Good morning,'` / `'Good afternoon,'` / `'Good evening,'` |
| `todayCount`   | `number` | `sessions.length \|\| 4`                          | Daily session count (placeholder)|
| `averageScore` | `number` | `84` (hardcoded placeholder)                      | Average score stat               |
| `streakCount`  | `number` | `3` (hardcoded placeholder)                       | Streak days stat                 |

#### From Hooks

| Variable        | Source           | Type         | Description                  |
| --------------- | ---------------- | ------------ | ---------------------------- |
| `user`          | `useAuth()`      | `object`     | Current user object          |
| `sessions`      | `useSessions()`  | `Session[]`  | Session list for stats       |
| `isLoading`     | `useSessions()`  | `boolean`    | Pull-to-refresh indicator    |
| `fetchSessions` | `useSessions()`  | `function`   | Load/refresh session list    |

#### Handlers

| Handler              | Trigger                   | Action                              |
| -------------------- | ------------------------- | ----------------------------------- |
| `handleRefresh()`    | Pull-to-refresh           | `fetchSessions(1, true)`           |
| `handleStartPractice()` | "Start Practice" press | `navigation.navigate('Practice')`  |
| `handleViewHistory()`   | "View History" press   | `navigation.navigate('History')`   |

#### UI Sections

| Section       | Content                                                    |
| ------------- | ---------------------------------------------------------- |
| Top Row       | `BrandLogo` + profile icon button                          |
| Header        | `greeting` + `displayName`                                 |
| Hero Card     | Black bg card with "Ready to speak?" + practice/training buttons |
| Stats Pill    | `todayCount` / `averageScore` / `streakCount`              |
| Motivation    | Static motivation text in Card                             |
| Quick Tip     | Static tip text in Card                                    |

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
| `navigation.navigate('SessionResult', { word, score })` | SessionResultScreen |

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

| Param      | Type     | Description                           |
| ---------- | -------- | ------------------------------------- |
| `word`     | `string` | The word that was practiced           |
| `score`    | `number` | Pronunciation score (0–1)            |
| `feedback` | `string` | Optional AI feedback text            |

#### Derived Variables

No local state — all data comes from route params.

#### Helper Functions (inline)

| Function           | Returns                              | Logic                                       |
| ------------------ | ------------------------------------ | ------------------------------------------- |
| `getScoreColor()`  | `'success' \| 'warning' \| 'error'` | `≥0.8` → success, `≥0.6` → warning, else error |
| `getScoreMessage()`| `string`                             | 5-tier message: Excellent (≥0.9), Great (≥0.8), Good (≥0.7), Not bad (≥0.6), Keep practicing |

#### Score Breakdown (Placeholder)

| Metric    | Computation             | Description                |
| --------- | ----------------------- | -------------------------- |
| Accuracy  | `score`                 | Direct score               |
| Fluency   | `score * 0.9`           | 90% of score (placeholder) |
| Clarity   | `score * 0.95`          | 95% of score (placeholder) |

#### Handlers

| Handler               | Trigger                | Action                              |
| --------------------- | ---------------------- | ----------------------------------- |
| `handleTryAgain()`    | "Try Again" press      | `navigation.goBack()`              |
| `handleNextWord()`    | "Next Word" press      | `navigation.navigate('Practice')`  |
| `handleViewHistory()` | "View History" press   | `navigation.navigate('History')`   |
| `handleGoToDashboard()` | "Go to Dashboard"   | `navigation.navigate('Dashboard')` |

---

### 4.9 ProfileScreen

**File**: `src/screens/Main/ProfileScreen.jsx`  
**Route**: `Profile` (BottomTabNavigator — fourth tab)

#### Hook Destructuring

```js
const { user, logout, isLoading } = useAuth();
const { reset: resetSessions } = useSessions();
```

#### From Hooks

| Variable         | Source           | Type       | Description                      |
| ---------------- | ---------------- | ---------- | -------------------------------- |
| `user`           | `useAuth()`      | `object`   | Current user                     |
| `logout`         | `useAuth()`      | `function` | Clears auth state + storage      |
| `isLoading`      | `useAuth()`      | `boolean`  | Loading indicator                |
| `resetSessions`  | `useSessions()`  | `function` | Clear session state on logout    |

#### Displayed User Fields

| Field                               | Section          | Display                        |
| ----------------------------------- | ---------------- | ------------------------------ |
| `user?.name?.charAt(0)?.toUpperCase()` | Avatar circle | Initial letter                 |
| `user?.name`                        | Below avatar     | Full name                      |
| `user?.email`                       | Below name       | Email address                  |

#### Handlers

| Handler           | Trigger                  | Action                                         |
| ----------------- | ------------------------ | ---------------------------------------------- |
| `handleEditProfile()` | "Edit Profile" press | `navigation.navigate('EditProfile')`           |
| `handleLogout()`  | "Logout" button press    | Shows Alert; on confirm: `resetSessions()` + `logout()` |

#### UI Cards

| Card Section     | Static Content                       |
| ---------------- | ------------------------------------ |
| Stats Card       | Total Sessions (0), Avg Score (—), Streak (0) — placeholders |
| Settings Card    | Notifications, Language, Dark Mode — placeholder rows |
| About Card       | Version, Terms, Privacy — placeholder rows |

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
| `handleChangePassword()` | "Change Password" row    | Placeholder Alert                                   |
| `handleAccountSettings()` | "Account Settings" row  | Placeholder Alert                                   |

#### Components Used

| Component      | Props                                 | Description               |
| -------------- | ------------------------------------- | ------------------------- |
| `AvatarPicker` | `uri`, `onImageSelected`, `size`, `editable` | Avatar selection with camera icon |
| `TextField`    | `label`, `value`, `onChangeText`, `error` | Form inputs              |

---

## 5. Reusable Component Props

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
| `onImageSelected` | `function` | —       | Callback with selected URI      |
| `size`            | `number`   | `120`   | Circle diameter                 |
| `editable`        | `boolean`  | `true`  | Show camera overlay icon        |

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
│   └── AuthNavigator (stack)
│       ├── Login        → LoginScreen
│       └── Register     → RegisterScreen
│
├── [Authenticated + No Nickname]
│   └── Nickname         → NicknameScreen
│
└── [Authenticated + Has Nickname]
    └── MainNavigator (stack)
        ├── BottomTabs   → BottomTabNavigator
        │   ├── Dashboard → DashboardScreen
        │   ├── Practice  → PracticeScreen
        │   ├── History   → HistoryScreen
        │   └── Profile   → ProfileScreen
        ├── SessionDetail → SessionDetailScreen
        ├── SessionResult → SessionResultScreen
        └── EditProfile   → EditProfileScreen
```

### Route Params Summary

| Route          | Params                                 |
| -------------- | -------------------------------------- |
| `SessionDetail`| `{ sessionId: string }`                |
| `SessionResult`| `{ word: string, score: number, feedback?: string }` |
| All others     | No params                              |

---

*Document generated for cross-platform variable reuse (React Native → Web).*
