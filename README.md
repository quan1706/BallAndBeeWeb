# 🐝 BallAndBeeWEB E-Commerce Platform 🏀

Chào mừng bạn đến với **BallAndBeeWEB**, nền tảng trưng bày và lưu trữ danh mục sản phẩm trực tuyến cao cấp dành cho thương hiệu Ball & Bee. Dự án được thiết kế theo kiến trúc **Monorepo** hiện đại, tối ưu hóa trải nghiệm khách hàng với các công nghệ cao cấp nhất:
* **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS v4, được triển khai trực tiếp trên nền tảng đám mây **Vercel**.
* **Backend**: ASP.NET Core 8 Web API (Minimal API) thiết kế Clean Code.
* **Database**: PostgreSQL lưu trữ toàn bộ dữ liệu hệ thống trực tuyến trên nền tảng **Supabase**.
* **Image Cloud Storage**: Lưu trữ và tối ưu hóa hình ảnh hiệu năng cao qua **ImageKit Cloud**.

---

## 📁 Cấu trúc dự án (Monorepo)

```text
BallAndBeeWEB/
├── frontend/           # Next.js 15 (App Router), React 19, Tailwind CSS v4, Zustand & React Query
├── backend/            # Minimal API C# .NET 8, Entity Framework Core (EF Core)
├── pnpm-workspace.yaml # Cấu hình không gian làm việc của pnpm (Monorepo)
└── package.json        # Chứa các scripts chạy tổng hợp toàn dự án từ thư mục gốc
```

---

## ⚙️ Yêu cầu môi trường & Tài khoản (Prerequisites)

Trước khi bắt đầu, hãy chuẩn bị sẵn các công cụ và tài khoản dịch vụ sau:

