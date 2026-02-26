# Implementation Plan: Social Networking Platform for persona-16p

## Overview

Transform persona-16p from a standalone personality test into a social networking platform.
Philosophy: "先学习，再连接；先成长，再相遇"

## Current State

- Next.js 15 + React 19 + Framer Motion + Tailwind CSS 4
- 3 pages: home (`/`), test (`/test`), result (`/result`)
- 10-question MBTI test, 32 personality types, bilingual EN/ZH
- 2 themes (classic + tingdaer), CSS variable-based
- JSON file progress storage via `/api/progress`
- Session IDs in localStorage, no auth

## Phase 0: Foundation (~35 files)

### 0.1 Install dependency
- `npm install bcryptjs @types/bcryptjs`

### 0.2 Create type definitions (`lib/types.ts`)
```
User { id, username, passwordHash, displayName, bio, avatar, role, personalityCode, dimensionScores, createdAt }
Session { token, userId, expiresAt }
Post { id, authorId, type (text|result_share|announcement), content, personalityCode, dimensionScores, likes[], createdAt }
Comment { id, postId, authorId, content, createdAt }
Conversation { id, participants[2], lastMessageAt, createdAt }
Message { id, conversationId, senderId, content, readAt, createdAt }
Course { id, seriesId, title, titleZh, description, descriptionZh, instructor, duration, order }
CourseSeries { id, name, nameZh, description, descriptionZh, courses[] }
SubscriptionTier { id, name, nameZh, price, period, features[], featuresZh[] }
```

### 0.3 Create JSON database utility (`lib/db.ts`)
- Generic CRUD: `readAll<T>()`, `readById<T>()`, `create<T>()`, `update<T>()`, `delete<T>()`
- File-based storage in `db/` directory
- File locking for concurrent writes
- Auto-create files if missing

### 0.4 Create initial DB files (`db/`)
- `users.json` — `[]`
- `sessions.json` — `[]`
- `posts.json` — `[]`
- `comments.json` — `[]`
- `conversations.json` — `[]`
- `messages.json` — `[]`
- `courses.json` — `{ series: [], tiers: [] }`

### 0.5 Create auth utility (`lib/auth.ts`)
- `hashPassword(password)` — bcrypt hash
- `verifyPassword(password, hash)` — bcrypt compare
- `createSession(userId)` — generate token, store in sessions.json, set cookie
- `getSession(request)` — read cookie, validate token, return user
- `destroySession(token)` — remove from sessions.json, clear cookie
- `requireAuth(request)` — getSession or throw 401

### 0.6 Create matching algorithm (`lib/matching.ts`)
- Weighted dimension comparison:
  - SN (25%): Similar is better
  - TF (25%): Complementary is better
  - JP (20%): Similar is better
  - EI (15%): Both work (averaged)
  - AT (15%): Similar is better
- Score categories: 灵魂伴侣 (85-100), 非常契合 (70-84), 比较契合 (55-69), 一般 (40-54), 需要磨合 (0-39)
- Returns: score, category, categoryZh, dimensionBreakdown[]

### 0.7 Seed script (`scripts/seed.ts`)
- Create founder account (admin user with personality type)
- Create 13 亲密关系 courses + 12 智慧女人 courses (2 series)
- Create 4 subscription tiers: 体验 ¥99/月, 成长 ¥299/月, 蜕变 ¥699/月, 至尊 ¥1999/月

---

## Phase 1: Auth System (~10 files)

### 1.1 Shared UI components
- `components/ui/Button.tsx` — Primary/secondary/ghost variants, loading state
- `components/ui/Input.tsx` — Label, error message, icon support
- `components/ui/Textarea.tsx` — Auto-resize textarea
- `components/ui/LoadingSpinner.tsx` — Animated spinner
- `components/ui/Badge.tsx` — Colored badge with variants
- `components/ui/EmptyState.tsx` — Icon + message + action

