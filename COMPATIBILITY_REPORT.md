# ClientEnrollmentForm - Compatibility & Migration Guide

## Issues Found

### 1. ❌ Missing Imports & Components

#### Missing Services
- `@/services/clientOnboardingService` - Supabase-based service ❌
- `@/shared/components/LoadingStates` - External component ❌
- `@/shared/components/Toast` - Toast notification system ❌

#### Available Alternatives
- ✅ `src/components/LoadingSpinner.jsx` - Already exists
- ✅ `src/services/api.js` - Your API service
- ⚠️ Toast system - Need to create

### 2. Database Integration
- **Current**: Using Supabase (PostgreSQL)
- **Your Stack**: MongoDB + Node.js backend
- **Required**: Need to create MongoDB-compatible service

### 3. Path Alias Issues
- **Problem**: Using `@/` path aliases (from vite.config.js)
- **Solution**: Update imports to relative paths

---

## What Needs to Be Created

### 1. Toast Component/Hook
```javascript
// src/components/Toast.jsx or src/hooks/useToast.js
```
- Simple toast notification system
- Success, error, warning, info types
- Auto-dismiss functionality

### 2. MongoDB Service
```javascript
// src/services/clientOnboardingService.js
```
- Replace Supabase calls
- Use your backend API endpoints
- Handle form submission to MongoDB

### 3. Update Import Paths
- Change `@/` imports to relative paths
- Or configure path aliases in vite.config.js

---

## Key Functions Used by ClientEnrollmentForm

### ClientOnboardingService Methods:
1. `saveOnboardingData(formData)` - Save form data
2. `saveDraft(formData)` - Auto-save draft
3. `saveOnboardingFiles(recordId, files, type)` - Upload files

### LoadingSpinner:
- Used for loading states
- Your version exists, just need to ensure compatibility

### useToast Hook:
- `notify(message, type)` - Show notification
- Types: 'success', 'error', 'info', 'warning'

---

## Migration Steps

1. ✅ Create Toast hook/component
2. ✅ Create MongoDB-compatible ClientOnboardingService
3. ✅ Update import paths
4. ✅ Configure backend endpoints
5. ✅ Test form submission
