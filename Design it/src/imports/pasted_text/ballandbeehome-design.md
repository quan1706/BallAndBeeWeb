Design a complete website for "BALLANDBEEHOME" — a Vietnamese home decor 
and lifestyle brand selling furniture, lighting, decorations, kitchen & dining 
items, souvenirs, and photography props.

═══════════════════════════════════════
BRAND GUIDELINES (apply to ALL screens)
═══════════════════════════════════════

Personality: warm, artisan, trustworthy, natural, cozy.

Colors:
- Background:   #FAF7F2  (warm cream)
- Primary:      #C8954A  (warm gold)     → buttons, highlights, active states
- Secondary:    #1E3A5F  (deep navy)     → headings, sidebar, nav
- Accent:       #E07B54  (terracotta)    → badges, tags, hover
- Surface:      #FFFFFF  (cards, modals)
- Muted text:   #888888
- Border:       #E8E0D5

Typography:
- Headings: Playfair Display (serif)
- Body / UI: Inter (sans-serif)
- Scale: 12 / 14 / 16 / 20 / 24 / 32 / 48px

Shared components (reuse across all pages):
- Border radius: 8px (inputs, small cards) / 12px (large cards) / 24px (pills)
- Shadow: 0 2px 12px rgba(0,0,0,0.08)
- Button primary: #C8954A bg, white text, 8px radius
- Button outlined: transparent bg, #C8954A border + text
- Input focus: 2px gold border, no box shadow
- Header (user): white sticky, logo left, nav center, icons right, 1px border bottom
- Footer (user): #1E3A5F bg, white text, 4-column grid

═══════════════════════════════════════
ROUTING & ACCESS CONTROL
═══════════════════════════════════════

