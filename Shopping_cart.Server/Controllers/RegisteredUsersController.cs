using Shopping_cart.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;


namespace Shopping_cart.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegisteredUsersController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public RegisteredUsersController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // POST: api/RegisteredUsers
        [HttpPost]
        // ADDED [FromBody] so ASP.NET Core can read the React fetch body content layout
        public IActionResult AddRegisteredUser([FromBody] RegisteredUsers registeredUsers)
        {
            if (registeredUsers == null)
            {
                return BadRequest("Invalid user payload.");
            }

            string connectionString = _configuration.GetConnectionString("DatabaseConnection");

            using SqlConnection connection = new SqlConnection(connectionString);
            connection.Open();

            // duplicate email check: This addresses the multi-account bug identified in your console log
            string checkSql = "SELECT COUNT(1) FROM registered_users WHERE email = @emailCheck";
            using (SqlCommand checkCommand = new SqlCommand(checkSql, connection))
            {
                checkCommand.Parameters.Add("@emailCheck", System.Data.SqlDbType.NVarChar, 256).Value = registeredUsers.email;
                int emailExists = Convert.ToInt32(checkCommand.ExecuteScalar());

                if (emailExists > 0)
                {
                    // Returns 409 Conflict code caught by your "Register.jsx" custom error panel
                    return Conflict("This email address is already registered.");
                }
            }

            
            string sql = @"
                INSERT INTO registered_users
                (
                    email,
                    user_password,
                    confirm_password,
                    first_name,
                    last_name,
                    checkbox
                )
                VALUES
                (
                    @email,
                    @user_password,
                    @confirm_password,
                    @first_name,
                    @last_name,
                    @checkbox
                )";

            using SqlCommand command = new SqlCommand(sql, connection);

            command.Parameters.Add("@email", System.Data.SqlDbType.NVarChar, 256).Value = (object)registeredUsers.email ?? DBNull.Value;
            command.Parameters.Add("@user_password", System.Data.SqlDbType.NVarChar, 256).Value = (object)registeredUsers.user_password ?? DBNull.Value;
            command.Parameters.Add("@confirm_password", System.Data.SqlDbType.NVarChar, 256).Value = (object)registeredUsers.confirm_password ?? DBNull.Value;
            command.Parameters.Add("@first_name", System.Data.SqlDbType.NVarChar, 100).Value = (object)registeredUsers.first_name ?? DBNull.Value;
            command.Parameters.Add("@last_name", System.Data.SqlDbType.NVarChar, 100).Value = (object)registeredUsers.last_name ?? DBNull.Value;
            command.Parameters.Add("@checkbox", System.Data.SqlDbType.Bit).Value = registeredUsers.checkbox;

            command.ExecuteNonQuery();

            return Ok(registeredUsers);
        }

        // GET: api/RegisteredUsers
        [HttpGet]
        public IActionResult GetRegisteredUser()
        {
            List<RegisteredUsers> registeredUsers = new List<RegisteredUsers>();
            string connectionString = _configuration.GetConnectionString("DatabaseConnection");

            using SqlConnection connection = new SqlConnection(connectionString);
            connection.Open();

            string sql = @"
                SELECT
                    email,
                    user_password,
                    confirm_password,
                    first_name,
                    last_name,
                    checkbox
                FROM registered_users";

            using SqlCommand command = new SqlCommand(sql, connection);
            using SqlDataReader reader = command.ExecuteReader();

            while (reader.Read())
            {
                registeredUsers.Add(new RegisteredUsers
                {
                    email = reader["email"].ToString()!,
                    user_password = reader["user_password"].ToString()!,
                    confirm_password = reader["confirm_password"].ToString()!,
                    first_name = reader["first_name"].ToString()!,
                    last_name = reader["last_name"].ToString()!,
                    checkbox = Convert.ToBoolean(reader["checkbox"])
                });
            }

            return Ok(registeredUsers);
        }
    }
}



