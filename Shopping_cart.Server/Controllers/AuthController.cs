using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Shopping_cart.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel login)
        {
            if (login == null || string.IsNullOrEmpty(login.Username) || string.IsNullOrEmpty(login.Password))
            {
                return BadRequest("Email and password are required.");
            }

            string connectionString = _configuration.GetConnectionString("DatabaseConnection");

            string firstName = "";
            string lastName = "";
            string userRole = "";
            bool userExists = false;

            // Connect to your database to find the user
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                // Querying your existing registration table
                // Replacing "user_password" with your actual database column name if it is different!
                string sql = "SELECT first_name, last_name,user_role FROM registered_users WHERE email = @email AND user_password = @password";

                using (SqlCommand command = new SqlCommand(sql, connection))
                {
                    command.Parameters.Add("@email", System.Data.SqlDbType.NVarChar, 256).Value = login.Username;
                    command.Parameters.Add("@password", System.Data.SqlDbType.NVarChar, 256).Value = login.Password;

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            userExists = true;
                            firstName = reader["first_name"].ToString();
                            lastName = reader["last_name"].ToString();
                            userRole = reader["user_role"].ToString();
                        }
                    }
                }
            }

            if (userExists)
            {
                // Generate the secure token
                var token = GenerateJwtToken(login.Username, userRole);

                // Return the token AND the user's name so your React frontend can display "Hi, FirstName"
                return Ok(new
                {
                    token = token,
                    firstName = firstName,
                    lastName = lastName,
                    userRole = userRole
                });
            }

            return Unauthorized("Invalid email or password.");
        }

        private string GenerateJwtToken(string username, string userRole)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, userRole),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class LoginModel
    {
        public string Username { get; set; } // This receives the user's email
        public string Password { get; set; }
    }
}