### 1.2 Auth context (`lib/auth-context.tsx`)
- AuthProvider wrapping app
- `useAuth()` hook: `{ user, loading, login, register, logout, refresh }`
- Fetch `/api/auth/me` on mount to hydrate user
- Redirect helpers

### 1.3 Auth pages
- `app/login/page.tsx` — Username + password form, link to register
- `app/register/page.tsx` — Username + password + display name, link to login

### 1.4 Auth API routes
- `app/api/auth/register/route.ts` — POST: validate, hash password, create user, create session, set cookie
- `app/api/auth/login/route.ts` — POST: find user, verify password, create session, set cookie
- `app/api/auth/logout/route.ts` — POST: destroy session, clear cookie
- `app/api/auth/me/route.ts` — GET: return current user from session cookie

### 1.5 Auth guard component
- `components/AuthGuard.tsx` — Wraps pages requiring auth, redirects to /login

### 1.6 Modify `app/layout.tsx`
- Wrap children with AuthProvider

---

## Phase 2: Navigation Shell + Profiles (~12 files)

### 2.1 Layout components
- `components/layout/AppShell.tsx` — Conditional wrapper: shows BottomNav for authed routes, full-screen for login/register/test
- `components/layout/BottomNav.tsx` — 5 tabs: 首页, 动态, 消息, 课程, 我的. Active state, unread badge on chat
- `components/layout/TopBar.tsx` — Page title + optional back button + optional action

### 2.2 Profile components
- `components/profile/ProfileCard.tsx` — Avatar, display name, personality badge, bio
- `components/profile/AvatarPicker.tsx` — Grid of emoji avatars to choose from
- `components/profile/ProfileEditForm.tsx` — Edit display name, bio, avatar
- `components/profile/PersonalityBadge.tsx` — Colored pill with personality code + emoji
- `components/profile/DimensionSummary.tsx` — Compact 5-dimension display

### 2.3 Profile pages
- `app/profile/page.tsx` — Own profile with edit ability
- `app/profile/[id]/page.tsx` — Other user's profile + compatibility score

### 2.4 User API routes
- `app/api/users/route.ts` — GET: list users (paginated)
- `app/api/users/[id]/route.ts` — GET: single user, PATCH: update own profile
- `app/api/users/[id]/match/route.ts` — GET: compatibility score between current user and target

### 2.5 Modify `app/layout.tsx`
- Add AppShell component with conditional BottomNav

### 2.6 Avatar component
- `components/ui/Avatar.tsx` — Renders emoji avatar in circle with size variants

---

## Phase 3: Social Feed (~10 files)

### 3.1 Feed components
- `components/feed/PostCard.tsx` — Author avatar/name, content, like/comment counts, timestamp
- `components/feed/ResultShareCard.tsx` — Special card showing shared personality result with dimension bars
- `components/feed/AnnouncementCard.tsx` — Founder announcements with distinct styling
- `components/feed/PostComposer.tsx` — Text input + type selector (text/result_share for users, +announcement for founder)
- `components/feed/CommentList.tsx` — List of comments under a post
- `components/feed/CommentInput.tsx` — Input for adding comments
- `components/feed/LikeButton.tsx` — Heart icon with count, animated on click
- `components/feed/CompatibilityBadge.tsx` — Small badge showing match % between viewer and post author

### 3.2 Feed page
- `app/feed/page.tsx` — Timeline with PostComposer at top, infinite scroll posts

### 3.3 Feed API routes
- `app/api/posts/route.ts` — GET: paginated posts (cursor-based), POST: create post
- `app/api/posts/[id]/like/route.ts` — POST: toggle like
- `app/api/posts/[id]/comments/route.ts` — GET: comments for post, POST: add comment

---

## Phase 4: Chat (~8 files)

### 4.1 Chat components
- `components/chat/ConversationItem.tsx` — Avatar, name, last message preview, timestamp, unread dot
- `components/chat/ChatBubble.tsx` — Message bubble (left/right aligned), timestamp
- `components/chat/ChatInput.tsx` — Text input with send button
- `components/chat/PersonalityHeader.tsx` — Shows other user's personality type in chat header

