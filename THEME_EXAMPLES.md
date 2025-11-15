# Theme Implementation Examples

## Helper Functions Usage

### Example 1: Form Inputs
```jsx
<input
  type="text"
  value={formData.clientName}
  className={getInputClasses()}
  placeholder="Enter client name"
/>
```

**Light Theme:**
- Background: white
- Border: gray-300
- Text: gray-900

**Dark Theme:**
- Background: gray-800
- Border: gray-700
- Text: gray-100

---

### Example 2: Section Cards
```jsx
<div className={getCardClasses('blue')}>
  <h3 className={getHeadingClasses()}>Social Media Access</h3>
  // Form content...
</div>
```

**Light Theme:**
- Background: blue-50 (light blue)
- Border: none

**Dark Theme:**
- Background: blue-900 with 30% opacity
- Border: blue-800 (1px solid)

---

### Example 3: Labels
```jsx
<label className={getLabelClasses()}>
  What is your biggest strength?
</label>
```

**Light Theme:**
- Color: text-gray-700

**Dark Theme:**
- Color: text-gray-200

---

### Example 4: Navigation Buttons
```jsx
<button className={`px-6 py-2 rounded-md ${isDark ? 'bg-blue-700 text-white hover:bg-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
  Next
</button>
```

**Light Theme:**
- Background: blue-600
- Hover: blue-700

**Dark Theme:**
- Background: blue-700
- Hover: blue-600

---

### Example 5: Text Colors
```jsx
<p className={`text-sm ${getSecondaryTextClasses()}`}>
  Helper text or description
</p>
```

**Light Theme:**
- Color: text-gray-600

**Dark Theme:**
- Color: text-gray-400

---

## All Available Helper Functions

### Input Styling
```javascript
getInputClasses()        // Form inputs, textarea, select
getLabelClasses()        // Form labels
```

### Card Styling
```javascript
getCardClasses('blue')   // Card containers
getCardClasses('green')
getCardClasses('red')
getCardClasses('yellow')
getCardClasses('purple')
getCardClasses('indigo')
```

### Text Styling
```javascript
getHeadingClasses()      // h3 and section headings
getHeadingClasses('xl')  // Larger headings (text-3xl)
getHeadingClasses('md')  // Medium headings (text-base)

getPrimaryTextClasses()  // Main text
getSecondaryTextClasses()// Descriptive text
getTertiaryTextClasses() // Helper text
```

### Button Styling
```javascript
getButtonClasses('primary')   // Blue buttons
getButtonClasses('secondary') // Gray buttons
getButtonClasses('success')   // Green buttons
```

---

## Accessibility Features

### Contrast Ratios
- **Light Theme**: Dark text on light backgrounds (WCAG AAA compliant)
- **Dark Theme**: Light text on dark backgrounds (WCAG AA compliant)

### Focus States
- All inputs maintain focus rings for keyboard navigation
- Color contrast maintained in focus state

### Color Independence
- Theme doesn't rely solely on color for information
- All inputs clearly labeled
- Error messages include text descriptions

---

## Theme Context

The theme is managed globally via the `ThemeContext`:

```javascript
const { isDark, toggleTheme, theme } = useTheme();
```

**Theme State:**
- `theme`: 'light' or 'dark'
- `isDark`: boolean
- `toggleTheme()`: function to switch themes
- Persisted in localStorage

---

## Responsive Design

All theme styling works seamlessly with responsive breakpoints:
- Mobile: Single column layout
- Tablet: 2-3 column grid
- Desktop: Full width optimization

Theme colors automatically adapt to all screen sizes.
