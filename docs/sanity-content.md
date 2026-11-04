# Managing Lloyd's content

Sanity stores the content in a hosted dataset. This repository defines the editor and the website; deploying code does not itself reorder or edit the dataset.

## Category and product order

Every category and product has a **Menu order** number. Lower numbers appear first. Use `10`, `20`, `30`, etc. so you can insert `15` later. Product order applies within its category. The regular menu and QR menu use the same order in both languages. Equal numbers sort by English name, then document ID; records without a number appear after numbered records. Editing a name, price or description no longer promotes an item to the top.

In **Structure**, open **Categories**, **Products**, or **Products by category**. Change Menu order and publish. Lists default to menu order; if your browser remembers a previous list sort, select **Menu order** from the list's `…` menu. Existing records are not migrated automatically. Use **Menu manager** to fill in their order numbers in bulk.

## Bulk menu editor

The **Menu manager** tab in `/studio` shows the current menu, with drafts taking precedence over published records. You can filter products by category, search by name, and edit order, both names, prices, descriptions, category assignments and category slugs.

1. Edit the table, or choose **Export menu CSV** and open it in Excel, Numbers or Google Sheets.
2. Keep the headers and IDs. Save as comma-separated CSV with UTF-8 encoding. Prices use a decimal point (`3.50`); menu orders are non-negative integers.
3. Choose **Import menu CSV**. The review shows each changed field's old and new value. The import does not write to Sanity yet.
4. Choose **Save drafts**. The entire batch saves in one transaction. Existing drafts use revision checks; concurrent edits detected during the preflight stop the save. Export pending edits before reloading after a conflict.
5. Open the saved document links to check and **Publish** in Sanity's editor. New categories must be published before products referencing them. Allow about 20 seconds for the website's menu cache to refresh.

Pending table/import edits are kept in this tab only. Save or export them before switching Studio tools or navigating away. **Export menu CSV** includes pending table edits as well as the fetched drafts. **Discard pending edits** restores the last fetched snapshot; **Reload from Sanity** then fetches the latest version.

### CSV format

| Column | Meaning |
| --- | --- |
| `id` | Stable document ID. Do not change existing IDs. New IDs use letters, numbers, `_` or `-`. |
| `type` | `category` or `product`; existing types cannot change. |
| `name_en`, `name_hr` | English and Croatian names, required for changed/new records. |
| `sortOrder` | Menu order. Blank removes an existing explicit order. |
| `price` | Product price in euros, required for products. |
| `description_en`, `description_hr` | Optional product descriptions. Blank clears the corresponding description. |
| `categoryId` | Product's category document ID. |
| `slug` | Required for categories; leave blank for products. |

Columns may be rearranged but must all be present. Quoted commas, quotation marks and multiline descriptions are supported. Files are limited to 2 MB / 2,000 rows, with at most 500 changed documents per save.

To create content, add a row with a new unique ID. Include a new category's row in the same file as products using that category. Import matches by ID: changing an ID creates a new record. Omitted rows are retained, never deleted. Existing images, crop/hotspot information and fields outside the CSV are preserved. Upload/change images in the normal document editor. CSV is for menu editing, not a full database backup.

## Full dataset export/import, including images

Use the installed Sanity CLI for a complete archive containing all content types, drafts, and image/file binaries. These commands use your Sanity account's permissions, separate from GitHub. See [Sanity's export documentation](https://www.sanity.io/docs/content-lake/exporting-data) and [import documentation](https://www.sanity.io/docs/content-lake/importing-data).

Use Node 24 (`nvm use` reads the included `.nvmrc`); the installed Sanity CLI has a dependency incompatibility on Node 26. Install dependencies (`npm ci`), configure `.env.local` with the existing project's values, and sign in:

```dotenv
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
```

```sh
npm run sanity:login
mkdir -p backups
npm run sanity:export -- production backups/lloyd-2026-11-04.tar.gz
```

Use your actual dataset name. Avoid `--no-assets` / `--no-drafts` for a complete backup. Read export warnings: an archive can finish even when an individual asset download fails. Backups are ignored by Git because they can contain unpublished content.

To check a backup, create an empty test dataset and import there:

```sh
npx sanity dataset create restore-test
npm run sanity:import -- backups/lloyd-2026-11-04.tar.gz restore-test
```

For advanced editing, extract a **copy** of the archive and edit its `data.ndjson` (one JSON object per line), retaining IDs, document types, references and asset files. Import the modified archive/directory into a test dataset and validate it before using it in production. Use menu CSV for routine price, name and order updates.

Importing into a populated dataset is additive and does not delete documents absent from the file. The CLI normally rejects existing IDs. `--missing` skips existing IDs; `--replace` overwrites them, including fields omitted from incoming documents. Only use `--replace` deliberately after making a fresh backup. An import is not an exact rollback of records created after that backup.

## Development checks

Use Node 24 for the project and its dependency-free import/planning tests:

```sh
npm run test:menu
npx tsc --noEmit
npm run build
```

Sanity schema extraction and the website build require the Sanity environment settings. These tests never connect to or mutate your dataset.
