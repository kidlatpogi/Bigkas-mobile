/**
 * Email Configuration Diagnostic Tool
 * 
 * This file helps diagnose email configuration issues
 * Run this from the Supabase SQL editor or check logs
 */

// ══════════════════════════════════════════════════════════════
// WHAT TO CHECK IN SUPABASE DASHBOARD
// ══════════════════════════════════════════════════════════════

// 1. CHECK AUTH CONFIGURATION
// Path: Project Settings → Auth
// Look for these settings:
//   - SMTP Host: smtp.resend.com
//   - SMTP Port: 465 or 587
//   - SMTP User: default
//   - From Email: your-verified-domain@example.com
//   - From Name: Bigkas

// 2. CHECK EMAIL LOGS
// Path: Database → Logs (or Project Settings → Logs)
// Search for: "auth"
// Look for email sending events
// Errors will show here if SMTP fails

// 3. VERIFY EMAIL TEMPLATES
// Path: Authentication → Email Templates
// Should see 3 templates:
//   ✓ Confirm signup (for registration)
//   ✓ Confirm email change (for email updates)
//   ✓ Reset password (for forgot password)

// ══════════════════════════════════════════════════════════════
// RESEND SETUP VERIFICATION
// ══════════════════════════════════════════════════════════════

export const emailSetupChecklist = {
  resend: {
    completed: false,
    items: [
      { check: 'Resend account created', url: 'https://resend.com' },
      { check: 'API key generated', url: 'https://resend.com/api-keys' },
      { check: 'Domain added to Resend', url: 'https://resend.com/domains' },
      { check: 'Domain verified (DNS records)', url: 'https://resend.com/domains' },
      { check: 'API key copied', status: 'required' },
    ],
  },
  supabase: {
    completed: false,
    items: [
      { check: 'Go to Project Settings → Auth' },
      { check: 'Find "Email Configuration" section' },
      { check: 'Click "SMTP Settings"' },
      { check: 'Enter SMTP Host: smtp.resend.com' },
      { check: 'Enter SMTP Port: 465' },
      { check: 'Enter SMTP User: default' },
      { check: 'Enter SMTP Password: (your Resend API key)' },
      { check: 'Enter From Email: onboarding@resend.dev (or your domain)' },
      { check: 'Enter From Name: Bigkas' },
      { check: 'Click Save' },
    ],
  },
  testing: {
    completed: false,
    steps: [
      'Go to Authentication → Email Templates',
      'Click "Confirm signup" template',
      'Click "Preview" button',
      'Enter a test email address',
      'Click "Send test email"',
      'Check your inbox (check spam too)',
      'If you receive email → ✅ Setup working!',
    ],
  },
};

// ══════════════════════════════════════════════════════════════
// COMMON ERROR MESSAGES & SOLUTIONS
// ══════════════════════════════════════════════════════════════

export const errorSolutions = {
  'Failed to send email': {
    causes: [
      'SMTP credentials not configured in Supabase',
      'SMTP Host is wrong (should be: smtp.resend.com)',
      'SMTP Port is wrong (should be: 465 or 587)',
      'SMTP Password (API key) is incorrect',
    ],
    solution: 'Re-check Supabase SMTP settings in Project Settings → Auth',
  },
  
  'Invalid sender address': {
    causes: [
      'From Email is not verified in Resend',
      'Using onboarding@resend.dev without Resend setup',
      'Domain not added to Resend',
    ],
    solution: 'Add your domain to Resend and verify DNS records',
  },

  'SMTP authentication failed': {
    causes: [
      'API key is incorrect',
      'API key is expired or revoked',
      'Copy-paste included extra spaces',
    ],
    solution: 'Generate new API key in Resend and update Supabase',
  },

  'Domain not verified': {
    causes: [
      'DNS records not added',
      'DNS records not propagated yet (can take time)',
      'DNS records added to wrong domain',
    ],
    solution: 'Go to Resend → Domains → Add DNS records → Wait for verification',
  },

  'Connection timeout': {
    causes: [
      'SMTP Host is wrong',
      'SMTP Port is blocked by firewall',
      'Network connectivity issue',
    ],
    solution: 'Use Port 587 instead of 465, or check firewall settings',
  },
};

// ══════════════════════════════════════════════════════════════
// HOW TO FIND YOUR RESEND API KEY
// ══════════════════════════════════════════════════════════════

export const resendApiKeyGuide = `
1. Go to https://resend.com
2. Sign in to your account
3. Click on your avatar (top right)
4. Select "API Keys"
5. You see your API key (starts with: re_XXXX...)
6. Click "Copy" button
7. Use this key in Supabase SMTP Password field
`;

// ══════════════════════════════════════════════════════════════
// HOW TO VERIFY RESEND DOMAIN
// ══════════════════════════════════════════════════════════════

