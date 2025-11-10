# GitHub Issues for ssb

Total Issues: 19

---

## 🔵 #19: Add analytics

**State:** OPEN
**Created:** 2025-11-09T14:53:49Z
**Updated:** 2025-11-09T14:53:49Z
**Comments:** 0
**URL:** https://github.com/lourencokramerhorta/ssb/issues/19

**Description:**

**Labels:**
```
enhancement, analytics
```

**Description:**
```
Add analytics to track user behavior and app usage.
```

**Acceptance Criteria:**
```
- Choose analytics service
- Integrate analytics SDK
- Track key user events
- Set up analytics dashboard
```

---

## 🔵 #18: Add error tracking

**State:** OPEN
**Created:** 2025-11-09T14:53:39Z
**Updated:** 2025-11-09T14:53:39Z
**Comments:** 0
**URL:** https://github.com/lourencokramerhorta/ssb/issues/18

**Description:**

**Labels:**
```
enhancement, monitoring
```

**Description:**
```
Integrate error tracking service (Sentry, Bugsnag, etc.) to monitor app errors in production.
```

**Acceptance Criteria:**
```
- Choose error tracking service
- Integrate SDK
- Set up error reporting
- Configure error alerts
```

---

## 🔵 #17: Add Android-specific features

**State:** OPEN
**Created:** 2025-11-09T14:53:02Z
**Updated:** 2025-11-09T14:53:02Z
**Comments:** 0
**URL:** https://github.com/lourencokramerhorta/ssb/issues/17

**Description:**

**Labels:**
```
enhancement, android
```

**Description:**
```
Add Android-specific features like fingerprint authentication.
```

**Acceptance Criteria:**
```
- Research biometric authentication options
- Implement fingerprint login
- Test on Android devices
```

---

## 🔵 #16: Add iOS-specific features

**State:** OPEN
**Created:** 2025-11-09T14:52:51Z
**Updated:** 2025-11-09T14:52:51Z
**Comments:** 0
**URL:** https://github.com/lourencokramerhorta/ssb/issues/16

**Description:**

**Labels:**
```
enhancement, ios
```

**Description:**
```
Add iOS-specific features like Face ID / Touch ID authentication.
```

**Acceptance Criteria:**
```
- Research biometric authentication options
- Implement Face ID / Touch ID login
- Test on iOS devices
```

---

## 🔵 #15: Optimize bundle size

**State:** OPEN
**Created:** 2025-11-09T14:52:23Z
**Updated:** 2025-11-09T14:52:23Z
**Comments:** 0
**URL:** https://github.com/lourencokramerhorta/ssb/issues/15

**Description:**

**Labels:**
```
performance, enhancement
```

**Description:**
```
Review and optimize the app bundle size for faster load times.
```

**Acceptance Criteria:**
```
- Analyze bundle size
- Remove unused dependencies
- Implement code splitting if needed
- Optimize images and assets
```

---

## 🔵 #14: Add input sanitization

**State:** OPEN
**Created:** 2025-11-09T14:52:10Z
**Updated:** 2025-11-09T14:52:10Z
**Comments:** 0
**URL:** https://github.com/lourencokramerhorta/ssb/issues/14

**Description:**

**Labels:**
```
security, enhancement
```

**Description:**
```
Add input sanitization for all user inputs to prevent XSS and other attacks.
```

**Acceptance Criteria:**
```
- Sanitize all text inputs
- Validate and sanitize email inputs
- Add rate limiting on client side
- Review all user input handling
```

---

## 🔵 #13: Add session timeout handling

**State:** OPEN
**Created:** 2025-11-09T14:51:54Z
**Updated:** 2025-11-09T14:51:54Z
**Comments:** 0
**URL:** https://github.com/lourencokramerhorta/ssb/issues/13

**Description:**

**Labels:**
```
security, enhancement
```

**Description:**
```
Implement automatic session timeout and refresh token handling.
```

**Acceptance Criteria:**
```
- Handle token refresh automatically
- Show session timeout warnings
- Handle expired sessions gracefully
- Redirect to login on session expiry
```

---

## 🔵 #12: Add API documentation

**State:** OPEN
**Created:** 2025-11-09T14:51:22Z
**Updated:** 2025-11-09T14:51:22Z
**Comments:** 0
**URL:** https://github.com/lourencokramerhorta/ssb/issues/12

**Description:**

**Labels:**
```
documentation
```

**Description:**
```
Document the authentication API and service functions for future developers.
```

