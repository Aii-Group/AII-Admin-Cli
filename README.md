<div align="center">
  <img src="./public/favicon.png" alt="AII Logo" width="100" />
  <h1>AII Admin CLI</h1>
</div>

#### Description

`AII Admin CLI` is a React-based admin dashboard project that supports internationalization (i18n), theme switching (light/dark mode), and aims to provide a modern, extensible solution for management systems.

---

### Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Components](#components)
   - [AiiTable](#aiitable)
   - [AiiSearch](#aiisearch)
   - [AiiDrawer](#aiidrawer)
   - [AppProvider](#appprovider)
4. [Menu Format](#menu-format)
5. [Contributing](#contributing)
6. [License](#license)

---

### Features

- **Internationalization (i18n)**: Powered by `react-i18next`, supports dynamic language switching.
- **Theme Switching**: Customizable themes using Ant Design, supports light and dark modes.
- **Reusable Components**: Provides highly customizable components like tables, search forms, and drawers.
- **Global State Management**: Efficient state management using Zustand.
- **Dynamic Route Generation**: Dynamically generates routes based on the menu structure, with support for lazy-loaded components.
- **AI Chat Integration**: Includes an AI-powered chat component with support for OpenAI's GPT model, featuring real-time streaming, markdown rendering, and code block support.

---

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Aii-Group/AII-Admin-Cli.git
   ```

2. Navigate to the project directory:

   ```bash
   cd aii-admin-cli
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Start the development server:

   ```bash
   pnpm dev
   ```

5. Open your browser and visit:
   ```
   http://localhost:3001
   ```

---

### Components

#### AiiTable

`AiiTable` is a highly customizable table component based on Ant Design, supporting batch operations, custom toolbars, and dynamic column rendering.

**Key Features**:

- **Dynamic Columns**: Allows dynamic definition of table columns.
- **Batch Operations**: Supports batch deletion, export, and more.
- **Pagination**: Built-in pagination with customizable page size.
- **Toolbar**: Add custom buttons above the table.
- **Row Selection**: Enables row selection for batch operations.
- **Action Buttons**: Add action buttons (e.g., edit, delete) for each row.

**Usage Example**:

```tsx
import React from 'react'
import AiiTable from '@/components/AiiTable'

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Address', dataIndex: 'address', key: 'address' },
]

const dataSource = [
  { key: '1', name: 'John Doe', age: 32, address: 'New York' },
  { key: '2', name: 'Jane Smith', age: 28, address: 'London' },
]

const App = () => (
  <AiiTable
    rowKey="key"
    columns={columns}
    dataSource={dataSource}
    pagination={{ current: 1, pageSize: 10, total: 50 }}
    toolbar={[{ label: 'Add', icon: <PlusOutlined />, onClick: () => console.log('Add clicked') }]}
    operations={['DETAIL', 'EDIT', 'DELETE']}
  />
)

export default App
```

---

#### AiiSearch

`AiiSearch` is a flexible search form component that supports dynamic form items, collapsible layouts, and search/reset actions.

**Key Features**:

- **Dynamic Form Items**: Render form fields dynamically using an array.
- **Collapsible Layout**: Supports collapsible/expandable layout for many fields.
- **Search and Reset**: Built-in search and reset buttons.

**Usage Example**:

```tsx
import React from 'react'
import { Form, Input } from 'antd'
import AiiSearch from '@/components/AiiSearch'

const formItems = [
  <Form.Item name="name" label="Name" key="name">
    <Input placeholder="Enter name" />
  </Form.Item>,
  <Form.Item name="age" label="Age" key="age">
    <Input placeholder="Enter age" />
  </Form.Item>,
]

const App = () => <AiiSearch items={formItems} onSearch={(values) => console.log('Search values:', values)} />

export default App
```

---

#### AiiDrawer

`AiiDrawer` is a global drawer component based on Ant Design's `Drawer`, supporting dynamic content and global management.

**Key Features**:

- **Global Management**: Manage drawer visibility through context.
- **Dynamic Content**: Pass dynamic content to the drawer.
- **Customizable Props**: Supports all Ant Design `Drawer` props.

**Usage Example**:

1. **Wrap your app with `DrawerProvider`**:

```tsx
import React from 'react'
import { DrawerProvider } from '@/components/AiiDrawer'

const App = () => (
  <DrawerProvider>
    <YourApp />
  </DrawerProvider>
)

export default App
```

2. **Control the drawer using `useDrawer`**:

```tsx
import React from 'react'
import { Button } from 'antd'
import { useDrawer } from '@/components/AiiDrawer'

const ExampleComponent = () => {
  const { showDrawer, closeDrawer } = useDrawer()

  const handleOpenDrawer = () => {
    showDrawer(
      <div>
        <h3>Drawer Content</h3>
        <p>This is some content inside the drawer.</p>
        <Button onClick={closeDrawer}>Close Drawer</Button>
      </div>,
      { title: 'Custom Drawer Title', width: 500 },
    )
  }

  return <Button onClick={handleOpenDrawer}>Open Drawer</Button>
}

export default ExampleComponent
```

---

#### AppProvider

`AppProvider` is a global context provider that integrates Ant Design's `message`, `Modal`, and `notification` APIs for global usage.

**Key Features**:

- **Global Message Notifications**: Call `message` API via `window.$message`.
- **Global Modals**: Call `Modal` API via `window.$modal`.
- **Global Notifications**: Call `notification` API via `window.$notification`.

**Usage Example**:

1. **Wrap your app with `AppProvider`**:

```tsx
import React from 'react'
import ReactDOM from 'react-dom'
import AppProvider from '@/components/AppProvider'
import App from './App'

ReactDOM.render(
  <AppProvider>
    <App />
  </AppProvider>,
  document.getElementById('root'),
)
```

2. **Call APIs globally**:

```tsx
// Show a success message
window.$message.success('This is a success message!')

// Show a confirmation modal
window.$modal.confirm({
  title: 'Confirm Action',
  content: 'Are you sure you want to proceed?',
  onOk: () => console.log('Confirmed'),
})

// Show a notification
window.$notification.info({
  message: 'Notification Title',
  description: 'This is the content of the notification.',
})
```

---

### Menu Format

The menu format is an array of objects, where each object represents a menu item. Each menu item can have the following properties:

- `key`: Unique key for the menu item.
- `label`: Display label for the menu item.
- `icon`: Icon for the menu item.
- `path`: Path for the menu item.
- `children`: Array of child menu items.

**Example**:

```tsx
const menu = [
  {
    key: 'Table',
    label: 'Table',
    icon: 'table',
    path: '/table',
    children: [
      {
        key: 'Basic_Table',
        label: 'Basic Table',
        path: '/table/basic',
        filePath: '/table/basic',
      },
      {
        key: 'Advanced_Table',
        label: 'Advanced Table',
        path: '/table/advanced',
        filePath: '/table/advanced',
      },
    ],
  },
]
```

---

### Contributing

We welcome contributions! Please refer to the [Contributing Guide](CONTRIBUTING.md) to get started.

---

### License

This project is licensed under the [MIT License](LICENSE).
