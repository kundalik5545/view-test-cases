<!-- 3c117c2f-9ca2-4c49-bff4-847ca493e38b 857e8089-8458-4672-8e9a-3c8d47b45b9a -->
# eMember Test Cases Filter Table View Implementation

## Overview

Replicate the XPS filter table view functionality for eMember test cases, adapted for eMember's structure (using Portal instead of Module/SchemeLevel).

## Implementation Plan

### 1. API Enhancement (`app/api/test-cases/emember/route.js`)

- Add `search` query parameter support for filtering by testCaseId or testCaseName (case-insensitive partial match)
- The API already supports `portal` filtering, so we'll enhance it with search functionality
- Combine filters with AND logic (all provided filters must match)
- Add ordering by testCaseId
- Apply case-insensitive filtering in memory after database query (similar to XPS implementation)

### 2. Filter View Page (`app/(main)/emember-test-cases/[id]/page.jsx`)

- Create new filter view page (similar to XPS `[id]/page.jsx`)
- Filter by Portal values: Admin, Public, CAT, Fusion, Umbraco, DataHub, Other
- Implement:
- **Header section**: Display filter context (portal name)
- **Search bar**: Input field with debounced search (300ms) for test case ID or name
- **Table component**: Display test cases with columns:
- Test Case ID
- Test Case Name (truncated with ellipsis)
- Portal
- Test Status
- Automation Status
- View Details button (links to `/emember-test-cases/view?testCaseId={id}`)
- **Loading state**: Show loading spinner while fetching
- **Empty state**: Show message when no test cases match filters
- **Error handling**: Display error messages if API call fails
- **Responsive design**: Mobile-friendly with horizontal scroll and sticky first column

### 3. View Page Enhancement (`app/(main)/emember-test-cases/view/page.jsx`)

- Add support for `testCaseId` query parameter using `useSearchParams`
- When `testCaseId` is present in URL, find the matching test case and set it as the current index
- Maintain existing navigation (Previous/Next) functionality

### 4. Dashboard Links (`app/(main)/emember-test-cases/page.jsx`)

- Add clickable links to portal names in the portal list section (similar to XPS dashboard)
- Link format: `/emember-test-cases/{portalName}` (e.g., `/emember-test-cases/Admin`)

## Technical Details

### API Query Parameters

- `portal`: Filter by portal enum value (e.g., "Admin", "Public", "CAT", "Fusion", "Umbraco", "DataHub", "Other")
- `search`: Search term that matches testCaseId or testCaseName (case-insensitive)

### URL Structure

- Filter by portal: `/emember-test-cases/Admin`, `/emember-test-cases/Public`, etc.
- View details: `/emember-test-cases/view?testCaseId={testCaseId}`

### Portal Enum Values

- Admin, Public, CAT, Fusion, Umbraco, DataHub, Other

### Search Implementation

- Client-side debounced search (300ms delay) for better UX
- Search filters both testCaseId and testCaseName fields
- Case-insensitive matching

## Files to Modify/Create

1. `app/api/test-cases/emember/route.js` - Add search functionality
2. `app/(main)/emember-test-cases/[id]/page.jsx` - Create new filter view page
3. `app/(main)/emember-test-cases/view/page.jsx` - Add testCaseId query param support
4. `app/(main)/emember-test-cases/page.jsx` - Add links to portal filter views

### To-dos

- [x] 