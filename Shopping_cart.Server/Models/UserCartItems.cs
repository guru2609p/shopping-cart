namespace Shopping_cart.Server.Models
{
    public class UserCartItems
    {
        public int item_id { get; set; }
        public string email { get; set; } = "";
        public string item_name { get; set; } = "";
        public decimal item_price { get; set; }
        public int item_quantity { get; set; }
    }
}