USER FLOW — public, no login required:
  /                   Homepage
  /products           Product listing
  /products/:slug     Product detail
  /blog               Blog listing
  /blog/:slug         Blog post detail
  /contact            Contact

  - No register, no user account, no cart, no checkout
  - Conversion = contact via phone or Zalo only
  - Visiting /admin/* without token → redirect to /admin/login

ADMIN FLOW — private, login required:
  /admin/login        Login (only public admin page)
  /admin              Dashboard
  /admin/products     Product list
  /admin/products/new Add product
  /admin/products/:id Edit product
  /admin/categories   Category tree
  /admin/blog         Blog list
  /admin/blog/new     Write post
  /admin/blog/:id     Edit post
  /admin/settings     Company settings

  - Token stored in localStorage
  - No token → redirect to /admin/login
  - Login success → redirect to /admin
  - Logout → clear token → back to /admin/login
  - No link to /admin from user-facing nav

═══════════════════════════════════════
PAGE 1 — HOMEPAGE (/)
═══════════════════════════════════════

HEADER (sticky, white, 1px border #E8E0D5):
- Left: "BALLANDBEEHOME" gold wordmark logo
- Center: Trang chủ / Sản phẩm / Blog / Liên hệ
- Right: search icon + hamburger icon

HERO (90vh, full width):
- Warm lifestyle photo background (living room / home decor scene)
- Left-aligned text on semi-transparent dark overlay panel:
  · Eyebrow: "Phong cách sống Việt" (12px gold small caps)
  · H1: "Không gian sống – Tinh tế từng chi tiết" (Playfair 48px white)
  · Subtext: 16px white 60% opacity, 2 lines
  · Buttons: "Khám phá sản phẩm" (gold filled) + "Về chúng tôi" (white outlined)

CATEGORIES (white bg):
- Centered title: "Danh mục sản phẩm" Playfair 32px
- 3×2 grid of category cards, full-bleed image, dark gradient bottom overlay,
  white category name bottom-left, hover: scale + gold border
- Categories: Nội thất / Lighting / Trang trí / 
              Kitchen & Dining / Souvenir / Đạo cụ chụp hình

FEATURED PRODUCTS (cream bg):
- Title left: "Sản phẩm nổi bật" — "Xem tất cả →" right
- Row of 4 product cards (white, shadow, 8px radius):
  · 1:1 image, "Nổi bật" gold pill top-left
  · Category tag 12px muted, product name 16px navy, "Xem chi tiết →" gold

BLOG PREVIEW (white bg):
- Centered title: "Cảm hứng & Phong cách sống"
- 3 cards: 16:9 thumbnail, terracotta topic pill, navy serif title,
  2-line excerpt, date muted

ABOUT SNIPPET (cream bg):
- Two columns: Left: gold left-border, brand story 3 lines, "Tìm hiểu thêm →"
               Right: lifestyle image 12px radius

FOOTER (#1E3A5F bg, white text):
- Col 1: Logo + tagline + social icons (Facebook / Instagram / TikTok)
- Col 2: Nav links 14px
- Col 3: 📍 SĐT 📞 Email 📧 Hours 🕐 with icons
- Col 4: Google Maps embed rounded 8px
- Bottom bar: copyright centered 60% white opacity

═══════════════════════════════════════
PAGE 2 — PRODUCT LISTING (/products)
═══════════════════════════════════════

FILTER BAR (sticky, white, shadow):
- Row 1: category pills — Tất cả / Nội thất / Lighting / Trang trí /
         Kitchen & Dining / Souvenir / Đạo cụ
- Row 2: subcategory pills (shown dynamically when category selected)
- Right: Tags dropdown + Sort dropdown + "24 sản phẩm" count

PRODUCT GRID (3 columns, 24px gap, cream bg):
Each card (white, 8px radius, shadow):
- Square 1:1 image top
- Badge top-left: "Mới" gold or "Nổi bật" terracotta pill
- Category breadcrumb 12px muted
- Product name 16px navy medium
- "Xem chi tiết →" gold 14px bottom
- Hover: shadow increase + image zoom 105%

PAGINATION (centered): ← 1 2 3 ... 8 →

═══════════════════════════════════════
PAGE 3 — PRODUCT DETAIL (/products/:slug)
═══════════════════════════════════════

Breadcrumb: Trang chủ > Kitchen & Dining > Tableware (14px muted)

TWO COLUMNS (60 / 40):

Left — Image gallery:
- Large square main image, 12px radius
- 4 thumbnails row below, active = gold border
- Zoom icon top-right overlay

Right — Product info:
- Product name: Playfair 32px navy
- Short description: 16px muted, 3 lines
- Divider
- Spec rows (icon + label + value):
  📦 Chất liệu: Gốm sứ thủ công
  📐 Kích thước: 20cm x 20cm
  🌿 Xuất xứ: Việt Nam
- Tags: #ceramic #vintage #handmade (pill chips, cream bg, gold border)
- Divider
- CTA box (#FDF3E3 bg, 12px radius, 20px padding):
  · Heading: "Quan tâm sản phẩm này?" 16px medium
  · Subtext: "Liên hệ để được tư vấn và đặt hàng" 14px muted
  · "📞 Gọi ngay: 0901 234 567" (gold filled, full width)
  · "💬 Nhắn Zalo" (outlined gold, full width)

BELOW FOLD (full width):
"Sản phẩm liên quan" + 4-card horizontal scroll

═══════════════════════════════════════
PAGE 4 — BLOG LISTING (/blog)
═══════════════════════════════════════

HERO (cream bg, centered):
- Title: "Cảm hứng & Phong cách sống" Playfair 40px
- Subtitle 16px muted
- Topic pills: Tất cả / Phong cách sống / Hướng dẫn bày trí / Tin tức

FEATURED POST (full-width two-column card):
- Left 55%: large landscape image 12px radius
- Right 45%: terracotta topic pill, large serif title,
  3-line excerpt, date + read time, "Đọc thêm →" gold

POSTS GRID (3 columns):
Each card: 16:9 image, topic pill, 18px serif title, 2-line excerpt, date muted

Pagination bottom.

═══════════════════════════════════════
PAGE 5 — CONTACT (/contact)
═══════════════════════════════════════

Centered title: "Liên hệ với chúng tôi" Playfair 36px

TWO COLUMNS (white cards, shadow, 12px radius):

Left card — Company info:
- "Thông tin liên hệ" gold small caps label
- Info rows 24px gap:
  📍 123 Nguyễn Văn Linh, Đà Nẵng
  📞 0901 234 567
  💬 Zalo: 0901 234 567
  📧 hello@ballandbeehome.com
  🕐 Thứ 2–7, 8:00–18:00
- Social icons: Facebook / Instagram / TikTok (circle navy)
- Divider
- Google Maps embed, 8px radius, full width, 220px height

Right card — Contact form:
- "Gửi tin nhắn" gold small caps label
- Fields (12px radius, gold focus border):
  Họ và tên* / Số điện thoại* / Email / Nội dung (textarea 5 rows)
- "Gửi ngay" gold filled full-width button
- "Chúng tôi sẽ phản hồi trong vòng 24 giờ" 14px muted centered

═══════════════════════════════════════
PAGE 6 — ADMIN LOGIN (/admin/login)
═══════════════════════════════════════

Standalone page — NO sidebar, NO header, NO footer.
Full-page cream background (#FAF7F2) with subtle brand watermark.

Centered card (480px, white, shadow, 16px radius):
- Logo "BALLANDBEEHOME" gold wordmark centered top
- "Đăng nhập quản trị" Playfair 24px navy
- "Chỉ dành cho quản trị viên" 14px terracotta muted
- Divider
- Email input (mail icon left)
- Password input (lock icon left, show/hide eye icon right)
- "Đăng nhập" gold filled full-width button
- "Quên mật khẩu?" small muted link centered

NO register link. Admin only.

═══════════════════════════════════════
PAGE 7 — ADMIN DASHBOARD (/admin)
═══════════════════════════════════════

LAYOUT: fixed sidebar 240px + main content area (cream #F5F5F5 bg)

SIDEBAR (#1E3A5F):
- Top: "BALLANDBEEHOME" gold wordmark + "Admin" 12px muted label
- Nav items (icon + label, 44px height):
  Active: gold left border 3px + gold text + light navy tint bg
  Items: 🏠 Dashboard / 📦 Sản phẩm / 📁 Danh mục / 
         ✏️ Blog / ⚙️ Cài đặt
- Bottom: avatar circle + "Admin" name + logout icon

TOP BAR (white, shadow):
- Left: "Tổng quan" 20px bold
- Right: date text + bell icon + avatar

STAT CARDS (4 cards, white, shadow, 8px radius):
Each: gold tint icon circle + 14px muted label + 32px bold navy value
- Tổng sản phẩm: 124
- Danh mục: 8
- Bài blog: 16
- Sản phẩm nổi bật: 6

TWO COLUMNS below:
Left — "Sản phẩm mới thêm" table card:
  Columns: 40px thumb / Tên / Danh mục / Ngày thêm / 
  Status pill: "Hiển thị" green / "Ẩn" gray

Right — "Phân bổ danh mục" card:
  Donut chart, brand colors:
  #C8954A #1E3A5F #E07B54 #88B04B #6B7DB3 #D4956A
  Legend below chart

QUICK ACTIONS (bottom):
"+ Thêm sản phẩm" gold filled + "+ Viết bài blog" outlined

═══════════════════════════════════════
PAGE 8 — ADMIN PRODUCT LIST (/admin/products)
═══════════════════════════════════════

TOP BAR: "Quản lý sản phẩm" title + "+ Thêm sản phẩm" gold button right

FILTER ROW: search input left + category dropdown + status dropdown

TABLE (white card, full width):
Columns: ☐ / Ảnh (48px) / Tên sản phẩm / Danh mục / Danh mục con /
         Tags / Nổi bật (star icon) / Trạng thái / Ngày tạo / Actions

Row actions: ✏️ Sửa / 👁 Ẩn/Hiện / 🗑 Xóa (icon buttons)
Status pill: "Hiển thị" green / "Ẩn" gray
Bulk action bar (appears when rows checked): "Ẩn đã chọn" + "Xóa đã chọn"

Pagination bottom right.

═══════════════════════════════════════
PAGE 9 — ADMIN PRODUCT FORM (/admin/products/new)
═══════════════════════════════════════

Breadcrumb: Sản phẩm > Thêm sản phẩm mới (+ back arrow)

Four white cards, 20px gap, max-width 800px centered:

CARD 1 — "Thông tin cơ bản":
- Input: Tên sản phẩm (full width)
- Rich text area: Mô tả (toolbar: Bold / Italic / List / Link)
- Toggles row: "Hiển thị trên website" + "Ghim lên trang chủ"

CARD 2 — "Phân loại":
- Two cascading dropdowns: Danh mục chính → Danh mục con
- Tag input: type + Enter → gold chip with × button

CARD 3 — "Thông số kỹ thuật":
- Three inputs in a row: Chất liệu / Kích thước / Xuất xứ

CARD 4 — "Hình ảnh sản phẩm":
- Dashed upload zone (gold dashed border, ☁️ icon, instruction text)
- 4-column image preview grid, each with × delete overlay on hover
- Helper: "Ảnh đầu tiên là ảnh đại diện"

STICKY BOTTOM BAR (white, top border):
- Left: "Hủy" text link
- Right: "Lưu nháp" outlined + "Đăng sản phẩm" gold filled

═══════════════════════════════════════
PAGE 10 — ADMIN CATEGORY MANAGEMENT (/admin/categories)
═══════════════════════════════════════

TOP BAR: "Quản lý danh mục" + "+ Thêm danh mục" gold button

TWO COLUMNS:

Left — Category tree (white card):
Tree view, 2 levels:
▼ Nội thất (expand icon)
   · Nội thất trong nhà
   · Nội thất trẻ em
   · Nội thất ngoài trời
▼ Kitchen & Dining
   · Tableware
   · Serveware
   · (etc.)

Each row: category name + item count badge + ✏️ 🗑 icons
Drag handle icon left for reordering

Right — Edit panel (white card):
Shown when category selected:
- Input: Tên danh mục
- Dropdown: Danh mục cha (or "Là danh mục chính")
- Image upload: ảnh đại diện (for Level 1 only)
- Color picker: màu đại diện (6 preset swatches)
- "Lưu" gold filled + "Hủy" text link

═══════════════════════════════════════
PAGE 11 — ADMIN BLOG LIST (/admin/blog)
═══════════════════════════════════════

TOP BAR: "Quản lý Blog" + "+ Viết bài mới" gold button

FILTER ROW: search + topic dropdown + status dropdown

TABLE (white card):
Columns: ☐ / Thumbnail / Tiêu đề / Chủ đề / Trạng thái / Ngày đăng / Actions
Status pill: "Đã đăng" green / "Nháp" gray
Row actions: ✏️ Sửa / 👁 Ẩn/Hiện / 🗑 Xóa

═══════════════════════════════════════
PAGE 12 — ADMIN BLOG FORM (/admin/blog/new)
═══════════════════════════════════════

Breadcrumb: Blog > Viết bài mới

TWO COLUMNS (70 / 30):

Left — Content (white card):
- Input: Tiêu đề bài viết (large, Playfair preview)
- Full rich text editor: Bold / Italic / H2 / H3 / List / 
  Quote / Image insert / Link
- Large content area

Right — Settings (white card, sticky):
- Image upload: Ảnh bìa (drag drop, preview)
- Dropdown: Chủ đề
- Input: Tóm tắt (textarea 3 rows)
- Status toggle: Nháp ↔ Đã đăng
- "Lưu nháp" outlined + "Đăng bài" gold (stacked full width)

═══════════════════════════════════════
PAGE 13 — ADMIN SETTINGS (/admin/settings)
═══════════════════════════════════════

Sidebar same. Max-width 760px centered.

Tab bar: Thông tin công ty / Liên hệ & Mạng xã hội / Google Map

TAB 1 — Thông tin công ty:
- Logo upload (current preview + "Thay đổi" button)
- Inputs: Tên công ty / Slogan
- Textarea: Giới thiệu ngắn

TAB 2 — Liên hệ & Mạng xã hội:
- Inputs with icons: SĐT / Zalo / Email / Địa chỉ / Giờ làm việc
- Social section: Facebook URL / Instagram URL / TikTok URL

TAB 3 — Google Map:
- Textarea: paste Google Maps embed code
- Live preview: rendered iframe 12px radius, full width, 300px height
- Helper text: "Lấy code tại Google Maps > Chia sẻ > Nhúng bản đồ"

Each tab: "Lưu thay đổi" gold button bottom right.

═══════════════════════════════════════
OUTPUT INSTRUCTIONS
═══════════════════════════════════════

Generate all 13 pages as separate Figma frames.

Frame naming:
[User] Home
[User] Products
[User] Product Detail
[User] Blog
[User] Contact
[Admin] Login
[Admin] Dashboard
[Admin] Product List
[Admin] Product Form
[Admin] Category Management
[Admin] Blog List
[Admin] Blog Form
[Admin] Settings

Breakpoints:
- Desktop: 1440px — all 13 pages
- Mobile: 390px — User pages only (Home / Products / Product Detail)

Additional deliverables:
- Component library frame:
  · Button variants (primary / outlined / ghost / disabled)
  · Input states (default / focus / error / disabled)
  · Card types (product / blog / stat / category)
  · Badge & pill variants (Mới / Nổi bật / Hiển thị / Ẩn / Nháp / Đã đăng)
  · Nav bar (desktop + mobile)
  · Sidebar (admin, active + inactive states)
  · Pagination component
  · Toggle component (on / off)
  · Tag chip (with × button)

- Use auto layout for all components
- Apply brand colors and typography consistently
- All text in Vietnamese