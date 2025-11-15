# 🎯 Quick Reference - MongoDB Integration

## Files Created

| File | Purpose | Status |
|------|---------|--------|
| `src/hooks/useToast.js` | Toast notifications hook | ✅ Ready |
| `src/services/clientOnboardingService.js` | MongoDB service for forms | ✅ Ready |
| Updated: `src/components/LoadingSpinner.jsx` | Enhanced with size options | ✅ Ready |
| Updated: `src/services/api.js` | Added onboarding endpoints | ✅ Ready |
| Updated: `src/pages/ClientEnrollmentForm.jsx` | Fixed import paths | ✅ Ready |

---

## What You Need to Do

### 1. ✅ Frontend Setup (Done)
- [x] Created useToast hook
- [x] Created ClientOnboardingService
- [x] Updated LoadingSpinner
- [x] Fixed import paths
- [x] Extended API service

### 2. ⏳ Backend Setup (Your Turn)

Create these API endpoints in your Node.js backend:

```javascript
// Backend routes needed:
POST   /api/onboarding              // Create
POST   /api/onboarding/draft        // Save draft
POST   /api/onboarding/upload       // Upload files
GET    /api/onboarding/:id          // Get one
PUT    /api/onboarding/:id          // Update
GET    /api/onboarding              // List all
```

### 3. ⏳ Database Setup (Your Turn)

Create MongoDB collection and schema for onboarding data

---

## Quick Start Code

### Using in a component:
```jsx
import { useToast } from '../hooks/useToast';
import { ClientOnboardingService } from '../services/clientOnboardingService';

export default function MyComponent() {
  const { notify } = useToast();

  const handleSave = async (data) => {
    try {
      await ClientOnboardingService.saveOnboardingData(data);
      notify('Saved!', 'success');
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  return <button onClick={() => handleSave({})}>Save</button>;
}
```

---

## Error Messages Explained

| Error | Cause | Fix |
|-------|-------|-----|
| "Cannot find module" | Missing file or wrong path | Check file location and import path |
| "404 Not Found" | API endpoint doesn't exist | Create backend endpoint |
| "Unauthorized" | No valid JWT token | Ensure user is logged in |
| "Files not uploading" | Backend not handling multipart | Implement file upload in backend |

---

## Testing Each Part

### Test Toast:
```jsx
const { notify } = useToast();
notify('Test message', 'success');
```

### Test LoadingSpinner:
```jsx
import LoadingSpinner from '../components/LoadingSpinner';
<LoadingSpinner size="sm" fullScreen={false} />
```

### Test Service:
```jsx
const result = await ClientOnboardingService.saveOnboardingData({
  clientName: 'Test',
  primaryEmail: 'test@example.com'
});
```

---

## API Endpoint Status

| Endpoint | Status | Notes |
|----------|--------|-------|
| POST `/api/onboarding` | 🔴 Not implemented | Create now |
| POST `/api/onboarding/draft` | 🔴 Not implemented | Create now |
| POST `/api/onboarding/upload` | 🔴 Not implemented | Create now |
| GET `/api/onboarding/:id` | 🔴 Not implemented | Create now |
| PUT `/api/onboarding/:id` | 🔴 Not implemented | Create now |
| GET `/api/onboarding` | 🔴 Not implemented | Create now |

---

## Environment Config

Add to your `.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

---

## Component Compatibility

✅ Uses your existing:
- Theme system (dark/light mode)
- API service pattern
- Authentication token system
- Components (LoadingSpinner, etc.)

❌ No longer uses:
- Supabase
- `@/` path aliases (converted to relative paths)
- External Toast component

---

## File Upload Implementation

Backend needs to handle:
```javascript
POST /api/onboarding/upload
Body: FormData {
  recordId: string,
  fileType: 'logo' | 'seo_report' | etc,
  files: File[]
}
Returns: {
  success: true,
  files: [{ url, type, name }]
}
```

---

## Support

**All frontend components are ready to use**
**Next step: Implement backend API endpoints**

Refer to: `MONGODB_INTEGRATION_GUIDE.md` for detailed backend implementation guide
