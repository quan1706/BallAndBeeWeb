# 🐝 BallAndBeeWEB E-Commerce Platform 🏀

Chào mừng bạn đến với **BallAndBeeWEB**, nền tảng trưng bày và lưu trữ danh mục sản phẩm trực tuyến cao cấp dành cho thương hiệu Ball & Bee. Dự án được phát triển theo kiến trúc **Monorepo** hiện đại, kết hợp sức mạnh của **Frontend (Next.js 15)** và sự ổn định của **Backend (.NET 8)**.

Tài liệu này sẽ hướng dẫn bạn chi tiết từng bước để cài đặt môi trường, cấu hình và khởi chạy toàn bộ dự án từ A-Z một cách mượt mà nhất.

---

## 📁 Cấu trúc dự án (Monorepo)

```text
BallAndBeeWEB/
├── frontend/           # Next.js 15 (App Router), React 19, Tailwind CSS v4, Zustand & React Query
├── backend/            # Minimal API C# .NET 8, Entity Framework Core (EF Core)
├── pnpm-workspace.yaml # Cấu hình không gian làm việc của pnpm (Monorepo)
└── package.json        # Chứa scripts chạy tổng hợp từ thư mục gốc
```

---

## ⚙️ Yêu cầu môi trường (Prerequisites)

Trước khi bắt đầu, hãy chuẩn bị sẵn các công cụ sau trên máy tính của bạn:

1. **Node.js**: Phiên bản ổn định mới nhất (Khuyên dùng **v20.x** trở lên).
2. **.NET 8 SDK**: Bộ công cụ phát triển dành cho Backend C#. [Tải tại đây](https://dotnet.microsoft.com/download/dotnet/8.0).
3. **PostgreSQL**: Hệ quản trị cơ sở dữ liệu quan hệ (dành cho Database của API).

---

## 🚀 Hướng dẫn khởi chạy chi tiết

> [!IMPORTANT]
> ### 🛠 KHẮC PHỤC LỖI KHÔNG NHẬN DIỆN `pnpm`
> Nếu bạn gặp lỗi:
> `pnpm : The term 'pnpm' is not recognized as the name of a cmdlet, function...`
> 
> **Cách xử lý:**
> 1. Đảm bảo bạn đã cài đặt Node.js.
> 2. Mở **PowerShell/Terminal** với quyền Administrator và cài đặt `pnpm` toàn cục bằng lệnh:
>    ```bash
>    npm install -g pnpm
>    ```
> 3. Nếu vẫn gặp lỗi chính sách bảo mật (Execution Policy) trên Windows, hãy chạy lệnh sau:
>    ```powershell
>    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
>    ```
> 4. Khởi động lại VS Code hoặc Terminal của bạn để áp dụng thay đổi.

---

### Cách 1: Sử dụng `pnpm` (Khuyên dùng - Chuẩn Monorepo)

Cách này giúp quản lý thư viện của dự án tập trung, tối ưu dung lượng đĩa và liên kết tốt giữa các gói.

#### **Bước 1: Cài đặt gói thư viện (Dependencies)**
Tại thư mục gốc (`BallAndBeeWEB/`), mở Terminal và chạy:
```bash
pnpm install
```
*Lệnh này sẽ tự động phân tích và cài đặt toàn bộ thư viện cho dự án dựa trên `pnpm-workspace.yaml`.*

