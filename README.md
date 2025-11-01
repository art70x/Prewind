# 🌀 Prewind

> write less, expand more

A lightweight **preprocessor** that expands Tailwind-style shorthand into full variant syntax.
Write expressive, readable classes like:

```html
<div
  class="hover(bg-blue-500 text-blue-50) dark(border-blue-300 hover(bg-blue-400 text-blue-950))"
></div>
```

and automatically transform them into:

```html
<div
  class="hover:bg-blue-500 hover:text-blue-50 dark:border-blue-300 dark:hover:bg-blue-400 dark:hover:text-blue-950"
></div>
```

---

## ✨ Features

- Expand Tailwind shorthand groups automatically
- Supports **nested variants** (`hover()`, `dark()`, `group-hover()`, `peer-focus()`, etc.)
- Fast, zero-runtime — designed for build-time processing
- CLI-friendly — runs before Prettier or your dev server
- Optional `--debug` flag to print a visual transformation tree

---

## 📦 Installation

```bash
pnpm add -D prewind
# or
npm install -D prewind
# or
yarn add -D prewind
```

Global install (optional):

```bash
pnpm add -g prewind
```

---

## ⚙️ CLI Options

| Flag              | Description                                |
| ----------------- | ------------------------------------------ |
| `<patterns...>`   | File path(s) or glob pattern(s) to process |
| `-w, --write`     | Overwrite files in place                   |
| `-o, --out <dir>` | Output transformed files into a directory  |
| `--debug`         | Print detailed transformation tree         |
| `-h, --help`      | Show CLI help                              |

---

## 🚀 Usage

### Print to console

```bash
prewind src/test.html
```

Outputs the transformed file to console (does not modify files).

### Write in place

```bash
prewind -w src/test.html
```

Transforms and overwrites the file in place.

### Output to directory

```bash
prewind src/**/*.html -o dist
```

Transforms matching files and writes them into `dist/`.

### Debug the transformation tree

```bash
prewind src/test.html --debug
```

Displays the nested variant structure before output.

---

## 🧱 Example

**Input:**

```html
<div
  class="hover(bg-blue-500 text-blue-50) dark(border-blue-300 hover(bg-blue-400 text-blue-950))"
></div>
```

**Command:**

```bash
prewind -w test.html
```

**Output:**

```html
<div
  class="hover:bg-blue-500 hover:text-blue-50 dark:border-blue-300 dark:hover:bg-blue-400 dark:hover:text-blue-950"
></div>
```

---

## 🧩 Integration Example

Use Prewind as a pre-step in your workflow:

```json
{
  "scripts": {
    "dev": "vite",
    "preformat": "prewind src/**/*.html -w",
    "format": "prettier -w src"
  }
}
```

---

## 🧠 Why Prewind?

Manually writing Tailwind variants is verbose:

```html
<div
  class="hover:bg-blue-500 hover:text-blue-50 dark:hover:bg-blue-400 dark:hover:text-blue-950"
></div>
```

Prewind lets you express them structurally and clearly:

```html
<div class="hover(bg-blue-500 text-blue-50) dark(hover(bg-blue-400 text-blue-950))"></div>
```

Runs before Prettier or Tailwind JIT — so there are **no conflicts** with formatters or dev servers.

---

## 🛠️ Development

```bash
pnpm install
pnpm run dev src/test.html
```

Build production CLI:

```bash
pnpm run build
```

Test globally:

```bash
pnpm link --global
prewind src/**/*.html
```

---

## 🧭 Roadmap

- [ ] Add config file support (`prewind.config.json`)
- [ ] Add `--dry` and `--silent` modes

---

## 🧑‍💻 Author

**art70x** — MIT License © 2025
[GitHub Repository →](https://github.com/art70x/Prewind)

---

> 🌀 write less, expand more_