**Acceptance Criteria:**
```
- Document all auth service functions
- Add JSDoc comments to functions
- Creat

---

## 🔵 #11: Add form validation feedback

**State:** OPEN
**Created:** 2025-11-09T14:51:06Z
**Updated:** 2025-11-09T14:51:06Z
**Comments:** 0
**URL:** https://github.com/lourencokramerhorta/ssb/issues/11

**Description:**

**Labels:**
```
enhancement, ux
```

**Description:**
```
Currently validation errors show in alerts. Add inline validation feedback on form fields.
```

**Acceptance Criteria:**
```
- Show validation errors below input fields
- Add visual indicators (red borders, error icons)
- Real-time validation feedback
- Improve accessibility
```

---

## 🔵 #10: Improve error handling and user feedback

**State:** OPEN
**Created:** 2025-11-09T14:50:58Z
**Updated:** 2025-11-09T14:50:58Z
**Comments:** 0
**URL:** https://github.com/lourencokramerhorta/ssb/issues/10

**Description:**

**Labels:**
```
enhancement, ux
```

**Description:**
```
Currently using Alert.alert() for errors. Consider implementing a toast notification system for better UX.
```

**Acceptance Criteria:**
```
- Install toast notification library
- Replace Alert.alert with toast notifications
- Add success/error/info toast types
- Improve error messages throughout app
```

---

## 🔵 #9: Add E2E tests for critical flows

**State:** OPEN
**Created:** 2025-11-09T14:50:48Z
**Updated:** 2025-11-09T14:50:48Z
**Comments:** 0
**URL:** https://github.com/lourencokramerhorta/ssb/issues/9

**Description:**

**Labels:**
```
testing, enhancement
```

**Description:**
```
Add end-to-end tests for critical user flows (registration, login, logout).
```

**Acceptance Criteria:**
```
- Set up E2E testing (Detox or similar)
- Test registration flow
- Test login flow
- Test protected routes
```

---

## 🔵 #8: Add unit tests for authentication flow

**State:** OPEN
**Created:** 2025-11-09T14:50:38Z
**Updated:** 2025-11-09T14:50:38Z
**Comments:** 0
**URL:** https://github.com/lourencokramerhorta/ssb/issues/8

**Description:**

**Labels:**
```
testing, enhancement
```

**Description:**
```
Add unit tests for authentication services and hooks to ensure reliability.
```

**Acceptance Criteria:**
```
- Set up testing framework (Jest + React Native Testing Library)
- Write tests for auth service functions
- Write tests for useAuth hook
- Achieve >80% coverage for auth code
```

---

## 🔵 #7: Remove debug console.logs from production

**State:** OPEN
**Created:** 2025-11-09T14:50:27Z
**Updated:** 2025-11-09T14:50:27Z
**Comments:** 0
**URL:** https://github.com/lourencokramerhorta/ssb/issues/7

**Description:**

**Labels:**
```
technical-debt, cleanup
```

**Description:**
```
Some debug console.logs are wrapped in `__DEV__` checks, but we should ensure all debug logs are properly handled for production builds.
```

**Acceptance Criteria:**
```
- Audit all console.log statements
- Ensure all are wrapped in `__DEV__` or removed
- Test production build has no debug logs
```

---

## 🔵 #6: Loading States and Skeleton Screens

**State:** OPEN
**Created:** 2025-11-09T14:50:13Z
**Updated:** 2025-11-09T14:50:13Z
**Comments:** 0
**URL:** https://github.com/lourencokramerhorta/ssb/issues/6

**Description:**

**Labels:**
```
enhancement, ux
```

**Description:**
```
Improve loading states throughout the app with skeleton screens instead of just spinners.
```

**Acceptance Criteria:**
```
- Create skeleton screen components
- Add loading states to all async operations
- Improve perceived performance
```

---

## 🔵 #5: OAuth Authentication (Google, Apple)

**State:** OPEN
**Created:** 2025-11-09T14:49:59Z
**Updated:** 2025-11-09T14:49:59Z
**Comments:** 0
**URL:** https://github.com/lourencokramerhorta/ssb/issues/5

**Description:**

**Labels:**
```
feature, authentication
```

**Description:**
```
Add OAuth providers (Google, Apple) for easier authentication.
```

**Acceptance Criteria:**
```
- Configure OAuth providers in Supabase
- Add OAuth buttons to login/register screens
- Handle OAuth callback flow
- Test on iOS and Android
```

---

## 🔵 #4: Password Reset Flow

**State:** OPEN
**Created:** 2025-11-09T14:49:46Z
**Updated:** 2025-11-09T14:49:46Z
**Comments:** 0
**URL:** https://github.com/lourencokramerhorta/ssb/issues/4

**Description:**

**Labels:**
```
feature, authentication
```

**Description:**
```
Implement forgot password functionality with email reset link.
```

**Acceptance Criteria:**
```
- Add "Forgot Password" link on login screen
- Create password reset screen
- Handle password reset email flow
- Allow users to set new password
```

---

## 🔵 #3: User Profile Management

**State:** OPEN
**Created:** 2025-11-09T14:49:33Z
**Updated:** 2025-11-09T14:49:33Z
**Comments:** 0
**URL:** https://github.com/lourencokramerhorta/ssb/issues/3

**Description:**

**Labels:**
```
feature, enhancement
```

**Description:**
```
Add user profile functionality where users can view and edit their profile information (name, avatar, bio, etc.).
```

**Acceptance Criteria:**
```
- Create profiles table in Supabase
- Add profile screen
- Allow users to view/edit their profile
- Upload and manage avatar images
```

---

## 🔵 #2: Rate limiting error messages could be more user-friendly

**State:** OPEN
**Created:** 2025-11-09T14:49:18Z
**Updated:** 2025-11-09T14:49:18Z
**Comments:** 0
**URL:** https://github.com/lourencokramerhorta/ssb/issues/2

**Description:**

**Labels:**
```
enhancement, ux
```

**Description:**
```
When Supabase rate limits sign-up attempts, the error message is technical ("For security purposes, you can only request this after X seconds"). Should show a more user-friendly message with a countdown or suggestion to wait.
```

**Acceptance Criteria:**
```
- Parse rate limit errors
- Show user-friendly message
- Optionally show countdown timer
```

---

## 🔵 #1: Email confirmation flow not handled

**State:** OPEN
**Created:** 2025-11-09T14:48:14Z
**Updated:** 2025-11-09T14:48:35Z
**Comments:** 0
**URL:** https://github.com/lourencokramerhorta/ssb/issues/1

**Description:**

**Labels:**
```
bug, authentication
```

**Description:**
```
When users register, Supabase may require email confirmation. Currently, the app doesn't handle the email confirmation flow or show appropriate messaging for unconfirmed accounts.
```

**Acceptance Criteria:**
```
- Show clear message about email confirmation after registration
- Handle email confirmation redirect/link
- Prevent login for unconfirmed accounts (if required by Supabase settings)
```

---

