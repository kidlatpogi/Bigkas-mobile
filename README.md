# Bigkas

Filipino pronunciation practice app with AI-powered analysis.

## 📱 Tech Stack

- **React Native** (Expo) for cross-platform mobile development
- **Supabase** for authentication, database, and storage
- **Inter** font family for consistent typography

## 🎨 Design System

### Colors
| Variable | Hex | Usage |
|----------|-----|-------|
| `primary` | `#FBAF00` | Primary brand color (yellow) |
| `background` | `#F5F5F5` | App background |
| `black` / `secondary` | `#010101` | Dark elements, buttons |
| `white` | `#FFFFFF` | Cards, inputs, light elements |

### Typography
- **Font Family**: Inter (Regular, Medium, Bold)
- **Header**: Inter Bold, 32px
- **Subheader**: Inter Medium, 16px, 60% opacity

### Spacing
- Based on 4px grid: `xs` (4), `sm` (8), `md` (16), `lg` (24), `xl` (32)

## 🗂️ Project Structure

```
src/
├── api/              # API clients (Supabase, REST)
├── components/       # Reusable UI components
│   ├── audio/        # Audio recording components
│   └── common/       # BrandLogo, TextField, AvatarPicker, etc.
├── config/           # Environment configuration
├── context/          # React Context providers
├── hooks/            # Custom React hooks
├── navigation/       # Navigation setup (stacks, tabs)
├── screens/          # App screens organized by feature
│   ├── Auth/         # Login, Register
│   ├── Main/         # Dashboard, Profile, Practice, History
│   ├── Onboarding/   # First-login nickname setup
│   └── Session/      # Session details, results
├── styles/           # Global styles (colors, spacing, typography)
└── utils/            # Constants, formatters, validators
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd Bigkas
```

2. Install dependencies:
```bash
npm install
```

3. Install fonts:
```bash
npx expo install @expo-google-fonts/inter expo-font
```

4. Install required packages:
```bash
npx expo install @supabase/supabase-js expo-image-picker @react-native-async-storage/async-storage
```

5. Create `.env` file in root:
```env
SUPABASE_URL=https://pkshjglggqfuostxpllo.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
```

6. Start the development server:
```bash
npx expo start
```

7. Run on Android:
- Press `a` in Expo CLI, or
- Open Android Studio and run on emulator/device

## 🔐 Environment Variables

| Variable | Description | Location |
|----------|-------------|----------|
| `SUPABASE_URL` | Supabase project URL | `.env` |
| `SUPABASE_ANON_KEY` | Supabase anon/public key | `.env` |

> **Note**: `.env` is gitignored. Never commit secrets to version control.

## 🗄️ Supabase Setup

### Database Schema

See the full SQL schema in the project documentation. Key tables:

- **profiles**: User data (first_name, last_name, nickname, avatar_url, role)
- **analysis_sessions**: Practice session recordings and scores
- **audit_logs**: Admin/superadmin activity tracking

### Row Level Security (RLS)

- Users can only read/write their own profiles and sessions
- Admins/superadmins can view all data
- Audit logs are admin-only

### Storage Buckets

Create a `videos` bucket in Supabase Storage for session recordings.

## 📦 Component Reusability

All components are documented with JSDoc for web version reuse:

```jsx
/**
 * @param {string} label - Input label text
 * @param {string} value - Input value
 * @param {Function} onChangeText - Change handler
 */
```

### Key Reusable Components

- `BrandLogo` - App logo with soundwave icon
- `TextField` - Labeled text input with error state
- `PasswordField` - Password input with visibility toggle
- `PrimaryButton` - Button with variants (primary, secondary, outline)
- `AvatarPicker` - Avatar display + image picker
- `BottomTabNavigator` - Shared bottom navigation

## 🔄 State Management

- **AuthContext**: User auth state, login/logout/register
- **SessionContext**: Practice session data

## 📝 Variable Naming Conventions

For cross-platform (mobile + web) reuse:

| Purpose | Variable Name | Type |
|---------|---------------|------|
| User first name | `firstName` | string |
| User last name | `lastName` | string |
| Display alias | `nickname` | string |
| Session score | `final_score` | number (0-100) |
| Daily sessions | `daily_session_count` | number |
| User role | `role` | 'user' \| 'admin' \| 'superadmin' |

## 🎯 Responsive Design

- All layouts use percentage widths and `maxWidth` constraints
- Centered content wrapper (`maxWidth: 420`)
- Android-first design (tested on Pixel emulators)

## 🧪 Testing

Run on Android emulator:
```bash
npx expo start --android
```

## 📄 License

Private project - All rights reserved.

---

Built for Android-first deployment with Expo and Supabase.
