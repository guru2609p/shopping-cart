using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Shopping_cart.Server.Models;
using System;

namespace Shopping_cart.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserItemsController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public UserItemsController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // POST: api/UserItems
        [Authorize(Roles = "user")]
        [HttpPost]
        public IActionResult AddRegisteredUser(UserItems userItems)
        {
            string connectionString =
                _configuration.GetConnectionString("DatabaseConnection");

            using SqlConnection connection =
                new SqlConnection(connectionString);

            connection.Open();

            string sql = @"
        INSERT INTO user_items
        (
            email,
            first_name,
            last_name,
            cart_items
        )
        VALUES
        (
            @email,
            @first_name,
            @last_name,
            @cart_items
        )";

            using SqlCommand command =
                new SqlCommand(sql, connection);

            command.Parameters.AddWithValue(
                "@email",
                userItems.email
            );

            command.Parameters.AddWithValue(
                "@first_name",
                userItems.first_name
            );

            command.Parameters.AddWithValue(
                "@last_name",
                userItems.last_name
            );

            command.Parameters.AddWithValue(
                "@cart_items",
                userItems.cart_items
            );

            command.ExecuteNonQuery();

            return Ok(userItems);
        }
    }
}
