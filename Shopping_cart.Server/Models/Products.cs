namespace Shopping_cart.Server.Models
{
    public class Products
    {
        public int item_id { get; set; }
        public string item_name { get; set; } = "";
        public string item_image { get; set; } = "";
        public string item_description { get; set; } = "";
        public string item_brand { get; set; } = "";
        public decimal price { get; set; }
        public string category { get; set; } = "";

    }
}
