using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BallAndBeeWEB.Api.Migrations
{
    /// <inheritdoc />
    public partial class RenameTablesToSnakeCase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Categories_Categories_ParentId",
                table: "Categories");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Categories_CategoryId",
                table: "Products");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Products",
                table: "Products");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Categories",
                table: "Categories");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SystemSettings",
                table: "SystemSettings");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ContactMessages",
                table: "ContactMessages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_BlogPosts",
                table: "BlogPosts");

            migrationBuilder.RenameTable(
                name: "Products",
                newName: "products");

            migrationBuilder.RenameTable(
                name: "Categories",
                newName: "categories");

            migrationBuilder.RenameTable(
                name: "SystemSettings",
                newName: "system_settings");

            migrationBuilder.RenameTable(
                name: "ContactMessages",
                newName: "contact_messages");

            migrationBuilder.RenameTable(
                name: "BlogPosts",
                newName: "blog_posts");

            migrationBuilder.RenameIndex(
                name: "IX_Products_Slug",
                table: "products",
                newName: "IX_products_Slug");

            migrationBuilder.RenameIndex(
                name: "IX_Products_CategoryId",
                table: "products",
                newName: "IX_products_CategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_Categories_Slug",
                table: "categories",
                newName: "IX_categories_Slug");

            migrationBuilder.RenameIndex(
                name: "IX_Categories_ParentId",
                table: "categories",
                newName: "IX_categories_ParentId");

            migrationBuilder.RenameIndex(
                name: "IX_BlogPosts_Slug",
                table: "blog_posts",
                newName: "IX_blog_posts_Slug");

            migrationBuilder.AddPrimaryKey(
                name: "PK_products",
                table: "products",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_categories",
                table: "categories",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_system_settings",
                table: "system_settings",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_contact_messages",
                table: "contact_messages",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_blog_posts",
                table: "blog_posts",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_categories_categories_ParentId",
                table: "categories",
                column: "ParentId",
                principalTable: "categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_products_categories_CategoryId",
                table: "products",
                column: "CategoryId",
                principalTable: "categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_categories_categories_ParentId",
                table: "categories");

            migrationBuilder.DropForeignKey(
                name: "FK_products_categories_CategoryId",
                table: "products");

            migrationBuilder.DropPrimaryKey(
                name: "PK_products",
                table: "products");

            migrationBuilder.DropPrimaryKey(
                name: "PK_categories",
                table: "categories");

            migrationBuilder.DropPrimaryKey(
                name: "PK_system_settings",
                table: "system_settings");

            migrationBuilder.DropPrimaryKey(
                name: "PK_contact_messages",
                table: "contact_messages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_blog_posts",
                table: "blog_posts");

            migrationBuilder.RenameTable(
                name: "products",
                newName: "Products");

            migrationBuilder.RenameTable(
                name: "categories",
                newName: "Categories");

            migrationBuilder.RenameTable(
                name: "system_settings",
                newName: "SystemSettings");

            migrationBuilder.RenameTable(
                name: "contact_messages",
                newName: "ContactMessages");

            migrationBuilder.RenameTable(
                name: "blog_posts",
                newName: "BlogPosts");

            migrationBuilder.RenameIndex(
                name: "IX_products_Slug",
                table: "Products",
                newName: "IX_Products_Slug");

            migrationBuilder.RenameIndex(
                name: "IX_products_CategoryId",
                table: "Products",
                newName: "IX_Products_CategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_categories_Slug",
                table: "Categories",
                newName: "IX_Categories_Slug");

            migrationBuilder.RenameIndex(
                name: "IX_categories_ParentId",
                table: "Categories",
                newName: "IX_Categories_ParentId");

            migrationBuilder.RenameIndex(
                name: "IX_blog_posts_Slug",
                table: "BlogPosts",
                newName: "IX_BlogPosts_Slug");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Products",
                table: "Products",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Categories",
                table: "Categories",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SystemSettings",
                table: "SystemSettings",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ContactMessages",
                table: "ContactMessages",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_BlogPosts",
                table: "BlogPosts",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Categories_Categories_ParentId",
                table: "Categories",
                column: "ParentId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Categories_CategoryId",
                table: "Products",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
