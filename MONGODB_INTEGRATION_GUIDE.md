# ClientEnrollmentForm - MongoDB Integration Complete

## ✅ What Was Done

### 1. Created Missing Components

#### ✅ `src/hooks/useToast.js`
- Toast notification system for success/error messages
- Auto-dismisses after 4 seconds
- Supports message, title, and type parameters
- Types: 'success', 'error', 'info', 'warning'

**Usage:**
```jsx
const { notify } = useToast();

// Simple notification
notify('Form saved successfully', 'success');

// Complex notification
notify({
  title: 'Validation Error',
  message: 'Please fill all required fields',
  type: 'error'
});
```

#### ✅ `src/services/clientOnboardingService.js`
- MongoDB-compatible service replacing Supabase
- Handles form data saving, drafts, and file uploads
- Integrates with your MongoDB backend through API endpoints

**Methods:**
- `saveOnboardingData(formData)` - Save complete form
- `saveDraft(formData)` - Auto-save draft
- `saveOnboardingFiles(recordId, files, type)` - Upload files
- `getOnboardingData(clientId)` - Fetch existing data
- `updateOnboardingData(recordId, updates)` - Update record
- `getAllOnboardingData(filters)` - Get all records (admin)

#### ✅ Updated `src/components/LoadingSpinner.jsx`
- Now supports multiple size options: 'sm', 'md', 'lg', 'xl'
- Can be used inline (not just full-screen)
- Backward compatible with existing code

**Usage:**
```jsx
// Full screen (default)
<LoadingSpinner />

// Inline spinner (in buttons, forms, etc.)
<LoadingSpinner size="sm" fullScreen={false} />

// Custom message
<LoadingSpinner message="Uploading files..." />
```

### 2. Updated Import Paths

Changed from `@/` path aliases to relative imports:
- `@/services/clientOnboardingService` → `../services/clientOnboardingService`
- `@/shared/components/LoadingStates` → `../components/LoadingSpinner`
- `@/shared/components/Toast` → `../hooks/useToast`

### 3. Extended API Service

Added new endpoints to `src/services/api.js`:
```javascript
api.createClientOnboarding(data)
api.saveDraft(data)
api.getClientOnboarding(clientId)
api.updateClientOnboarding(recordId, updates)
api.getAllClientOnboardings(filters)
```

---

## 🔧 Backend API Endpoints Required

Your Node.js/MongoDB backend needs these endpoints:

### POST `/api/onboarding`
- **Purpose**: Create new onboarding record
- **Body**: Form data object
- **Returns**: `{ _id, clientName, ...formData, submittedAt }`

```javascript
router.post('/onboarding', authenticate, async (req, res) => {
  try {
    const onboarding = new Onboarding({
      ...req.body,
      userId: req.user._id,
      createdAt: new Date()
    });
    const saved = await onboarding.save();
    res.json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### POST `/api/onboarding/draft`
- **Purpose**: Save draft
- **Body**: Form data object
- **Returns**: `{ _id, status: 'draft', ...data }`

### POST `/api/onboarding/upload`
- **Purpose**: Upload files (multipart/form-data)
- **Headers**: Content-Type: multipart/form-data
- **FormData**: `{ recordId, fileType, files[] }`
- **Returns**: `{ success: true, files: [{ url, type }] }`

### GET `/api/onboarding/:clientId`
- **Purpose**: Fetch onboarding record by ID or client name
- **Returns**: Onboarding record object

### PUT `/api/onboarding/:recordId`
- **Purpose**: Update onboarding record
- **Body**: Update fields object
- **Returns**: Updated record

### GET `/api/onboarding`
- **Purpose**: Get all onboarding records with optional filters
- **Query Params**: `?status=draft&industry=healthcare&search=...`
- **Returns**: Array of onboarding records

---

## 📋 MongoDB Schema (Example)

```javascript
const onboardingSchema = new Schema({
  // User reference
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Basic info
  clientName: { type: String, required: true },
  businessType: String,
  industry: String,
  primaryEmail: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  businessAddress: String,
  websiteUrl: String,
  
  // Form data (store as JSON)
  formData: { type: Schema.Types.Mixed },
  
  // Status tracking
  status: { type: String, enum: ['draft', 'submitted', 'in-review', 'completed'], default: 'draft' },
  completionPercentage: { type: Number, default: 0 },
  
  // Files
  files: [{
    type: String,
    fileType: String,
    url: String,
    uploadedAt: Date
  }],
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  submittedAt: Date,
  lastSaved: Date,
  updatedAt: { type: Date, default: Date.now }
});
```

---

## 🚀 How to Use in Your App

### 1. Import and Use Hook
```jsx
import { useToast } from '../hooks/useToast';
import { ClientOnboardingService } from '../services/clientOnboardingService';

function MyComponent() {
  const { notify } = useToast();

  const handleSubmit = async (formData) => {
    try {
      const result = await ClientOnboardingService.saveOnboardingData(formData);
      notify('Form saved successfully!', 'success');
    } catch (error) {
      notify(error.message, 'error');
    }
  };
}
```

### 2. Use ClientEnrollmentForm Component
```jsx
import ClientEnrollmentForm from './pages/ClientEnrollmentForm';

function App() {
  return (
    <div>
      <ClientEnrollmentForm onBack={() => navigate('/dashboard')} />
    </div>
  );
}
```

### 3. With Loading Spinner
```jsx
import LoadingSpinner from './components/LoadingSpinner';

function MyForm() {
  const [loading, setLoading] = useState(false);

  return (
    <button onClick={handleSubmit} disabled={loading}>
      {loading ? <LoadingSpinner size="sm" fullScreen={false} /> : 'Submit'}
    </button>
  );
}
```

---

## 🧪 Testing Checklist

- [ ] Backend API endpoints created and tested
- [ ] MongoDB schema set up
- [ ] Environment variables configured (`VITE_API_URL`)
- [ ] Form loads without errors
- [ ] Form submission saves to MongoDB
- [ ] File uploads work
- [ ] Toast notifications appear
- [ ] Loading spinner works (inline and full-screen)
- [ ] Dark/light theme works
- [ ] All validations work
- [ ] Drafts auto-save

---

## 📦 Environment Variables Needed

```env
# .env file
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Dashboard
```

---

## 🎯 What Stays the Same

✅ All existing functionality preserved
✅ Theme system (dark/light mode)
✅ Form validation
✅ Auto-save functionality
✅ File upload capabilities
✅ All form sections and fields

---

## ⚠️ Important Notes

1. **Authentication Required**: All endpoints require JWT token in Authorization header
2. **File Upload**: Implement file storage (local, AWS S3, etc.) in backend
3. **Validation**: Backend should validate all form data
4. **Error Handling**: App catches and displays errors via toast notifications
5. **Draft Auto-save**: Happens every 2-30 seconds while form is active

---

## 🐛 Troubleshooting

### "Cannot find module" error
- Ensure files are created in correct locations
- Check relative import paths are correct

### API calls failing
- Verify backend endpoints exist
- Check Authorization header with JWT token
- Ensure VITE_API_URL environment variable is set

### Files not uploading
- Check FormData is created correctly in service
- Verify backend handles multipart/form-data
- Check file size limits

### Toast not appearing
- Verify useToast hook is called
- Check component is within app scope
- Inspect browser console for errors

---

## ✅ Status

**All missing components created and integrated**
**ClientEnrollmentForm is now MongoDB-compatible**
**Ready for backend API implementation**