export const resendDomainGuide = `
STEP 1: Add Domain to Resend
  1. Go to https://resend.com/domains
  2. Click "Add Domain"
  3. Enter your domain (e.g., example.com)
  4. Click "Add Domain"

STEP 2: Add DNS Records
  1. Supabase will show DNS records to add
  2. Go to your domain provider (GoDaddy, Namecheap, etc.)
  3. Find DNS/MX Records section
  4. Add the records shown by Resend
  5. Save changes

STEP 3: Wait for Verification
  1. Return to Resend
  2. Resend checks periodically
  3. Once DNS propagates, domain is verified
  4. You'll see green checkmark

STEP 4: Use Domain in Supabase
  1. Go to Supabase → Project Settings → Auth
  2. In SMTP settings, use: noreply@yourdomain.com
  3. Save settings
`;

// ══════════════════════════════════════════════════════════════
// TROUBLESHOOTING: CHECK THESE IN ORDER
// ══════════════════════════════════════════════════════════════

export const troubleshootingSteps = [
  {
    step: 1,
    action: 'Check Supabase Email Configuration',
    how: 'Project Settings → Auth → SMTP Settings → Verify all fields filled',
    expected: 'All 5 SMTP fields should have values',
  },
  {
    step: 2,
    action: 'Check Resend API Key',
    how: 'https://resend.com/api-keys → Copy API key again',
    expected: 'Key should start with re_',
  },
  {
    step: 3,
    action: 'Check Email Templates',
    how: 'Authentication → Email Templates → Should see 3 templates',
    expected: 'Confirm signup, Confirm email change, Reset password',
  },
  {
    step: 4,
    action: 'Send Test Email',
    how: 'Email Templates → Any template → Send test email',
    expected: 'Email arrives in inbox within 1 minute',
  },
  {
    step: 5,
    action: 'Check Logs',
    how: 'Supabase Logs → Filter by "auth" → Look for email events',
    expected: 'Should see successful or failed email events',
  },
];

// ══════════════════════════════════════════════════════════════
// RESEND vs SUPABASE DEFAULT EMAIL
// ══════════════════════════════════════════════════════════════

export const emailProviderComparison = {
  supabaseDefault: {
    name: 'Supabase Default Email',
    pros: [
      'No setup needed',
      'Free',
      'Works out of the box',
    ],
    cons: [
      'Low delivery rate',
      'Emails often go to spam',
      'Rate limited',
      'Generic from address',
    ],
    setup: 'Just turn on Email provider in Auth',
  },
  
  resendSmtp: {
    name: 'Resend SMTP',
    pros: [
      'High delivery rate',
      'Custom domain support',
      'Emails from your domain',
      'Better spam filtering',
      'Analytics',
    ],
    cons: [
      'Requires setup',
      'Paid tier has costs (free tier: 100 emails/day)',
    ],
    setup: 'Follow RESEND_SMTP_SETUP.md',
  },
};

// ══════════════════════════════════════════════════════════════
// QUICK FIXES
// ══════════════════════════════════════════════════════════════

export const quickFixes = [
  {
    problem: 'Emails not sent',
    fixes: [
      'FIRST: Check SMTP is configured in Supabase',
      'SECOND: Try sending test email from Email Templates',
      'THIRD: Check Supabase logs for error messages',
      'FOURTH: Re-enter Resend API key (may have typo)',
      'FIFTH: Create new API key in Resend and try again',
    ],
  },
  {
    problem: 'Emails sent but user doesn\'t receive',
    fixes: [
      'Check spam/junk folder',
      'Verify "From Email" in Supabase matches verified domain',
      'Check Resend domain verification (should be green checkmark)',
      'Test with a different email address',
      'Check Resend dashboard for delivery status',
    ],
  },
  {
    problem: 'Emails arriving very slowly',
    fixes: [
      'Normal - can take 1-5 minutes',
      'Check spam filter on recipient side',
      'Try different email address to rule out recipient issues',
      'Check Supabase/Resend logs for delays',
    ],
  },
  {
    problem: 'Getting "Failed to send" in app',
    fixes: [
      'This is likely Supabase auth error, not email',
      'Check browser console for error details',
      'Check Supabase logs',
      'Verify email address format is valid',
      'Try with different email address',
    ],
  },
];

// ══════════════════════════════════════════════════════════════
// TEST FLOW
// ══════════════════════════════════════════════════════════════

export const testingFlow = `
COMPLETE TEST FLOW:

1. Open your app
2. Go to Register screen
3. Enter:
   - First Name: Test
   - Last Name: User
   - Email: your-working-email@gmail.com
   - Password: TestPass123!
4. Click "Create Account"
5. You should see confirmation screen
6. Check your email inbox
   - ✓ Should receive email within 1 minute
   - ✓ Email should be from: onboarding@resend.dev
   - ✓ Subject: "Confirm your Email"
7. Click verification link in email
8. Return to app
9. Go to Login
10. Enter same email + password
11. Should login successfully

IF ANY STEP FAILS:
  → See errorSolutions and troubleshootingSteps above
  → Check Supabase logs for error messages
  → Re-verify SMTP configuration
`;

export default {
  emailSetupChecklist,
  errorSolutions,
  troubleshootingSteps,
  resendApiKeyGuide,
  resendDomainGuide,
  quickFixes,
  testingFlow,
};
