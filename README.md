# 🧪 Ngx-Admin Angular 14 – Playwright Practice App

This is a modified and lightweight version of [Akveo's ngx-admin](https://github.com/akveo/ngx-admin), adapted for practicing UI automation with [Playwright](https://playwright.dev/).

---

## 🚀 Purpose

This project is designed for:

- Practicing end-to-end UI automation tests with Playwright
- Exploring Angular 14 component structure
- Testing form layouts, modals, tables, and charts
- Integrating Playwright with CI/CD pipelines (GitHub Actions)

---

## ⚙️ Setup Instructions

### 🟩  Windows

```powershell
.\setup.ps1
```

### 🟩 Linux/macOS

```bash
bash setup.sh
```

This scripts will:

- 🧹 **Clean up old dependencies** (`node_modules`, `package-lock.json`)
- 📦 **Install packages with legacy peer support** (`npm install --legacy-peer-deps`)
- 🔗 **Copy missing Babel helper file** (`regeneratorValues.js`) to nested path
- 🚀 **Start the Angular project** (`npm start`)

## 🧩 Known Issues & Fixes

**❗ Module not found: regeneratorRuntime.js**

Some libraries (e.g. d3-array) expect a helper file in a nested Babel runtime path. This project includes a workaround that copies the file manually during setup.

**❗ Peer dependency conflicts**

Use npm install --legacy-peer-deps to avoid installation errors caused by incompatible peer versions.

## 🧪 Playwright Tests

Tests are located in `/tests` and cover:

- ✅ Form interactions  
- ✅ Radio buttons and checkboxes  
- ✅ Dropdowns and themes  
- ✅ Tooltips and modals  
- ✅ Browser dialog boxes  
- ✅ Smart tables  
- ✅ Datepickers  
- ✅ Sliders and mouse actions  
- ✅ Drag and drop (with iframe)  
- ✅ Role-based locators   
- ✅ Locator chaining and filtering  
- ✅ Parent-child relationships  
- ✅ Assertions  
- ✅ Text and attribute extraction  
- ✅ Reusable page objects (`PageManager`)  
- ✅ Parametrized methods

To run tests:
```bash
npx playwright test
```
To open Playwright UI:
```
npx playwright test --ui
```
## 📦 Dependencies

- Angular 14
- Akveo ngx-admin (stripped version)
- Playwright
- d3-array, ngx-echarts, ng2-smart-table (with manual fixes)
