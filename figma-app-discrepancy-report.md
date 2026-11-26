# Replate App vs. Figma (`Hifi's (DEVS LOOK HERE)`) Discrepancy Report

**Figma File:** `REPLATE` (`YX5gbW1PWSKeLFipy10sA3`), Page `Hifi's (DEVS LOOK HERE)` (`node-id=997:354`)  
**Inspected Via:** Figma MCP (`get_metadata`, `get_screenshot`, `get_design_context`), Expo MCP (`expo_router_sitemap`, `automation_take_screenshot`, `automation_tap`, `collect_app_logs` on iOS Simulator), and direct codebase inspection.  
**Note:** No application code or Figma designs were modified.

---

## Executive Summary & Cross-Cutting Issues

### Critical Bugs & Live-App Findings (Observed via Expo MCP & Code)

1. **Duplicate React Key Error Banner in Live App (`src/app/(tabs)/my-tasks.tsx`):**
   - Observed live in the iOS simulator (`Encountered two children with the same ke...` error toast at the bottom of the screen).
   - `my-tasks.tsx` fetches `MY_TASKS?driver_id=...` and `MY_TASKS?driver_id=...&status=complete,failed` in parallel and concatenates `[...activeTasks, ...historyTasks]` (`my-tasks.tsx:152-163`), then renders with `key={task.id}` (`my-tasks.tsx:373`). Overlapping or duplicate task IDs trigger React duplicate-key errors.
2. **Missing Bottom CTA Bar on `Pick-Up` Details Screen (`src/app/pickup-details/[id].tsx`):**
   - Observed live in the iOS simulator when opening a claimed task from Home: the bottom sticky container (`Claim before ...` / `Task in progress` rendered inside `<Animated.View entering={FadeInDown.delay(600).duration(400)} style={styles.bottomContainer}>`) never appeared on screen.
3. **Broken Recipient Dropdown Layout on `Add details` (`src/app/donation-details/[id].tsx`):**
   - Observed live in the iOS simulator: opening the `Recipient` dropdown (`DropDownPicker` with `listMode="SCROLLVIEW"`) causes the `Add Pick-up Image` label to disappear behind the list and clips/collapses the floating card layout rather than overlaying cleanly.
4. **Destructive Actions Without Confirmation Modals (`src/app/donation-details/[id].tsx`):**
   - Both `Complete` and `Missed` submit immediately without showing the Figma confirmation modals (`Mark task as completed?` / `Mark task as missed?`).
5. **Fake "Undo" on Task Claim (`src/app/pickup-details/[id].tsx:193-196`):**
   - Tapping `Undo` on the `Added to Active Tasks` banner only flips local `isTaskAdded` state back to `false` and shows a toast; it never unclaims the task on the backend.
6. **Outdated Color Tokens & Font References (`src/styles/colors.ts`, `src/styles/authStyles.ts`, `src/styles/tabs/my-account-styles.ts`):**
   - Auth, Onboarding, and Landing screens use legacy `#58AD85` (`colors.jasmine`) instead of Figma's `#2BB081` (`primaryGreen`) / `#259D73` (`secondaryGreen`), and `#FFFFFF` backgrounds instead of `#F8FAFC` (`lightBg`).
   - `my-account-styles.ts:91` references `fontFamily: 'AvenirBold'`, which is not loaded in `src/app/_layout.tsx` (only `Lato`, `LatoBold`, `LatoBlack`, `LatoLight` are loaded), causing a silent fallback to the system font.
   - Bottom tab bar (`src/app/(tabs)/_layout.tsx:34-35`) uses `#06B97C` (active) and `#A0A0A0` (inactive) instead of Figma's `#2BB081` and `#CBD5E1`.

---

## 1. `ONBOARDING` (`node-id=997:878`)

