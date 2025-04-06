# Admin Panel Design System

This document outlines the standardized components and design patterns to be used across the admin panel to ensure consistency in design and layout.

## Core Components

### AdminPageLayout

The `AdminPageLayout` component provides a consistent structure for all admin panel pages. It includes:

- A standardized page header with title and description
- Consistent loading and error states
- Proper spacing and layout

```tsx
<AdminPageLayout
  title="Page Title"
  description="Page description text goes here."
  isLoading={dataIsLoading}
  isError={dataIsError}
  errorTitle="Error Loading Data"
  errorDescription="Error description text goes here."
  actions={<Button>Action Button</Button>} // Optional
>
  {/* Page content goes here */}
</AdminPageLayout>
```

### SearchFilterBar

The `SearchFilterBar` component provides a consistent search and filter interface for all admin panel pages.

```tsx
<SearchFilterBar
  queryTerm={queryTerm}
  setQueryTerm={setQueryTerm}
  handleSearch={handleSearch}
  placeholder="Search..."
  filterComponent={<FilterComponent />}
/>
```

### AdminDataTable

The `AdminDataTable` component provides a consistent table layout with built-in empty state handling and pagination.

```tsx
<AdminDataTable
  data={dataQuery?.data?.items}
  columns={[
    {
      header: "Column 1",
      cell: (item) => <span>{item.property}</span>,
    },
    {
      header: "Column 2",
      cell: (item) => <Badge>{item.status}</Badge>,
    },
    // Add more columns as needed
  ]}
  currentPage={currentPage}
  meta={dataQuery?.meta}
  onPageChange={handlePageChange}
  itemName="items"
  emptyState={{
    icon: IconComponent, // Must be a Lucide icon component
    title: "No items found",
    description: "Description text goes here.",
  }}
/>
```

#### Styling

The AdminDataTable component includes the following styling features:

- Consistent padding for table cells (px-4 py-3)
- Full-width empty state display
- Proper overflow handling for tables
- Consistent spacing with the original table footer design

> **Note**: The `icon` property in `emptyState` must be a Lucide icon component, not a custom React component.

### AdminTableFooter

The `AdminTableFooter` component provides a consistent footer for tables with pagination and item count information. This is used internally by AdminDataTable but can also be used separately.

```tsx
<AdminTableFooter
  currentPage={currentPage}
  meta={dataQuery?.meta}
  onPageChange={handlePageChange}
  itemName="items"
/>
```

## Page Structure

All admin panel pages should follow this structure:

```tsx
export default function ExamplePage() {
  // Data fetching and state management

  return (
    <AdminPageLayout
      title="Page Title"
      description="Page description text goes here."
      isLoading={dataIsLoading}
      isError={dataIsError}
      errorTitle="Error Loading Data"
      errorDescription="Error description text goes here."
    >
      <SearchFilterBar
        queryTerm={queryTerm}
        setQueryTerm={setQueryTerm}
        handleSearch={handleSearch}
        placeholder="Search..."
        filterComponent={<FilterComponent />}
      />

      <AdminDataTable
        data={dataQuery?.data?.items}
        columns={[
          {
            header: "Column 1",
            cell: (item) => <span>{item.property}</span>,
          },
          {
            header: "Column 2",
            cell: (item) => <Badge>{item.status}</Badge>,
          },
          // Add more columns as needed
        ]}
        currentPage={currentPage}
        meta={dataQuery?.meta}
        onPageChange={handlePageChange}
        itemName="items"
        emptyState={{
          icon: IconComponent,
          title: "No items found",
          description: "Description text goes here.",
        }}
      />
    </AdminPageLayout>
  );
}
```

## Empty States

Always use the `EmptyState` component for empty data states:

```tsx
<EmptyState
  icon={IconComponent}
  title="No items found"
  description="Description text goes here."
  action={{
    label: "Action Button",
    onClick: () => handleAction(),
  }}
/>
```

## Typography

- Page titles: `text-black/75 text-3xl font-bold` with the `domine` font
- Page descriptions: `text-muted-foreground text-base font-medium`
- Section titles: `text-lg font-semibold`
- Table headers: Default styling from the Table component

## Spacing

- Main content spacing: `space-y-8`
- Section spacing: `space-y-4`
- Header spacing: `space-y-2`

## Colors

Use the theme colors defined in the design system:

- Primary: For main actions and highlights
- Secondary: For secondary actions
- Muted: For backgrounds and less important elements
- Destructive: For delete actions and errors

## Icons

Use Lucide icons consistently throughout the admin panel. Common icons:

- Search: `<SearchIcon />`
- Filter: `<FilterIcon />`
- Add: `<PlusIcon />`
- Delete: `<Trash2Icon />`
- Edit: `<PencilIcon />`
- Settings: `<SettingsIcon />`

## Buttons

Use consistent button variants:

- Primary actions: `variant="default"`
- Secondary actions: `variant="secondary"`
- Destructive actions: `variant="destructive"`
- Outline actions: `variant="outline"`
- Ghost actions: `variant="ghost"`

## Forms

Use the Form components from the design system for all forms:

- `<Form>`
- `<FormField>`
- `<FormItem>`
- `<FormLabel>`
- `<FormControl>`
- `<FormDescription>`
- `<FormMessage>`

## Tables

Use the Table components from the design system for all tables:

- `<Table>`
- `<TableHeader>`
- `<TableBody>`
- `<TableFooter>`
- `<TableHead>`
- `<TableRow>`
- `<TableCell>`

## Cards

Use the Card components from the design system for all cards:

- `<Card>`
- `<CardHeader>`
- `<CardTitle>`
- `<CardDescription>`
- `<CardContent>`
- `<CardFooter>`

## Responsive Design

Ensure all pages are responsive and work well on different screen sizes:

- Use grid layouts with responsive columns: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- Use responsive spacing: `p-4 md:p-6 lg:p-8`
- Use responsive text sizes: `text-sm md:text-base lg:text-lg`
