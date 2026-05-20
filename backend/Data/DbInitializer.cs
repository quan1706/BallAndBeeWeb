using BallAndBeeWEB.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BallAndBeeWEB.Api.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AppDbContext context)
        {
            // Auto migrate database
            context.Database.Migrate();

            // Seed SystemSettings if empty
            if (!context.SystemSettings.Any())
            {
                SeedSystemSettings(context);
            }

            // Seed Categories if empty
            if (!context.Categories.Any())
            {
                SeedCategories(context);
            }

            // Seed Products if empty
            if (!context.Products.Any())
            {
                SeedProducts(context);
            }

            // Seed BlogPosts if empty
            if (!context.BlogPosts.Any())
            {
                SeedBlogPosts(context);
            }
        }

        private static void SeedCategories(AppDbContext context)
        {
            // 1. Seed Level 1 (Root Categories)
            var rootCategories = new List<Category>
            {
                new Category { Name = "Nội thất", Slug = "noi-that", Color = "#C8954A", ParentId = null },
                new Category { Name = "Lighting", Slug = "lighting", Color = "#1E3A5F", ParentId = null },
                new Category { Name = "Trang trí", Slug = "trang-tri", Color = "#E07B54", ParentId = null },
                new Category { Name = "Kitchen & Dining", Slug = "kitchen-dining", Color = "#88B04B", ParentId = null },
                new Category { Name = "Souvenir", Slug = "souvenir", Color = "#6B7DB3", ParentId = null },
                new Category { Name = "Đạo cụ chụp hình", Slug = "dao-cu-chup-hinh", Color = "#D4956A", ParentId = null }
            };

            context.Categories.AddRange(rootCategories);
            context.SaveChanges();

            // Get root category references
            var noiThat = rootCategories.First(c => c.Slug == "noi-that");
            var lighting = rootCategories.First(c => c.Slug == "lighting");
            var trangTri = rootCategories.First(c => c.Slug == "trang-tri");
            var kitchenDining = rootCategories.First(c => c.Slug == "kitchen-dining");

            // 2. Seed Level 2 Categories
            var level2Categories = new List<Category>
            {
                // Under Nội thất
                new Category { Name = "Nội thất trong nhà", Slug = "noi-that-trong-nha", ParentId = noiThat.Id },
                new Category { Name = "Nội thất trẻ em", Slug = "noi-that-tre-em", ParentId = noiThat.Id },
                new Category { Name = "Nội thất ngoài trời", Slug = "noi-that-ngoai-troi", ParentId = noiThat.Id },

                // Under Lighting
                new Category { Name = "Đèn treo", Slug = "den-treo", ParentId = lighting.Id },
                new Category { Name = "Đèn bàn", Slug = "den-ban", ParentId = lighting.Id },

                // Under Trang trí
                new Category { Name = "Tranh treo tường", Slug = "tranh-treo-tuong", ParentId = trangTri.Id },

                // Under Kitchen & Dining
                new Category { Name = "Tableware", Slug = "tableware", ParentId = kitchenDining.Id },
                new Category { Name = "Serveware", Slug = "serveware", ParentId = kitchenDining.Id },
                new Category { Name = "Drinkware", Slug = "drinkware", ParentId = kitchenDining.Id }
            };

            context.Categories.AddRange(level2Categories);
            context.SaveChanges();

            // Get level 2 references
            var noiThatTrongNha = level2Categories.First(c => c.Slug == "noi-that-trong-nha");
            var tableware = level2Categories.First(c => c.Slug == "tableware");

            // 3. Seed Level 3 Categories
            var level3Categories = new List<Category>
            {
                // Under Nội thất trong nhà
                new Category { Name = "Sofa & Armchair", Slug = "sofa-armchair", ParentId = noiThatTrongNha.Id },
                new Category { Name = "Bàn trà & Bàn góc", Slug = "ban-tra-ban-goc", ParentId = noiThatTrongNha.Id },
                new Category { Name = "Kệ tivi & Tủ trang trí", Slug = "ke-tivi-tu-trang-tri", ParentId = noiThatTrongNha.Id },

                // Under Tableware
                new Category { Name = "Bát đĩa sứ vẽ tay", Slug = "bat-dia-su-ve-tay", ParentId = tableware.Id },
                new Category { Name = "Bát đĩa gốm mộc", Slug = "bat-dia-gom-moc", ParentId = tableware.Id }
            };

            context.Categories.AddRange(level3Categories);
            context.SaveChanges();
        }

        private static void SeedProducts(AppDbContext context)
        {
            var categories = context.Categories.ToList();

            var noiThatTrongNha = categories.First(c => c.Slug == "noi-that-trong-nha");
            var denTreo = categories.First(c => c.Slug == "den-treo");
            var denBan = categories.First(c => c.Slug == "den-ban");
            var tranhTeng = categories.First(c => c.Slug == "tranh-treo-tuong");
            var tableware = categories.First(c => c.Slug == "tableware");

            var products = new List<Product>
            {
                new Product
                {
                    Name = "Bàn gỗ me tây",
                    Slug = "ban-go-me-tay",
                    Price = 650000,
                    Description = "Bàn gỗ me tây tự nhiên chân gỗ tinh tế, đan xen nét thô mộc và hiện đại.",
                    Material = "Gỗ sồi",
                    Size = "80cm x 80cm x 75cm",
                    Origin = "Việt Nam",
                    Tags = new List<string> { "eco", "handmade", "minimalist" },
                    Featured = true,
                    IsNew = true,
                    Visible = true,
                    Image = "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800",
                    CategoryId = noiThatTrongNha.Id
                },
                new Product
                {
                    Name = "Đèn treo tre đan",
                    Slug = "den-treo-tre-dan",
                    Price = 350000,
                    Description = "Đèn treo làm hoàn toàn từ tre tự nhiên đan thủ công tỉ mỉ, mang lại ánh sáng vàng ấm cúng.",
                    Material = "Tre tự nhiên",
                    Size = "30cm x 40cm",
                    Origin = "Việt Nam",
                    Tags = new List<string> { "bamboo", "handmade", "eco" },
                    Featured = true,
                    IsNew = true,
                    Visible = true,
                    Image = "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800",
                    CategoryId = denTreo.Id
                },
                new Product
                {
                    Name = "Tranh treo tường",
                    Slug = "tranh-treo-tuong",
                    Price = 450000,
                    Description = "Tranh nghệ thuật trừu tượng phong cách Bắc Âu tối giản, in canvas chất lượng cao kèm khung gỗ mộc.",
                    Material = "Canvas & Khung gỗ thông",
                    Size = "50cm x 70cm",
                    Origin = "Việt Nam",
                    Tags = new List<string> { "minimalist", "handmade" },
                    Featured = false,
                    IsNew = true,
                    Visible = true,
                    Image = "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800",
                    CategoryId = tranhTeng.Id
                },
                new Product
                {
                    Name = "Đèn bàn hiện đại B&B",
                    Slug = "den-ban-hien-dai",
                    Price = 1250000,
                    Description = "Đèn bàn thiết kế hiện đại, khung gỗ tự nhiên kết hợp chao đèn vải linen cao cấp.",
                    Material = "Gỗ sồi & Vải Linen",
                    Size = "35cm x 15cm",
                    Origin = "Việt Nam",
                    Tags = new List<string> { "minimalist", "handmade" },
                    Featured = true,
                    IsNew = true,
                    Visible = true,
                    Image = "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800",
                    CategoryId = denBan.Id
                },
                new Product
                {
                    Name = "Ghế sofa đơn Scandinavia",
                    Slug = "ghe-sofa-2-cho",
                    Price = 3450000,
                    Description = "Ghế sofa đơn phong cách Scandinavia tinh tế, đệm mút chống lún bọc vải nỉ cừu cao cấp chân gỗ tự nhiên.",
                    Material = "Vải nỉ cừu & Chân gỗ sồi",
                    Size = "85cm x 80cm x 85cm",
                    Origin = "Việt Nam",
                    Tags = new List<string> { "vintage", "handmade", "minimalist" },
                    Featured = true,
                    IsNew = false,
                    Visible = true,
                    Image = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
                    CategoryId = noiThatTrongNha.Id
                },
                new Product
                {
                    Name = "Đĩa gốm mộc sâu lòng",
                    Slug = "dia-gom-moc-tron",
                    Price = 180000,
                    Description = "Đĩa gốm mộc chất liệu bán sứ chịu nhiệt cao, tráng men thô mộc mạc.",
                    Material = "Gốm thô mộc",
                    Size = "Đường kính 22cm",
                    Origin = "Bình Dương, Việt Nam",
                    Tags = new List<string> { "ceramic", "tableware", "handmade" },
                    Featured = false,
                    IsNew = false,
                    Visible = true,
                    Image = "https://images.unsplash.com/photo-1589987607627-616cad1a14e4?w=800",
                    CategoryId = tableware.Id
                },
                new Product
                {
                    Name = "Kệ sách mini gỗ thông mộc",
                    Slug = "ke-sach-mini-go-thong",
                    Price = 580000,
                    Description = "Kệ sách để bàn mini nhiều ngăn thông minh làm bằng gỗ thông sấy tự nhiên chà nhám mịn, có phủ bóng nhẹ.",
                    Material = "Gỗ thông tự nhiên",
                    Size = "45cm x 20cm x 35cm",
                    Origin = "Việt Nam",
                    Tags = new List<string> { "minimalist", "handmade", "eco" },
                    Featured = true,
                    IsNew = true,
                    Visible = true,
                    Image = "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800",
                    CategoryId = noiThatTrongNha.Id
                }
            };

            context.Products.AddRange(products);
            context.SaveChanges();
        }

        private static void SeedBlogPosts(AppDbContext context)
        {
            var blogPosts = new List<BlogPost>
            {
                new BlogPost
                {
                    Title = "Cách bày trí phòng khách phong cách tối giản",
                    Slug = "cach-bay-tri-phong-khach-phong-cach-toi-gian",
                    Topic = "Hướng dẫn bày trí",
                    TopicSlug = "huong-dan-bay-tri",
                    Excerpt = "Khám phá cách tạo không gian phòng khách thoáng đãng, tinh tế với phong cách tối giản hiện đại.",
                    Content = "<p>Nội dung chi tiết về cách bày trí phòng khách phong cách tối giản: Từ việc lựa chọn ghế sofa đơn màu ấm áp, sắp đặt ánh sáng tự nhiên cho đến việc bố trí bàn trà và kệ tivi gỗ mộc mạc...</p>",
                    Date = DateTime.SpecifyKind(DateTime.Parse("2026-05-10"), DateTimeKind.Utc),
                    ReadTime = "5 phút đọc",
                    Image = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
                    Featured = true,
                    Status = "published"
                },
                new BlogPost
                {
                    Title = "10 món đồ trang trí không thể thiếu trong nhà",
                    Slug = "10-mon-do-trang-tri-khong-the-thieu-trong-nha",
                    Topic = "Phong cách sống",
                    TopicSlug = "phong-cach-song",
                    Excerpt = "Những món đồ trang trí thiết yếu giúp ngôi nhà của bạn trở nên ấm cúng và đầy cá tính hơn.",
                    Content = "<p>Nội dung chi tiết về những món đồ trang trí giúp căn nhà trở nên tràn đầy sinh khí như: gối tựa sofa thổ cẩm, bình hoa gốm mộc cắm hoa khô, đèn bàn chao vải ấm cúng, và tranh vẽ trừu tượng...</p>",
                    Date = DateTime.SpecifyKind(DateTime.Parse("2026-05-08"), DateTimeKind.Utc),
                    ReadTime = "7 phút đọc",
                    Image = "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=800",
                    Featured = false,
                    Status = "published"
                },
                new BlogPost
                {
                    Title = "Xu hướng nội thất 2026",
                    Slug = "xu-huong-noi-that-2026",
                    Topic = "Tin tức",
                    TopicSlug = "tin-tuc",
                    Excerpt = "Cập nhật những xu hướng nội thất mới nhất năm 2026 từ các chuyên gia thiết kế hàng đầu.",
                    Content = "<p>Năm 2026 đánh dấu sự lên ngôi của các sản phẩm nội thất organic tự nhiên như gỗ sồi, tre đan, gốm sứ mộc mạc kết hợp cùng các tông màu đất trầm ấm áp...</p>",
                    Date = DateTime.SpecifyKind(DateTime.Parse("2026-05-15"), DateTimeKind.Utc),
                    ReadTime = "6 phút đọc",
                    Image = "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800",
                    Featured = true,
                    Status = "published"
                }
            };

            context.BlogPosts.AddRange(blogPosts);
            context.SaveChanges();
        }

        private static void SeedSystemSettings(AppDbContext context)
        {
            var setting = new SystemSetting
            {
                Name = "BALLANDBEEHOME",
                Tagline = "Không gian sống - Tinh tế từng chi tiết",
                Description = "Chúng tôi tạo ra những sản phẩm nội thất và trang trí độc đáo, mang đậm phong cách Việt hiện đại.",
                Phone = "0901 234 567",
                Zalo = "0901 234 567",
                Email = "hello@ballandbeehome.com",
                Address = "123 Nguyễn Văn Linh, Đà Nẵng",
                Hours = "Thứ 2–7, 8:00–18:00",
                Facebook = "https://facebook.com/ballandbeehome",
                Instagram = "https://instagram.com/ballandbeehome",
                Tiktok = "https://tiktok.com/@ballandbeehome",
                GoogleMapsEmbed = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.8983128073786!2d108.21992687589745!3d16.072661884621964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219c8b5cf238f%3A0x69a4f8e9eae7ec0f!2zxJDDoCBO4bq1bmcsIFZp4buHdCBOYW0!5e0!3m2!1sen!2s!4v1699999999999!5m2!1sen!2s"
            };

            context.SystemSettings.Add(setting);
            context.SaveChanges();
        }
    }
}