**Figma Flow:** `Loading Page` (`2389:15784`) → `Sign up` (`2390:16588`–`2390:18198`, `2390:19190`) → Error states (`2390:18418`, `2390:18804`, `2390:19061`) → `Sign up: Entering desired NPO` (`2390:19321`, `2390:19577`, `2390:19622`)  
**App Routes:** [src/app/landing/index.tsx](file:///Users/adityapawar_1/Documents/school/college/blueprint/replate/src/app/landing/index.tsx), [src/app/auth/signup/index.tsx](file:///Users/adityapawar_1/Documents/school/college/blueprint/replate/src/app/auth/signup/index.tsx), [src/app/onboarding/index.tsx](file:///Users/adityapawar_1/Documents/school/college/blueprint/replate/src/app/onboarding/index.tsx)

### Discrepancies

- **Landing Page (`Loading Page` vs. `landing/index.tsx`):**
  - **Button styles are inverted:** Figma shows `LOGIN` as solid green (`#2BB081`, white text) and `SIGN UP` as outlined (`#2BB081` border and `#259D73` text). The app renders `LOGIN` as outlined (`#58AD85`) and `SIGNUP` as solid (`#58AD85`).
  - **Button copy:** Figma uses `SIGN UP` (two words); app uses `SIGNUP` (`landing/index.tsx:119`).
  - **Colors & background:** Figma uses `#F8FAFC` background and `#259D73` for `Welcome!`; app uses `#FFFFFF` background and `#000000` for `Welcome!`.
- **Sign Up Form (`signup/index.tsx`):**
  - **Typo in password requirement:** Line 634 renders `'1 lowercase letter number'` instead of `'1 lowercase letter'`.
  - **Requirement count mismatch:** Figma lists **4** requirements (`8 characters`, `1 uppercase letter`, `1 special character`, `1 number`); the app checks **5** (adds `1 lowercase letter number`).
  - **Header & branding:** Figma's Sign up screen has no Replate logo and no `< Back` button, and uses `#259D73` for `Welcome!` on `#F8FAFC`. The app includes both the logo (`signup/index.tsx:441-443`) and `< Back` (`BackButton`), with `#000000` title on `#FFFFFF`.
  - **Name row labels:** Figma has a single `NAME` label spanning the two side-by-side inputs (`First name `, `Last name `). The app adds a second `LAST` label above the last-name input (`signup/index.tsx:483`).
  - **Password visibility control:** Figma uses an eye icon (`PasswordEye`); the app uses text `'Show'` / `'Hide'`.
  - **Button label & spacing:** Figma button reads `CONTINUE`; the app reads `'Continue '` (sentence case with a trailing space, `signup/index.tsx:760`), and uses `#58AD85` with `0.5` opacity when disabled instead of solid `#A3A3A3`.
  - **Error states:** Figma shows `Please enter a valid email address.` / `Account already exists.` / `Please enter a valid phone number.` / `Passwords don’t match.` (`#EF4444` or `#DF2125`), whereas `authStyles.ts:168-174` uses `ERROR_COLOR = '#FF4444'` with `marginTop: -16` (tightly hugging/overlapping input bottom margins) and `validation.ts` uses slightly different phrasing (e.g., `'Passwords do not match'`, `'Please enter a valid email address'`).
- **NPO Selection (`onboarding/index.tsx` & `onboarding-styles.tsx`):**
  - **Header mismatch:** Figma displays `Welcome!` (`#259D73`) + `Please enter your details` (`#A3A3A3`) at the top (`2390:19321`) and no Replate logo. The app renders the Replate logo and omits `Welcome!` / `Please enter your details`.
  - **Dropdown styling & sizing bug:** `onboarding-styles.tsx:28,54` hardcodes `width: 355` on `dropdownStyle` and `itemContainerStyle`, which exceeds the inner width of a `375px` screen with `padding: 20` (`335px` available), risking horizontal overflow on narrower iPhones. Figma's dropdown list has `borderRadius: 16` and green-tinted shadow (`0px 5px 15px rgba(45,138,98,0.15)`), whereas the app uses `borderRadius: 8` and `#b0b0b0` border.
  - **Button & background:** Figma uses `#F8FAFC` background and `#A3A3A3` → `#2BB081` for `Finish`; app uses `#FFFFFF` background and `#CCCCCC` → `#58AD85`.
  - **Unexpected native alert:** `api/config.ts:402-407` fires `Alert.alert('Success', 'Driver updated. Partner ID: ...')` on completion, which is not in Figma.

---

## 2. `Sign-in` (`node-id=997:428`)

**Figma Flow:** `Loading Page` (`2389:15222`) → `Sign in` (`2389:15248`–`2389:15586`) → `Checking Password Visibility` (`2389:15409`) → `Homepage: After Sign-in` (`2389:15710`)  
**App Routes:** [src/app/landing/index.tsx](file:///Users/adityapawar_1/Documents/school/college/blueprint/replate/src/app/landing/index.tsx), [src/app/auth/login/index.tsx](file:///Users/adityapawar_1/Documents/school/college/blueprint/replate/src/app/auth/login/index.tsx)

### Discrepancies

- **Navigation & Header:** App includes `< Back` (`BackButton`) on the Login screen (`login/index.tsx:227`), whereas Figma has no back button on Sign-in. Title `Welcome!` is `#000000` in app vs. `#259D73` in Figma; background is `#FFFFFF` vs. `#F8FAFC`.
- **Placeholders & Labels:**
  - Email placeholder in Figma is `email@gmail.com...` (lowercase with ellipsis); app uses `Email@gmail.com`.
  - Password field in Figma has no placeholder text when empty (`2389:15248`); app uses `'Enter password'`.
  - Input labels in Figma are `#A3A3A3` (`#a3a3a3`), while app uses `#525454` (`inputLabelDark`).
- **Password Visibility Toggle:** Figma uses an eye icon (`PasswordEye`); app uses `'Show'` / `'Hide'` text. (Also note a minor Figma-side oddity: `2389:15409` omits the `Forgot Password? Reset Here` line and moves `Need an account? Sign up` above the `LOGIN` button.)
- **Forgot Password Link:** Figma renders `Forgot Password? Reset Here` right-aligned above the `LOGIN` button (`2389:15276`). App renders `Forgot password?` left-aligned (`authStyles.forgotPasswordLink`, `login/index.tsx:320-329`).
- **Button Text & Colors:** Figma button reads `LOGIN` (`#A3A3A3` inactive, `#2BB081` active); app reads `'Log in '` (trailing space, `login/index.tsx:344`) in `#58AD85` with `opacity: 0.5` when disabled.
- **Navigation Stack Bug:** `login/index.tsx:121` uses `router.push('/(tabs)/my-tasks')` instead of `router.replace`, leaving the login route in the back stack.

---

## 3. `[Error] Sign in` (`node-id=1238:88`)

**Figma Flow:** `Loading Page` (`2389:13728`) → Sign-in inputs → `[ERROR] Sign up with non-existent account entering password` (`2389:14404`) & `Checking Password Visibility` (`2389:14325`)  
**App Route:** [src/app/auth/login/index.tsx](file:///Users/adityapawar_1/Documents/school/college/blueprint/replate/src/app/auth/login/index.tsx)

### Discrepancies

- **Error Copy:** Figma displays `Please enter a valid email address.` under Email and `Please enter a valid password.` under Password (`2389:14404`). On invalid credentials, `login/index.tsx:170-171` sets **both** `emailError` and `passwordError` to `'Invalid email or password. Please try again.'`.
- **Error Color & Spacing:** Figma uses `#EF4444` (`12px`) with clean `28px` vertical spacing before `Forgot Password?`. App uses `#FF4444` (`11px`) with `marginTop: -16` (`authStyles.ts:167-174`).
- **Button State During Error:** Figma disables the `LOGIN` button (`#A3A3A3`) in the error frame; in the app, the `Log in ` button remains green/enabled as long as both inputs are non-empty.
- _(Note: Figma section `1238:88` itself has frame naming typos — frames say `Sign up with non-existent account` even though they are Sign-in screens.)_

---

## 4. `Reset Password` (`node-id=1129:84`)

**Figma Flow:** `Loading Page` (`2390:19668`) → Sign-in (`2390:19698`) → `Reset your password` (`2390:19749`–`2390:19845`) → `Email Sent!` (`2390:19880`)  
**App Routes:** [src/app/auth/forgot-password/index.tsx](file:///Users/adityapawar_1/Documents/school/college/blueprint/replate/src/app/auth/forgot-password/index.tsx), [src/app/auth/reset-password/index.tsx](file:///Users/adityapawar_1/Documents/school/college/blueprint/replate/src/app/auth/reset-password/index.tsx)

### Discrepancies

- **Title, Subtitle, & CTA Copy (`forgot-password/index.tsx`):**
  - Figma title: `Reset your password` (`#259D73`); App title: `Forgot Password?` (`#000000`).
  - Figma subtitle: `Please enter your email to reset the password`; App: `Enter your email address and we'll send you instructions to reset your password.`
  - Figma placeholder: `email@gmail.com...`; App: `Enter your email`.
  - Figma button: `Reset Password` (`#A3A3A3` → `#2BB081`); App: `Send Reset Link` (`#58AD85`).
  - App adds a bottom link (`Remember your password? Log in`) that is not in Figma.
- **Confirmation Screen (`Email Sent!` vs. `emailSent` state):**
  - Figma shows `Email Sent!` (`#259D73`) + `Check your email for password recovery` centered vertically with a circular back arrow and no buttons/links (`2390:19880`).
  - App shows `Check your email` (`#000000`) + `We've sent password reset instructions to {email}`, a `Back to login` button, a `Didn't receive the email? Try again` link, and **no back button** (`forgot-password/index.tsx:116-165`).
- **Back Button Styling:** Figma uses a circular outlined/shadowed left arrow (`←`); app uses `< Back` (`BackButton`).
- **Token Reset Screen (`src/app/auth/reset-password/index.tsx`):**
  - Implemented in the app for deep-link recovery (`?reset_password_token=...`), including `Invalid Reset Link` and `Password Reset!` states, but there are **no corresponding Hifi Figma frames** for setting the new password.

---

## 5. `[Viewing and claiming tasks] All Tasks` (`node-id=1021:870`) & `[Empty] My Tasks` (`node-id=2512:4064`)

**Figma Flow:** `Task Page` (`2470:20594`) → `Task Page: Viewing an Available task` (`2470:20865`) → `Claimed a task, toast popup` (`2470:21113`) → `Claimed a task` (`2523:5311`) → `Opening address in maps` (`2470:21295`); Empty state (`2512:4136`)  
**App Routes:** [src/app/(tabs)/available-pick-ups.tsx](<file:///Users/adityapawar_1/Documents/school/college/blueprint/replate/src/app/(tabs)/available-pick-ups.tsx>), [src/components/DayCarousel.tsx](file:///Users/adityapawar_1/Documents/school/college/blueprint/replate/src/components/DayCarousel.tsx), [src/components/AvailableTaskCard.tsx](file:///Users/adityapawar_1/Documents/school/college/blueprint/replate/src/components/AvailableTaskCard.tsx), [src/app/pickup-details/[id].tsx](file:///Users/adityapawar_1/Documents/school/college/blueprint/replate/src/app/pickup-details/[id].tsx), [src/components/TaskNotification.tsx](file:///Users/adityapawar_1/Documents/school/college/blueprint/replate/src/components/TaskNotification.tsx), [src/components/DirectionsSheet.tsx](file:///Users/adityapawar_1/Documents/school/college/blueprint/replate/src/components/DirectionsSheet.tsx)

### Discrepancies

- **`Today's Available Tasks` & `DayCarousel` (Observed via Expo MCP):**
  - **Day cards blend into white header:** In Figma (`2470:20594`), the white header stops above the Day Carousel (`126px`), so unselected white day pills sit on the `#F1F5F9` gray background and remain clearly visible. In the app (`available-pick-ups.tsx:155-162`), `<DayCarousel />` is placed _inside_ the white `.header` container, making unselected white day cards completely invisible against the white header.
  - **Date range & selected pill size:** Figma shows 5 days centered around today (2 past days, today larger at `71x92px` in the center, 2 future days). `DayCarousel.tsx:76-85` starts at `today` on the far left and renders all pills at uniform `65x85px` size.
  - **Day label colors:** Figma uses `#000000` for month/weekday; app uses `#64748B` (`Colors.dateGray`).
- **`AvailableTaskCard`:**
  - **Missing distance:** Figma displays `11:30 AM - 3:00 PM | 2.2 mi` (`2318:3399`). `AvailableTaskCard.tsx` only renders the time range; distance is omitted.
  - **Font weight:** Figma uses `Lato:Bold` for title/address/time inside the card; app uses `Lato` (`fontWeight: '500'` on title, regular on address/time).
- **Stale List on Navigation Back (Bug):**
  - `available-pick-ups.tsx:122-124` fetches tasks in `useEffect` rather than `useFocusEffect`, so claiming a task in `pickup-details/[id]` and navigating back does not refresh the list to remove the claimed task.
- **Empty State (`[Empty] My Tasks` `2512:4136`):**
  - App correctly shows `There are no tasks today` (`available-pick-ups.tsx:214`), though the text still says `"today"` even when future dates (e.g. Nov 26) are selected, and the `elements.png` icon renders in `#DFDFDF`-ish light gray rather than Figma's `#CBD5E1`.
- **`Pick-Up` Details Screen (`pickup-details/[id].tsx`, Observed via Expo MCP):**
  - **Bottom CTA missing in live view:** As noted above, `<Animated.View entering={FadeInDown.delay(600)...} style={styles.bottomContainer}>` did not render visibly on screen when tested live in the simulator.
  - **Location header background:** Figma places the Location block (`Rockridge Cafe Details` / address) on `#F1F5F9` above the white sheet (`top: 199`); app places everything inside a single full-height white `ScrollView` (`contentCard`).
  - **`Open in Maps` placement & icon:** Figma places `Open in Maps` + a green map icon (`#2BB081`) in the **top-right** of the white sheet; app places it left-aligned inside the location block with a black `map-outline` icon.
  - **Header & Section Styling:** Figma uses left arrow `←` and `24px Regular` `Pick-Up` title, `#259D73` green `Description` heading, solid black calendar/clock icon, `#000000` email text with black mail icon, and small inline green message/phone icons (no green rectangular button boxes). The app uses `<` (`chevron-back`), `20px Bold` `Pick-Up`, black `Description`, very faint `#D9D9D9` tinted `date.png` icon, `#64748B` email text with `#4D1B1B` mail icon, and `44x36px` green box buttons for SMS/Call.
  - **Broken `Retry` button (`pickup-details/[id].tsx:256-264`):** On fetch failure, tapping `Retry` resets `err` and `isLoading` to `true`, but `useEffect` only depends on `[id]`, so it never re-fetches — leaving an infinite spinner.
  - **`Added to Active Tasks` Toast (`TaskNotification.tsx`):** `Undo` text is `#000000` in app vs. `#64748B` in Figma, and pressing `Undo` only updates local state without unclaiming via API.
  - **`GET DIRECTIONS` Sheet (`DirectionsSheet.tsx`, Observed via Expo MCP):** Uses `>` (`\u203A`) instead of Figma's `→` right arrow, and button text padding is `20px` vs. Figma's `11px`.

---

## 6. `[Home] My Tasks` (`node-id=1053:361`), `Section 1` (`node-id=2869:3489`), & `[Empty] Home Page` (`node-id=1244:324`)

**Figma Flow:** `Home Page: My Tasks` (`2597:8311`), `Section 1` (`2869:3490` with `Today` / `Scheduled`), `[Overdue]` (`2450:8508`, `2470:22515`), `[Missing Task]` (`2470:22726`, `2597:8616`), `[Empty]` (`2512:4065`)  
**App Routes:** [src/app/(tabs)/my-tasks.tsx](<file:///Users/adityapawar_1/Documents/school/college/blueprint/replate/src/app/(tabs)/my-tasks.tsx>), [src/components/TaskCard.tsx](file:///Users/adityapawar_1/Documents/school/college/blueprint/replate/src/components/TaskCard.tsx), [src/components/UnderlineTabBar.tsx](file:///Users/adityapawar_1/Documents/school/college/blueprint/replate/src/components/UnderlineTabBar.tsx)

### Discrepancies (Observed via Expo MCP & Code)

- **Card Internal Layout (`TaskCard.tsx` vs. Figma `PickupCardNormal`):**
  - **Row order:** In Figma, the card order is **Title → Address → Time** (with no bullet dot). In the app (`TaskCard.tsx:119-150`), the **Time row + bullet dot (`•`) is moved to the very top**, above Title and Address.
  - **Badge pill alignment:** In Figma (`2450:8508`, `2470:22515`), `Overdue` / `Complete` badge sits at top-right aligned with the title row; in the app it sits aligned with the top time row.
- **Wrong Tab Label (`Completed` vs. `History`):**
  - Figma's `[Home] My Tasks`, `[Empty] Home Page`, `Filtering History Section`, and `Section 1` all name the second tab **`History`** (though Figma's own `COMPLETING TASKS` final frame `2558:7021` says `Completed`). The app uses **`Completed`** (`my-tasks.tsx:338`).
- **`FILTER` Row Shown on Active Tab & Non-Functional (`my-tasks.tsx:368-370`):**
  - Observed live in the simulator: `FILTER` appears at the top of the **Active** tab list (without any filter icon). In Figma, `FILTER` / `SORT BY` only appears on the **History** tab.
  - Furthermore, `<Pressable style={styles.filterRow}>` has **no `onPress` handler** — tapping it does nothing.
- **Missing `Today` / `Scheduled` Grouping (`Section 1` `2869:3490`):**
  - `Section 1` groups active tasks under `Today` and `Scheduled` headings (with `Monday, Sept 18: 1:00pm - 4:00pm` format for scheduled tasks). `my-tasks.tsx` renders a single flat list of active tasks with no date grouping.
- **Header Date Format & Shadow:**
  - App renders `Wednesday 25 November` (no comma because `en-GB` `toLocaleDateString` omits the comma); Figma shows `Thursday, 16 April` / `Wednesday, 29 October`.
  - Figma header has a drop shadow (`0px 2px 4px rgba(0,0,0,0.1)`); `my-tasks-styles.ts` has no shadow on `.header`.
- **`Missing` Status Never Derived (`my-tasks.tsx:96-108`):**
  - `TaskCard.tsx:53-62` defines a red `missing` state (`Missing` pill, `#EF4444`), and Figma has a `[Missing Task]` subsection, but `deriveTaskStatus()` in `my-tasks.tsx` only ever returns `'completed'`, `'missed'`, `'overdue'`, or `'active'` — `'missing'` is unreachable.
- **Duplicate Key Bug:** See Executive Summary #1 (`my-tasks.tsx:152-163, 373`).
- **`[Empty] Home Page` (`2512:4065`):**
  - App renders `You have no active tasks` + `Add Task` button (`my-tasks.tsx:392-404`), matching Figma copy, but the `Add Task` button height is `41px` with `borderRadius: 10` (vs. Figma `36px` height, `131px` width, `borderRadius: 8`). Empty icon is light gray instead of `#CBD5E1`, and `Completed` tab shows `'No completed tasks yet'` (Figma has no separate empty Completed screen).

---

## 7. `COMPLETING TASKS` (`node-id=1055:93`) & `[Missed] My Tasks` (`node-id=1219:573`)

**Figma Flow:** `Home Page: My Tasks` → `Adding Details: Weight` (`2450:15394`) → `Adding Details: Recipient` (`2450:15493`, `2450:15542`) → `Confirming Details` modal (`2450:15591` for Completed / `2597:7180` for Missed) → `Home Page: Completed, task is moved` (`2558:7021` / `2597:7231`); plus long-press `QuickActionsSheet` (`src/components/QuickActionsSheet.tsx`) + `ConfirmationModal` (`src/components/ConfirmationModal.tsx`)  
**App Routes:** [src/app/donation-details/[id].tsx](file:///Users/adityapawar_1/Documents/school/college/blueprint/replate/src/app/donation-details/[id].tsx), [src/components/RequiredInput/RequiredInput.tsx](file:///Users/adityapawar_1/Documents/school/college/blueprint/replate/src/components/RequiredInput/RequiredInput.tsx), [src/components/PhotoUpload/PhotoUpload.tsx](file:///Users/adityapawar_1/Documents/school/college/blueprint/replate/src/components/PhotoUpload/PhotoUpload.tsx), [src/components/QuickActionsSheet.tsx](file:///Users/adityapawar_1/Documents/school/college/blueprint/replate/src/components/QuickActionsSheet.tsx), [src/components/ConfirmationModal.tsx](file:///Users/adityapawar_1/Documents/school/college/blueprint/replate/src/components/ConfirmationModal.tsx)

### Discrepancies (Observed via Expo MCP & Code)

- **Missing Confirmation Modals on `Add details` (`donation-details/[id].tsx`):**
  - Figma shows `Mark task as completed?` (`2450:15591`) when tapping `Complete`, and `Mark task as missed?` (`2597:7180`) with a light-red `#FEF2F2` / `#EF4444` `Confirm` button when tapping `Missed`. In `donation-details/[id].tsx`, both buttons fire API requests immediately with no confirmation modal.
- **Summary Subtext Displays Location Name Instead of Street Address:**
  - Observed live in the simulator: below `Wed Oct 7, 11:00 AM - 2:00 PM`, the green text displays `TEST DO NOT DELIVER` (repeating the header title from `params.location`) instead of the pickup address (`5492 College Ave Oakland, CA` in Figma).
- **Broken Recipient Dropdown Rendering (Observed via Expo MCP):**
  - Opening `Recipient` in `Add details` causes the `Add Pick-up Image` heading to disappear behind the dropdown container and renders a truncated, flat-attached box instead of Figma's floating `borderRadius: 16` shadowed menu with `#DDEEE8` selected highlight (`RequiredInput/styles.tsx:55-57` uses `#F8FAFC`).
- **Silent Dead Error Border Style (`RequiredInput.tsx:40`):**
  - `hasError && styles.errorBorder` applies `borderColor` to an outer `<View>` without `borderWidth`, so no red border ever renders.
- **`Complete` Button Disabled State & Missed API Inconsistency:**
  - App disables `Complete` in gray (`#A9A9A9`) until weight and NPO are set; Figma shows `Complete` as green (`#2BB081`) throughout.
  - `donation-details/[id].tsx` calls `submitTaskMissed` (`PATCH /api/tasks/:id/mark_as_failed` with no body, `api/config.ts:445`), whereas `my-tasks.tsx:272` calls `PATCH /api/tasks/:id/driver_mark_as_failed` with `{ driver_id }` — inconsistent endpoints for the same "mark as missed" action.
  - `submitCompletionDetails` (`api/config.ts:502-509`) omits `photo_description` when no `photoUri` is attached, and uses flat JSON keys instead of `task[...]` nesting used in the FormData branch.
- **`PhotoUpload` Icon & Placeholder (`PhotoUpload.tsx:93`):**
  - Uses `Ionicons name="image-outline"` instead of Figma's gallery-add icon (`vuesax/bold/gallery-add`), and `66x66px` `borderRadius: 6` instead of `62x62px` `borderRadius: 8`.
- **Long-Press `QuickActionsSheet` & `ConfirmationModal` (`my-tasks.tsx:409-422`):**
  - `QuickActionsSheet` matches Figma well (`Mark as delivered`, `Mark as missing`), except it uses `>` chevrons instead of `→` arrows.
  - `ConfirmationModal` on `my-tasks.tsx` uses subtitle `"This task will be removed."` instead of Figma's `"This action cannot be undone."`, and uses a green `#2BB081` `Confirm` button even for the destructive `"Mark task as missing?"` action (Figma `[Missed]` modal `2597:7180` uses `#FEF2F2` background and `#EF4444` text).
- **Completed / Missed Cards (`TaskCard.tsx`):**
  - Figma `[Missed] My Tasks` final frame (`2597:7231`) actually displays `Complete` cards instead of `Missed` cards (minor Figma inconsistency), whereas `TaskCard.tsx` properly supports a gray `Missed` card variant (`Missed on M/D`, `Missed` badge, gray `View Details` button).

---

## 8. `Filtering History Section` (`node-id=2450:17528`)

**Figma Flow:** `Home Page: My Completed Tasks` (`2450:16687`) → `Opening Filter Pop-Up` (`2458:18806`) → `Selecting Filter` (`2466:19842`, `2466:20196`, `2466:20325`) → Filtered list with `SORT BY (1)` / `SORT BY (2)` (`2466:19987`, `2470:21472`, `2470:21584`)  
**App Route:** [src/app/(tabs)/my-tasks.tsx](<file:///Users/adityapawar_1/Documents/school/college/blueprint/replate/src/app/(tabs)/my-tasks.tsx>)

### Discrepancies

- **Entirely Unimplemented in the App:**
  - The `FILTERS` popup modal (`CLEAR`, `FILTERS`, `DONE`, checkboxes for `Date Completed`, `NPO`, `Pick-Up Location`) does **not exist** in the codebase.
  - The filter icon (`filters-icon 1`) is missing next to `FILTER` (`my-tasks.tsx:368-370`).
  - `SORT BY` / `SORT BY (1)` / `SORT BY (2)` count label is missing — the app only renders static `'filter'` (uppercased to `FILTER` via style) with no `onPress` handler, and mistakenly renders it on the `Active` tab as well as `Completed`.

---

## 9. `Profile` (`node-id=1098:839`)

**Figma Flow:** `Profile Page` (`2389:13098`) — note `"log-out brings you to loading page"` (`2389:15783`)  
**App Route:** [src/app/(tabs)/my-account.tsx](<file:///Users/adityapawar_1/Documents/school/college/blueprint/replate/src/app/(tabs)/my-account.tsx>), [src/styles/tabs/my-account-styles.ts](file:///Users/adityapawar_1/Documents/school/college/blueprint/replate/src/styles/tabs/my-account-styles.ts)

### Discrepancies (Observed via Expo MCP & Code)

- **Logout Button Font Bug:** `my-account-styles.ts:91` sets `fontFamily: 'AvenirBold'`, which is not loaded in `_layout.tsx`, falling back to the default system font instead of `LatoBold`/`Avenir:Heavy`.
- **Phone Formatting:** Figma formats phone as `(562) 713-2118`. App displays raw backend string (observed live as `608-178-6017`), even though `formatPhoneNumber()` exists in `src/utils/validation.ts:178`.
- **Minor Styling & Spacing:**
  - Figma's white card (`2389:13454`) has a subtle drop shadow (`0px 2px 4px rgba(0,0,0,0.1)`); `formCard` in `my-account-styles.ts` has no shadow.
  - `fieldText` (`fontSize: 17`, `lineHeight: 16`) has a line height smaller than its font size (`my-account-styles.ts:71-76`), which can vertically clip text if wrapped.
  - Logout behavior (`logout(); router.replace('/landing');`) matches Figma's note (`log-out brings you to loading page`).

---

## 10. `Green Collection` (`node-id=1802:301`)

- This section in the `Hifi's (DEVS LOOK HERE)` page is a color palette swatch board (`#427B60`, `#3EA377`, `#6CAD91`, `#71C79F`, `#166440`, `#206C48`, `#519776`, `#58AD85`, `#6EC49C`, `#85D1AD`, `#AEDDC4`, `#E2F7ED`, `#F4F7F5`) rather than an interactive screen flow.
- Note that the app mixes `#58AD85` (`jasmine`, from this swatch set) on Auth/Onboarding/Donation summary with `#2BB081`/`#259D73` on Tabs/Cards and `#06B97C` on the bottom tab bar.