1. **Node.js**: Phiên bản ổn định mới nhất (Khuyên dùng **v20.x** trở lên).
2. **.NET 8 SDK**: Bộ công cụ phát triển C# .NET. [Tải tại đây](https://dotnet.microsoft.com/download/dotnet/8.0).
3. **Tài khoản Supabase**: Đăng ký miễn phí tại [Supabase](https://supabase.com) để khởi tạo PostgreSQL Database.
4. **Tài khoản ImageKit**: Đăng ký tại [ImageKit](https://imagekit.io) để lấy Cloud Storage lưu ảnh.

---

## 🔐 Cấu hình & Bảo mật Dữ liệu (Bắt buộc)

> [!WARNING]
> ### 🛡️ QUY TẮC BẢO MẬT CREDENTIALS
> File `backend/appsettings.json` chứa thông tin nhạy cảm (mật khẩu Supabase thật và PrivateKey ImageKit) đã được tự động thêm vào `.gitignore` để tránh rò rỉ khóa bảo mật lên GitHub public. 
> 
> Tuyệt đối **không** gỡ bỏ quy tắc ignore này.

### Các bước cấu hình cục bộ (Local Settings):
1. Copy file cấu hình mẫu [appsettings.Example.json](file:///d:/DuAnCaNhan/BallAndBeeWEB/backend/appsettings.Example.json) tại thư mục `backend/` và đổi tên thành `appsettings.json`.
2. Mở file `appsettings.json` mới tạo và điền các thông tin thực tế của bạn:
   * **ConnectionStrings**: Thay thế host, username, password bằng chuỗi kết nối PostgreSQL lấy từ dự án Supabase của bạn.
   * **ImageKit**: Điền `UrlEndpoint`, `PublicKey` và `PrivateKey` lấy từ tài khoản ImageKit của bạn.

---

## 🚀 Hướng dẫn khởi chạy chi tiết

> [!IMPORTANT]
> ### 🛠 KHẮC PHỤC LỖI KHÔNG NHẬN DIỆN `pnpm`
> Nếu gặp lỗi: `pnpm : The term 'pnpm' is not recognized as the name of a cmdlet...`
> 
> **Cách xử lý:**
> 1. Chạy Terminal với quyền Administrator và cài đặt `pnpm` toàn cục: `npm install -g pnpm`
> 2. Nếu gặp lỗi chính sách trên Windows, chạy: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
> 3. Khởi động lại VS Code / Terminal để áp dụng.

### Cách 1: Sử dụng `pnpm` (Khuyên dùng - Chuẩn Monorepo)

#### **Bước 1: Cài đặt thư viện tập trung**
Tại thư mục gốc (`BallAndBeeWEB/`), chạy:
```bash
pnpm install
```

#### **Bước 2: Đồng bộ cấu trúc Database lên Supabase**
Mở Terminal tại thư mục `backend/` và thực thi migrations để EF Core tạo toàn bộ các bảng `snake_case` chuẩn hóa trên Supabase:
```bash
cd backend
dotnet ef database update
```
*(Cơ chế DbInitializer sẽ tự động seed dữ liệu cấu hình mặc định tuyệt đẹp vào bảng `system_settings` khi ứng dụng khởi động).*

#### **Bước 3: Chạy ứng dụng Next.js (Frontend)**
Chạy từ thư mục gốc:
```bash
pnpm run dev:frontend
```
👉 Truy cập giao diện: [http://localhost:3000](http://localhost:3000)

#### **Bước 4: Chạy ASP.NET Core API (Backend)**
Mở Terminal mới, di chuyển vào `backend` và chạy:
```bash
cd backend
dotnet run
```
👉 Xem tài liệu API (Swagger UI): [http://localhost:5000/swagger](http://localhost:5000/swagger)
👉 Health Check API: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

### Cách 2: Sử dụng `npm` truyền thống (Chạy Frontend độc lập)

1. **Khởi chạy Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. **Khởi chạy Backend**:
   ```bash
   cd backend
   dotnet run
   ```

---

## ☁️ Hướng dẫn Triển khai chạy thật (Deployment Guide)

### 💻 1. Frontend Next.js (Deploy lên Vercel)
Dự án được cấu hình hoàn toàn tương thích và tối ưu với **Vercel Cloud**:
1. Liên kết repository GitHub của bạn với tài khoản Vercel.
2. Thêm các Biến môi trường (Environment Variables) trong phần Settings của dự án trên Vercel:
   * `NEXT_PUBLIC_API_URL` ➡️ Điền URL của Backend đã deploy (ví dụ: `https://api.ballandbee.com`).
3. Nhấn **Deploy**. Vercel sẽ tự động build và cấp phát URL chạy thật cực kỳ bảo mật cho Next.js 15 App Router.

### 🖥️ 2. Backend Web API (Deploy lên Render / Railway / VPS Docker)
Khi triển khai Backend lên các nền tảng đám mây:
1. Bạn **không cần** và **không nên** đẩy file `appsettings.json` chứa mật khẩu thật lên.
2. Hãy cấu hình trực tiếp các biến môi trường bảo mật (Environment Variables) trong bảng điều khiển của nhà cung cấp hosting (Render/Railway):
   * `ConnectionStrings__DefaultConnection` ➡️ Điền chuỗi kết nối Supabase PostgreSQL thật của bạn.
   * `ImageKit__UrlEndpoint` ➡️ Điền URL Endpoint của ImageKit.
   * `ImageKit__PublicKey` ➡️ Điền Public Key của ImageKit.
   * `ImageKit__PrivateKey` ➡️ Điền Private Key của ImageKit.

---

## 🛠 Hướng dẫn cho Nhà phát triển (Developer Guide)

### 🎨 1. Hệ thống thiết kế & Visuals (UI/UX)
* **Tailwind CSS v4**: Cấu hình inline theme nằm trong file [frontend/src/app/globals.css](file:///d:/DuAnCaNhan/BallAndBeeWEB/frontend/src/app/globals.css).
* **Bảng màu chủ đạo sang trọng**:
  * `Primary`: `#030213` (Nền đen ngọc sâu thẳm, quý phái)
  * `Secondary`: `oklch(0.95 0.0058 264.53)` (Trắng ngà tinh tế)
  * `Accent`: `#C8954A` (Màu vàng ánh kim cao cấp)
* **Chuyển động**: Micro-animations và các hiệu ứng Glassmorphism mượt mà thông qua **Framer Motion (`motion`)**.

### 🔄 2. Chuyển đổi mã nguồn cũ (Legacy Migration)
* Giao diện cũ (React Router) nằm tại [frontend/src/legacy_react_app](file:///d:/DuAnCaNhan/BallAndBeeWEB/frontend/src/legacy_react_app).
* Khi phát triển các trang trưng bày mới, tham chiếu logic tại đây để chuyển đổi sang Next.js App Router nhằm nâng cấp tối đa hiệu năng và SEO.

### 💾 3. Tách biệt Quản lý trạng thái (State Management)
* **Zustand (UI State)**: Chỉ dùng cho các trạng thái giao diện nội bộ (bật/tắt Drawer, bộ lọc tạm thời, modal, Dark mode...).
* **React Query (Server State)**: Bắt buộc dùng cho toàn bộ dữ liệu đồng bộ từ API của Backend (danh mục Categories, danh sách sản phẩm, tin nhắn...). Cơ chế cache thông minh của React Query giúp trải nghiệm tải trang nhanh tức thì.

---

> [!TIP]
> **Chúc bạn có những trải nghiệm phát triển sản phẩm tuyệt vời cùng Ball & Bee!** Nếu có bất kỳ thắc mắc hoặc cần hỗ trợ gỡ lỗi chuyên sâu, hãy tương tác trực tiếp với Agent `tamquan` để cùng pair-programming giải quyết mọi vấn đề nhanh chóng.
