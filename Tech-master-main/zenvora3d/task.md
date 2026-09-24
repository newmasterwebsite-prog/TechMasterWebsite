# Services & Brand Collaborations CMS Upgrade Tasks

## 1. Services CMS
- [x] Structure database schema to hold exactly 5 fixed sections
- [x] Implement section-level reordering in database
- [x] Clean collapsible card headers and move settings block inline inside card bodies
- [x] Remove section and row status Switch toggle buttons completely
- [x] Integrate project core `<ConfirmDialog>` and `<Dialog>` components to fix View and Delete buttons dynamically
- [x] Create atomic context updater `deleteNestedItem` inside `DatabaseContext.jsx` to prevent stale closure deletion errors
- [x] Remove stale `servicesPageRef.current` references from event handlers to prevent JavaScript console crashes
- [x] Remove asynchronous `setTimeout` from Delete modal, performing immediate deletions
- [x] Add sanitisation on-the-fly inside local storage load hooks for list array validation
- [x] Implement real-time search & filters toolbar
- [x] Remove the global "Add Section" complexity from headers

## 2. Brand Collaborations CMS
- [x] Compare visitor panel TSX page schema with admin panel CMS JSX component
- [x] Identify all missing dynamic CMS fields (Reach, Impressions, Engagement, Conversions, Case Study fields, Video embed link, Social media link, Gallery images, Collab date, Collab type, Featured placement)
- [x] Relocate modal state controllers (`showFormModal`, `editingItem`, `deleteId`) from `App.jsx` directly inside `Collaborations.jsx`
- [x] Integrate project core `<Dialog>` and `<ConfirmDialog>` modals into `Collaborations.jsx`
- [x] Construct a luxury, multi-section scrollable edit form supporting all 24 CMS properties
- [x] Incorporate single and multiple mock file uploading zones for brand logos, campaign banners, and gallery showcases
- [x] Embed tag/list entry input manager for services rendered listing
- [x] Connect form saves and row deletions to `'collaborations'` collection using `addItem`, `updateItem`, and `deleteItem` context hooks
- [x] Remove the redundant mockup modal form wrapper from `App.jsx`
- [x] Validate production compiles cleanly with Vite bundler