### 4.2 Chat pages
- `app/chat/page.tsx` — Conversation list
- `app/chat/[id]/page.tsx` — Chat window (WeChat-style)

### 4.3 Chat API routes
- `app/api/conversations/route.ts` — GET: user's conversations, POST: create/find conversation
- `app/api/conversations/[id]/messages/route.ts` — GET: messages (paginated), POST: send message
- `app/api/conversations/[id]/messages/read/route.ts` — POST: mark messages as read

### 4.4 Unread count
- Add unread message count to `/api/auth/me` response
- BottomNav polls or checks on route change

---

## Phase 5: Course Catalog (~7 files)

### 5.1 Course components
- `components/courses/CourseCard.tsx` — Course thumbnail, title, duration, instructor
- `components/courses/SeriesHeader.tsx` — Series name, description, course count
- `components/courses/TierCard.tsx` — Subscription tier with price, features list
- `components/courses/CourseDetail.tsx` — Full course info with enrollment CTA

### 5.2 Course pages
- `app/courses/page.tsx` — Browse by series, subscription tiers at top
- `app/courses/[id]/page.tsx` — Course detail page

### 5.3 Admin page
- `app/admin/courses/page.tsx` — Founder-only course CRUD

### 5.4 Course API routes
- `app/api/courses/route.ts` — GET: all courses/series/tiers, POST: create course (founder only)
- `app/api/courses/[id]/route.ts` — GET: single course, PATCH/DELETE: manage (founder only)

---

## Phase 6: Polish & Integration (~5 file modifications)

### 6.1 Modify `app/page.tsx`
- Auth-aware CTAs: logged in → "Go to Feed" / "View Profile", logged out → "Take Test" / "Login"
- Platform description section

### 6.2 Modify `app/result/page.tsx`
- Add "Share to Feed" button (creates result_share post)
- Add "Save to Profile" button (updates user's personalityCode + dimensionScores)

### 6.3 Modify `app/test/page.tsx`
- On completion, if logged in, auto-save results to user record

### 6.4 Modify `app/globals.css`
- Bottom nav styles (safe area insets for mobile)
- Chat bubble styles
- Feed card styles
- Course card styles

### 6.5 Mobile & animation pass
- Ensure all new pages use Framer Motion consistently
- Test on mobile viewport sizes
- Verify both themes work on all new pages

---

## File Count Summary

| Category | New Files | Modified Files |
|----------|-----------|----------------|
| Types & Utils | 4 | 0 |
| Database | 8 | 0 |
| Auth | 7 | 1 |
| UI Components | 6 | 0 |
| Layout Components | 3 | 1 |
| Profile Components | 5 | 0 |
| Profile Pages + API | 5 | 0 |
| Feed Components | 8 | 0 |
| Feed Page + API | 4 | 0 |
| Chat Components | 4 | 0 |
| Chat Pages + API | 5 | 0 |
| Course Components | 4 | 0 |
| Course Pages + API | 5 | 0 |
| Scripts | 1 | 0 |
| Polish | 0 | 4 |
| **Total** | **~69** | **~6** |

---

## Execution Order (what I'll implement)

1. **Phase 0**: types.ts → db.ts → auth.ts → matching.ts → db/*.json → seed script
2. **Phase 1**: UI components → auth context → auth API routes → login/register pages
3. **Phase 2**: layout components (AppShell, BottomNav, TopBar) → modify layout.tsx → profile components → profile pages → user API
4. **Phase 3**: feed components → feed page → feed API routes
5. **Phase 4**: chat components → chat pages → chat API routes
6. **Phase 5**: course components → course pages → course API routes → admin page
7. **Phase 6**: modify home/result/test pages → CSS additions → final polish

Each phase builds on the previous. I'll implement all files in a phase before moving to the next.
