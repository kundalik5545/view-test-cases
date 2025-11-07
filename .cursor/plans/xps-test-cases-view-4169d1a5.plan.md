<!-- 4169d1a5-e3d5-47b5-8ee5-f2c6f9b36298 ae1e9389-a2ed-4008-b026-ed229d065358 -->
# eMember Test Cases Complete Implementation Plan

## Overview

Complete the eMember test cases functionality with all routes, view page, edit form, and dashboard. This implementation mirrors the XPS functionality but uses `portal` field instead of `module`, `schemeLevel`, and `client`.

## Implementation Details

### 1. API Route - GET and PUT (`app/api/test-cases/emember/route.js`)

- Add `GET` handler to fetch all eMember test cases
- Add `PUT` handler to update individual test cases
- Accept test case `id` and updated fields in request body
- Validate required fields (testCaseId, location, testCaseName, comments)
- Handle errors gracefully with appropriate status codes

### 2. Stats API Route (`app/api/test-cases/emember/stats/route.js`)

- Create stats route similar to XPS stats
- Calculate statistics for:
- Total count
- Test status breakdown (Passed, Failed, Blocked, Skipped, NotRun, NotSet)
- Automation status breakdown (Automated, NotAutomated, Blocked, InProgress, NotSet)
- Portal breakdown (Admin, Public, CAT, Fusion, Umbraco, DataHub, Other, NotSet)
- Defect statistics (with/without defects)
- Return counts and percentages for each category
- Note: eMember uses `portal` instead of `module`, `schemeLevel`, and `client`

### 3. Edit Form Component (`app/(main)/emember-test-cases/_components/emTcForm.jsx`)

- Create form component for editing eMember test cases
- Use textarea for:
- `testCaseName`
- `expectedResult`
- `actualResult`
- Use Input for:
- `testCaseId`
- `location`
- `comments`
- `defectId`
- Use Select dropdowns for:
- `automationStatus` (Automated, NotAutomated, Blocked, InProgress)
- `testStatus` (Passed, Failed, Blocked, Skipped, NotRun)
- `portal` (Admin, Public, CAT, Fusion, Umbraco, DataHub, Other)
- Include Save and Cancel buttons
- Handle form submission to update via PUT request
- Show loading state during save
- Handle success/error feedback

### 4. View Page (`app/(main)/emember-test-cases/view/page.jsx`)

- Create client component with state management:
- `testCases`: Array of all test cases
- `currentIndex`: Current test case index (0-based)
- `isEditing`: Boolean to toggle edit mode
- Loading and error states
- Fetch all test cases on mount using `/api/test-cases/emember`
- Display current test case in a Card component
- Show all test case fields in organized sections
- Implement pagination controls (Previous/Next buttons) at bottom
- Disable Previous on first item, Next on last item
- Show current position (e.g., "1 of 10")
- Edit button that switches to edit mode
- View mode displays all test case details
- Edit mode shows the form inline
- Success/error messages
- Responsive design for mobile, tablet, and desktop

### 5. Dashboard Page (`app/(main)/emember-test-cases/page.jsx`)

- Create dashboard similar to XPS dashboard
- Fetch stats from `/api/test-cases/emember/stats`
- Display:
- Total test cases card
- Automation coverage card with progress bar
- Defects card
- Status distribution pie chart
- Portal distribution bar chart (instead of module)
- Small stat tiles for Passed, Failed, Blocked, With Defects
- Portal list with counts and percentages
- Use recharts for visualizations
- Responsive grid layout
- Loading and error states

## File Changes

1. `app/api/test-cases/emember/route.js` - Add GET and PUT handlers
2. `app/api/test-cases/emember/stats/route.js` - Create stats route
3. `app/(main)/emember-test-cases/_components/emTcForm.jsx` - Create/edit form component
4. `app/(main)/emember-test-cases/view/page.jsx` - Complete view page implementation
5. `app/(main)/emember-test-cases/page.jsx` - Create dashboard page with stats

## Key Differences from XPS

- eMember uses `portal` field instead of `module`, `schemeLevel`, and `client`
- Portal enum values: Admin, Public, CAT, Fusion, Umbraco, DataHub, Other
- Stats route will aggregate by portal instead of module/schemeLevel/client
- Dashboard will show portal distribution instead of module/schemeLevel

## Technical Considerations

- Use "use client" directive for interactive components
- Handle loading states during API calls
- Implement error handling and user feedback
- Ensure form validation before submission
- Update local state after successful save
- Maintain current index when switching between edit/view modes
- Use consistent styling with XPS pages for UI consistency

### To-dos

- [ ] Add GET and PUT handlers to app/api/test-cases/emember/route.js for fetching and updating test cases
- [ ] Create app/api/test-cases/emember/stats/route.js with statistics calculations for portal, test status, automation status, and defects
- [ ] Implement emTcForm.jsx with all fields, textareas for testCaseName/expectedResult/actualResult, portal select dropdown, and form submission logic
- [ ] Build view page with card display, pagination, edit button, and state management for switching between view/edit modes
- [ ] Create dashboard page with stats cards, charts (pie chart for status, bar chart for portal), and responsive layout