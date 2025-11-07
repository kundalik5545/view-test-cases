<!-- ca799b20-a30e-401c-96f6-2f24b90857f6 c1d27550-d19e-4771-af4a-47d82c55ad62 -->

# Screenshot Upload and Management Feature

## Overview

Add screenshot copy/paste functionality to test case view pages, allowing users to paste screenshots from clipboard, store them in the public folder with structured naming, and manage them through the UI.

## Database Schema Changes

### Update Prisma Schema

- Add `screenshots` field to both `xpsTestCase` and `eMemberTestCase` models
- Type: `String` (JSON array stored as string for SQLite compatibility)
- Store relative paths like `/screenshots/testcaseID_SchemeLevel_module_timestamp.png`

**Files to modify:**

- `prisma/schema.prisma` - Add `screenshots String @default("[]")` to both models

## API Endpoints

### 1. Upload Screenshot API

**Path:** `/api/test-cases/[type]/screenshots/route.js`

- `POST /api/test-cases/xps/screenshots` - Upload screenshot for XPS test case
- `POST /api/test-cases/emember/screenshots` - Upload screenshot for eMember test case

**Functionality:**

- Accept multipart/form-data with image file
- Generate filename: `testcaseID_SchemeLevel_module_timestamp.png` (XPS) or `testcaseID_portal_timestamp.png` (eMember)
- Handle multiple screenshots with `_2`, `_3` suffix if file exists
- Save to `public/screenshots/` folder
- Update database with new screenshot path
- Return success with file path

### 2. Delete Screenshot API

**Path:** Same as upload endpoints

- `DELETE /api/test-cases/[type]/screenshots` - Delete screenshot

**Functionality:**

- Accept test case ID and screenshot filename
- Delete file from `public/screenshots/` folder
- Remove from database array
- Return success

### 3. Get Screenshots API

**Path:** Same as upload endpoints

- `GET /api/test-cases/[type]/screenshots?id=xxx` - Get all screenshots for a test case

**Functionality:**

- Return array of screenshot paths for the test case

## Frontend Components

### 1. Screenshot Manager Component

**New file:** `components/ScreenshotManager.jsx`

**Features:**

- Clipboard paste handler (Ctrl+V / Cmd+V)
- Visual paste button with icon
- Display existing screenshots in grid/thumbnail view
- Delete button for each screenshot
- Image preview/lightbox on click
- Loading states during upload
- Error handling and validation (file type, size limits)

### 2. Update View Pages

**Files to modify:**

- `app/(main)/xps-test-cases/view/page.jsx`
- `app/(main)/emember-test-cases/view/page.jsx`

**Changes:**

- Import and add `ScreenshotManager` component
- Pass test case data (id, testCaseId, schemeLevel, module/portal)
- Add screenshot section in CardContent (after comments section)

## File Naming Logic

### XPS Test Cases

Format: `{testCaseId}_{schemeLevel}_{module}_{timestamp}.png`

- Example: `TC001_TL_Details_1704067200000.png`
- If file exists: `TC001_TL_Details_1704067200000_2.png`, `_3.png`, etc.

### eMember Test Cases

Format: `{testCaseId}_{portal}_{timestamp}.png`

- Example: `TC001_Admin_1704067200000.png`
- If file exists: `TC001_Admin_1704067200000_2.png`, `_3.png`, etc.

## Additional Features

1. **Image Validation:**

   - Accept only PNG, JPG, JPEG formats
   - Max file size: 5MB
   - Validate image dimensions if needed

2. **UI Enhancements:**

   - Thumbnail grid with hover effects
   - Click to view full-size image in modal/lightbox
   - Upload progress indicator
   - Success/error toast notifications
   - Empty state when no screenshots

3. **User Experience:**

   - Keyboard shortcut indicator (Ctrl+V / Cmd+V)
   - Drag and drop support (optional enhancement)
   - Image optimization/compression (optional)

## Implementation Steps

1. ✅ Update Prisma schema and run migration
2. ✅ Create screenshot upload API endpoints
3. ✅ Create screenshot delete API endpoints
4. ✅ Create ScreenshotManager component
5. ✅ Integrate ScreenshotManager into XPS view page
6. ✅ Integrate ScreenshotManager into eMember view page
7. ✅ Create `public/screenshots/` directory
8. Test clipboard paste functionality
9. Test file upload, display, and deletion

## File Structure

```
public/
  screenshots/          (new directory)
    TC001_TL_Details_1704067200000.png
    TC001_TL_Details_1704067200000_2.png
    ...

components/
  ScreenshotManager.jsx (new component)

app/api/test-cases/
  xps/
    screenshots/
      route.js          (new API route)
  emember/
    screenshots/
      route.js          (new API route)
```

### To-dos

- [x] Update Prisma schema to add screenshots array field to both xpsTestCase and eMemberTestCase models, then run migration
- [x] Create POST and DELETE endpoints for XPS test case screenshots at /api/test-cases/xps/screenshots/route.js
- [x] Create POST and DELETE endpoints for eMember test case screenshots at /api/test-cases/emember/screenshots/route.js
- [x] Create ScreenshotManager component with clipboard paste, image display, and delete functionality
- [x] Integrate ScreenshotManager component into XPS test case view page
- [x] Integrate ScreenshotManager component into eMember test case view page
- [x] Create public/screenshots directory for storing uploaded images

## Implementation Status

✅ **All tasks completed!**

The screenshot upload feature has been fully implemented with:

- Database schema updated with screenshots field
- API endpoints for upload, delete, and get operations
- ScreenshotManager component with clipboard paste support
- Integration into both XPS and eMember test case view pages
- File storage in public/screenshots directory
- Image validation, error handling, and user-friendly UI
