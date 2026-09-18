namespace Shopping_cart.Server.Models
{
    public class RegisteredUsers
    {
        public string email { get; set; } = "";
        public string user_password { get; set; } = "";
        public string confirm_password { get; set; } = "";
        public string first_name { get; set; } = "";
        public string last_name { get; set; } = "";
        public string user_role { get; set; } = "";
        public bool checkbox { get; set; }
    }
}
