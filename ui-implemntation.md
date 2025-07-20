# UI Implementation Plan: shadcn/ui Components Mapping

## Core UI Sections & Components

### Top Bar (Dark/Light Mode Toggle)
- switch
- button

### Title/Header
- typography (heading styles)

### Add Todo Form
- form
- input
- button

### Todo List
- card (for each todo item)
- checkbox (for completion)
- button (for edit/delete actions)
- textarea (for inline editing)

### Edit Mode
- textarea
- button

### Delete Confirmation Modal
- alert-dialog
- button

### Error/Loading States
- alert
- progress (for loading, if desired)

### Accessibility & Responsiveness
- label (for form fields)
- tooltip (for icon buttons, optional)

### User Feedback (Toasts/Snackbars)
- sonner

### Settings Panel (Future)
- dialog or drawer
- switch
- select

### Bulk Actions, Filters, Sorting (Future)
- toggle-group
- select
- button

### Empty State
- card (with illustration/text)

---

## Additional/Advanced Components for Enhancement

### Top Bar / Navigation
- navigation-menu (for future multi-page or settings navigation)
- avatar (for user profile, if you add auth)
- breadcrumb (if you add more pages)

### Todo List
- collapsible (for grouping todos, e.g., by date or project)
- badge (to show status, priority, or tags on todos)
- hover-card (for quick todo details or actions on hover)
- popover (for quick actions or info on todo items)
- separator (to visually divide sections or groups)

### Bulk Actions, Filters, Sorting
- dropdown-menu (for filter/sort options)
- radio-group (for filter selection)
- toggle-group (for view modes or filters)
- pagination (if you have many todos)

### Settings Panel
- sheet or drawer (for slide-in settings panel)
- slider (for adjusting settings like font size)
- switch (for toggles)
- select (for preferences)

### Feedback & Loading
- skeleton (for loading placeholders)
- progress (for loading or completion status)
- alert (for errors, warnings, or info)
- toast/sonner (for notifications)

### Accessibility & UX
- tooltip (for all icon buttons and less obvious actions)
- label (for all form fields)
- dialog (for more complex modals)
- table (if you want a tabular view of todos)

### Other Enhancements
- card (for dashboard/summary views)
- chart (for productivity stats, if you add analytics)
- carousel (for onboarding or feature highlights)
- resizable (for adjustable panels)
- scroll-area (for custom scrollable lists)

---

This file maps shadcn/ui components to your application's UI needs, both for current features and future enhancements. Use this as a reference for consistent, modern, and accessible UI development. 