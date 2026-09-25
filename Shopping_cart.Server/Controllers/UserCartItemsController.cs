using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Shopping_cart.Server.Models;
using System;

namespace Shopping_cart.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserCartItemsController:ControllerBase
    {
        private readonly IConfiguration _configuration;

        public UserCartItemsController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // GET: api/UserCartItems
        [HttpGet]
        public IActionResult GetUserCartItems()
        {
            List<UserCartItems> userCartItems = new List<UserCartItems>();
            string connectionString = _configuration.GetConnectionString("DatabaseConnection");

            using SqlConnection connection = new SqlConnection(connectionString);
            connection.Open();

            string sql = @"
                SELECT
                    *
                FROM user_cart_items";

            using SqlCommand command = new SqlCommand(sql, connection);
            using SqlDataReader reader = command.ExecuteReader();

            while (reader.Read())
            {
                userCartItems.Add(new UserCartItems
                {
                    item_id = Convert.ToInt32(reader["item_id"]),
                    email = reader["email"].ToString()!,
                    item_name = reader["item_name"].ToString()!,
                    item_price = Convert.ToDecimal(reader["item_price"]),
                    item_quantity = Convert.ToInt32(reader["item_quantity"]),
                });
            }

            return Ok(userCartItems);
        }

        // POST: api/UserCartItems
        [Authorize(Roles = "user")]
        [HttpPost]
        public IActionResult AddUserCartItems(UserCartItems userCartItems)
        {
            string connectionString =
                _configuration.GetConnectionString("DatabaseConnection");

            using SqlConnection connection =
                new SqlConnection(connectionString);

            connection.Open();

            // Check whether this product already exists
            string checkSql = @"
        SELECT item_id
        FROM user_cart_items
        WHERE email = @email
        AND item_name = @item_name;
    ";

            using SqlCommand checkCommand =
                new SqlCommand(checkSql, connection);

            checkCommand.Parameters.Add("@email", System.Data.SqlDbType.VarChar, 256)
                .Value = userCartItems.email;

            checkCommand.Parameters.Add("@item_name", System.Data.SqlDbType.VarChar, 256)
                .Value = userCartItems.item_name;

            object? existingId = checkCommand.ExecuteScalar();


            // Product already exists → increase quantity
            if (existingId != null)
            {
                string updateSql = @"
            UPDATE user_cart_items
            SET item_quantity = item_quantity + @item_quantity
            WHERE item_id = @item_id;
        ";

                using SqlCommand updateCommand =
                    new SqlCommand(updateSql, connection);

                updateCommand.Parameters.Add("@item_id", System.Data.SqlDbType.Int)
                    .Value = Convert.ToInt32(existingId);

                updateCommand.Parameters.Add("@item_quantity", System.Data.SqlDbType.Int)
                    .Value = userCartItems.item_quantity;

                updateCommand.ExecuteNonQuery();

                return Ok(new
                {
                    message = "Existing cart item quantity increased",
                    item_id = Convert.ToInt32(existingId)
                });
            }


            // Product doesn't exist → create new row
            string insertSql = @"
        INSERT INTO user_cart_items
        (
            email,
            item_name,
            item_price,
            item_quantity
        )
        VALUES
        (
            @email,
            @item_name,
            @item_price,
            @item_quantity
        );

        SELECT SCOPE_IDENTITY();
    ";

            using SqlCommand insertCommand =
                new SqlCommand(insertSql, connection);

            insertCommand.Parameters.Add("@email", System.Data.SqlDbType.VarChar, 256)
                .Value = userCartItems.email;

            insertCommand.Parameters.Add("@item_name", System.Data.SqlDbType.VarChar, 256)
                .Value = userCartItems.item_name;

            insertCommand.Parameters.Add("@item_price", System.Data.SqlDbType.Decimal)
                .Value = userCartItems.item_price;

            insertCommand.Parameters.Add("@item_quantity", System.Data.SqlDbType.Int)
                .Value = userCartItems.item_quantity;

            int newId = Convert.ToInt32(insertCommand.ExecuteScalar());

            return Ok(new
            {
                item_id = newId,
                email = userCartItems.email,
                item_name = userCartItems.item_name,
                item_price = userCartItems.item_price,
                item_quantity = userCartItems.item_quantity
            });
        }

        /*
        // POST: api/UserCartItems
        [Authorize(Roles = "user")]
        [HttpPost]
        public IActionResult AddUserCartItems(UserCartItems userCartItems)
        {
            string connectionString =
                _configuration.GetConnectionString("DatabaseConnection");

            using SqlConnection connection =
                new SqlConnection(connectionString);

            connection.Open();

            // Check whether this product already exists
            string checkSql = @"
        SELECT item_id
        FROM user_cart_items
        WHERE email = @email
        AND item_name = @item_name;
    ";

            using SqlCommand checkCommand =
                new SqlCommand(checkSql, connection);

            checkCommand.Parameters.Add("@email", System.Data.SqlDbType.VarChar, 256)
                .Value = userCartItems.email;

            checkCommand.Parameters.Add("@item_name", System.Data.SqlDbType.VarChar, 256)
                .Value = userCartItems.item_name;

            object? existingId = checkCommand.ExecuteScalar();


            // Product already exists → increase quantity
            if (existingId != null)
            {
                string updateSql = @"
            UPDATE user_cart_items
            SET item_quantity = item_quantity + 1
            WHERE item_id = @item_id;
        ";

                using SqlCommand updateCommand =
                    new SqlCommand(updateSql, connection);

                updateCommand.Parameters.Add("@item_id", System.Data.SqlDbType.Int)
                    .Value = Convert.ToInt32(existingId);

                updateCommand.ExecuteNonQuery();

                return Ok(new
                {
                    message = "Existing cart item quantity increased",
                    item_id = Convert.ToInt32(existingId)
                });
            }

            string sql = @"
        INSERT INTO user_cart_items
        (
            email,
            item_name,
            item_price,
            item_quantity
        )
        VALUES
        (
            @email,
            @item_name,
            @item_price,
            @item_quantity
        )";

            using SqlCommand command =
                new SqlCommand(sql, connection);


            command.Parameters.Add("@email", System.Data.SqlDbType.VarChar, 256).Value = (object)userCartItems.email ?? DBNull.Value;
            command.Parameters.Add("@item_name", System.Data.SqlDbType.VarChar, 256).Value = (object)userCartItems.item_name ?? DBNull.Value;
            command.Parameters.Add("@item_price", System.Data.SqlDbType.Decimal, 100).Value = (object)userCartItems.item_price ?? DBNull.Value;
            command.Parameters.Add("@item_quantity", System.Data.SqlDbType.Int, 100).Value = (object)userCartItems.item_quantity ?? DBNull.Value;
            

            command.ExecuteNonQuery();

            return Ok(userCartItems);
        }
        */

        // PUT: api/UserCartItems/update/25?number=1
        [Authorize(Roles = "user")]
        [HttpPut("update/{id}")]
        public IActionResult UpdateUserCartItem(
            int id,
            int number,
            [FromBody] UserCartItems userCartItems)
        {
            string connectionString =
                _configuration.GetConnectionString("DatabaseConnection");

            using SqlConnection connection =
                new SqlConnection(connectionString);

            connection.Open();

            string sql = @"
        UPDATE user_cart_items
        SET item_quantity = item_quantity + @number
        WHERE item_id = @item_id
        AND email = @email;
    ";

            using SqlCommand command =
                new SqlCommand(sql, connection);

            command.Parameters.Add("@number", System.Data.SqlDbType.Int)
                .Value = number;

            command.Parameters.Add("@item_id", System.Data.SqlDbType.Int)
                .Value = id;

            command.Parameters.Add("@email", System.Data.SqlDbType.VarChar, 256)
                .Value = userCartItems.email;

            int rowsAffected = command.ExecuteNonQuery();

            if (rowsAffected == 0)
            {
                return NotFound("Cart item not found.");
            }

            return Ok(new
            {
                item_id = id,
                email = userCartItems.email,
                change = number
            });
        }

        // DELETE: api/UserCartItems/25
        [Authorize(Roles = "user")]
        [HttpDelete("{id}")]
        public IActionResult DeleteUserCartItem(int id, [FromQuery] string email)
        {
            string connectionString =
                _configuration.GetConnectionString("DatabaseConnection");

            using SqlConnection connection =
                new SqlConnection(connectionString);

            connection.Open();

            string sql = @"
        DELETE FROM user_cart_items
        WHERE item_id = @item_id
        AND email = @email;
    ";

            using SqlCommand command =
                new SqlCommand(sql, connection);

            command.Parameters.Add("@item_id", System.Data.SqlDbType.Int)
                .Value = id;

            command.Parameters.Add("@email", System.Data.SqlDbType.VarChar, 256)
                .Value = email;

            int rowsAffected = command.ExecuteNonQuery();

            if (rowsAffected == 0)
            {
                return NotFound("Cart item not found.");
            }

            return Ok(new
            {
                message = "Cart item removed successfully"
            });
        }

    }
}
