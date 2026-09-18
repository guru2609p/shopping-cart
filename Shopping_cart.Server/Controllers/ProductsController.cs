using Shopping_cart.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Authorization;

namespace Shopping_cart.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ProductsController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // GET: api/Products
        [HttpGet]
        public IActionResult GetProducts()
        {
            List<Products> products = new List<Products>();
            string connectionString = _configuration.GetConnectionString("DatabaseConnection");

            using SqlConnection connection = new SqlConnection(connectionString);
            connection.Open();

            string sql = @"
                SELECT
                    item_id,
                    item_name,
                    item_image,
                    item_description,
                    item_brand,
                    price,
                    category
                FROM products";

            using SqlCommand command = new SqlCommand(sql, connection);
            using SqlDataReader reader = command.ExecuteReader();

            while (reader.Read())
            {
                products.Add(new Products
                {
                    item_id = Convert.ToInt32(reader["item_id"]),
                    item_name = reader["item_name"].ToString()!,
                    item_image = reader["item_image"].ToString()!,
                    item_description = reader["item_description"].ToString()!,
                    item_brand = reader["item_brand"].ToString()!,
                    price= Convert.ToDecimal(reader["price"]),
                    category = reader["category"].ToString()!
                });
            }

            return Ok(products);
        }

        // POST: api/Products
        [Authorize(Roles = "admin")]
        [HttpPost]
        public IActionResult AddProducts([FromBody] Products products)
        {
            if (products == null)
            {
                return BadRequest("Invalid user payload.");
            }

            string connectionString = _configuration.GetConnectionString("DatabaseConnection");

            using SqlConnection connection = new SqlConnection(connectionString);
            connection.Open();
            /*
            // duplicate email check: This addresses the multi-account bug identified in your console log
            string checkSql = "SELECT COUNT(1) FROM products WHERE item_name = @itemNameCheck AND item_brand=@itemBrandCheck";
            using (SqlCommand checkCommand = new SqlCommand(checkSql, connection))
            {
                checkCommand.Parameters.Add("@itemNameCheck", System.Data.SqlDbType.NVarChar, 256).Value = products.item;
                int emailExists = Convert.ToInt32(checkCommand.ExecuteScalar());

                if (emailExists > 0)
                {
                    // Returns 409 Conflict code caught by your "Register.jsx" custom error panel
                    return Conflict("This email address is already registered.");
                }
            }
            */

            string sql = @"
                INSERT INTO products
                (
                    item_name,
                    item_description,
                    item_brand,
                    price,
                    category,
                    item_image
                )
                VALUES
                (
                    @item_name,
                    @item_description,
                    @item_brand,
                    @price,
                    @category,
                    @item_image
                )";

            using SqlCommand command = new SqlCommand(sql, connection);

            command.Parameters.Add("@item_name", System.Data.SqlDbType.VarChar, 256).Value = (object)products.item_name ?? DBNull.Value;
            command.Parameters.Add("@item_description", System.Data.SqlDbType.VarChar, 256).Value = (object)products.item_description ?? DBNull.Value;
            command.Parameters.Add("@item_brand", System.Data.SqlDbType.VarChar, 256).Value = (object)products.item_brand ?? DBNull.Value;
            command.Parameters.Add("@price", System.Data.SqlDbType.Decimal, 100).Value = (object)products.price ?? DBNull.Value;
            command.Parameters.Add("@category", System.Data.SqlDbType.VarChar, 100).Value = (object)products.category ?? DBNull.Value;
            command.Parameters.Add("@item_image", System.Data.SqlDbType.VarChar).Value = (object)products.item_image ?? DBNull.Value;

            command.ExecuteNonQuery();

            return Ok(products);
        }

        // DELETE: api/Products/id
        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public IActionResult DeleteProduct(int id)
        {
            string connectionString = _configuration.GetConnectionString("DatabaseConnection");

            using SqlConnection connection = new SqlConnection(connectionString);
            connection.Open();

            // 1. Check if the product actually exists first
            string checkSql = "SELECT COUNT(1) FROM products WHERE item_id = @id";
            using (SqlCommand checkCommand = new SqlCommand(checkSql, connection))
            {
                checkCommand.Parameters.Add("@id", System.Data.SqlDbType.Int).Value = id;
                int productExists = Convert.ToInt32(checkCommand.ExecuteScalar());

                if (productExists == 0)
                {
                    return NotFound($"Product with ID {id} not found.");
                }
            }

            // 2. Perform the deletion
            string deleteSql = "DELETE FROM products WHERE item_id = @id";
            using (SqlCommand command = new SqlCommand(deleteSql, connection))
            {
                command.Parameters.Add("@id", System.Data.SqlDbType.Int).Value = id;
                command.ExecuteNonQuery();
            }

            return Ok(new { message = $"Product with ID {id} successfully deleted." });
        }
    }
}