#### **Bước 2: Khởi chạy Frontend**
Chạy trực tiếp ứng dụng Next.js từ thư mục gốc:
```bash
pnpm run dev:frontend
```
*Hoặc bạn có thể đi vào thư mục frontend và chạy:*
```bash
cd frontend
pnpm dev
```
👉 Mở trình duyệt và truy cập: [http://localhost:3000](http://localhost:3000)

#### **Bước 3: Khởi chạy Backend API**
Mở một cửa sổ Terminal mới, di chuyển vào thư mục `backend` và chạy lệnh:
```bash
cd backend
dotnet run
```
👉 Xem tài liệu API (Swagger UI): [http://localhost:5241/swagger](http://localhost:5241/swagger) (Cổng mặc định có thể thay đổi tùy thuộc vào cấu hình `launchSettings.json`).
👉 Endpoint kiểm tra trạng thái: [http://localhost:5241/api/health](http://localhost:5241/api/health)

---

### Cách 2: Sử dụng `npm` truyền thống (Phương án thay thế nhanh)

Nếu bạn chưa muốn cấu hình `pnpm` trên hệ thống, bạn hoàn toàn có thể khởi chạy Frontend một cách độc lập bằng `npm` thông thường.

#### **Bước 1: Cài đặt và khởi chạy Frontend bằng npm**
Mở Terminal, di chuyển thẳng vào thư mục `frontend` và cài đặt gói:
```bash
cd frontend
npm install
```
Sau khi cài đặt xong, chạy máy chủ phát triển (Dev server):
```bash
npm run dev
```
👉 Truy cập giao diện tại: [http://localhost:3000](http://localhost:3000)

#### **Bước 2: Chạy Backend**
Giữ nguyên phương thức khởi chạy thông qua .NET CLI chuẩn:
```bash
cd backend
dotnet run
```

---

## 🛠 Hướng dẫn cho Nhà phát triển (Developer Guide)

### 🎨 1. Hệ thống thiết kế & Giao diện (Frontend Design)
* **Tailwind CSS v4**: Được cấu hình tích hợp sẵn trong `@tailwindcss/postcss`. File styles chính nằm tại [frontend/src/app/globals.css](file:///d:/DuAnCaNhan/BallAndBeeWEB/frontend/src/app/globals.css).
* **Bảng màu cốt lõi**:
  * `Primary (Độ sâu)`: `#030213` (Nền đen huyền bí, cao cấp)
  * `Secondary (Tinh tế)`: `oklch(0.95 0.0058 264.53)` (Trắng ngà sang trọng)
  * `Muted`: `#ececf0`
* **Hiệu ứng**: Tập trung vào Glassmorphism (độ mờ kính), hiệu ứng Hover mượt mà sử dụng **Framer Motion (`motion`)**.

### 🔄 2. Chuyển đổi mã nguồn cũ (Legacy Migration)
* Giao diện cũ viết bằng React Router hiện được lưu tại [frontend/src/legacy_react_app](file:///d:/DuAnCaNhan/BallAndBeeWEB/frontend/src/legacy_react_app).
* Khi xây dựng tính năng mới, hãy tham chiếu code cũ tại đây và chuyển dịch dần sang cấu trúc Next.js App Router nằm trong [frontend/src/app](file:///d:/DuAnCaNhan/BallAndBeeWEB/frontend/src/app) để tối ưu SEO và Server-Side Rendering (SSR).

### 💾 3. Quản lý trạng thái (State Management)
* **Client State (Giao diện local)**: Sử dụng `zustand` cho các tác vụ như bật/tắt Drawer, chế độ lọc nhanh, Dark Mode...
* **Server State (Dữ liệu từ API)**: Sử dụng `@tanstack/react-query` để lấy, cache và đồng bộ dữ liệu sản phẩm, danh mục sản phẩm từ Backend API .NET 8. *Tránh lạm dụng Zustand lưu dữ liệu Server*.

### 🖥️ 4. Kết nối Database PostgreSQL (Backend)
Khi tích hợp kết nối dữ liệu thật:
1. Cập nhật `ConnectionStrings` của PostgreSQL trong `appsettings.json` (hoặc `appsettings.Development.json` ở thư mục `backend`).
2. Mở Terminal tại `backend/` và thực hiện Migrations:
   ```bash
   dotnet ef database update
   ```

---

> [!TIP]
> **Chúc bạn có những trải nghiệm lập trình tuyệt vời cùng Ball & Bee!** Nếu gặp bất kỳ khó khăn nào trong quá trình cài đặt hay chạy dự án, hãy thảo luận trực tiếp với Agent `tamquan` để được hỗ trợ gỡ lỗi nhanh nhất.
