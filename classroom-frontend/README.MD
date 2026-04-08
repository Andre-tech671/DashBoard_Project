# 🎨 Classroom Frontend Dashboard

A modern, responsive administrative interface built with React 19 and Refine.dev.

## 🚀 Tech Stack

- **Framework**: React 19
- **Admin Framework**: Refine.dev
- **Styling**: Tailwind CSS 4
- **UI Components**: Shadcn/UI
- **Data Tables**: Tanstack Table (v8)

## 📦 Refine Resources

The dashboard is organized into the following Refine resources, each mapping to backend endpoints:

| Resource | Functionality |
| :--- | :--- |
| `Dashboard` | Custom page with stats, charts, and activity feeds. |
| `Classes` | CRUD operations for managing course schedules and instructors. |
| `Students` | Management of student profiles and academic history. |
| `Enrollments` | View and filter registration data across various classes. |

## UI Components & Design System

We use **Shadcn/UI** for consistent, accessible components. Key components utilized include:
- **DataTable**: Powered by Tanstack Table for advanced filtering and sorting.
- **Card**: For dashboard metric summaries.
- **Forms**: Built using Refine's `useForm` hook integrated with Shadcn inputs.

## 🔧 Troubleshooting

### DataTable Pagination Issues

If you encounter layout breaking or rendering errors when setting the pagination variant in the `DataTable` component:

**Problem**: The pagination buttons or labels do not appear correctly when using simplified views.

**Fix**: Ensure you are passing the `paginationVariant` prop correctly to your custom `DataTable` component. If using the default Shadcn integration, modify the component as follows:

```tsx
// Ensure your DataTable component explicitly supports the prop
<DataTable 
  columns={columns} 
  data={data} 
  paginationVariant="simple" // Required for the condensed footer view
/>
```
*If the issue persists, verify that your Tailwind 4 configuration isn't purging the utility classes required for the simplified pagination footer.*