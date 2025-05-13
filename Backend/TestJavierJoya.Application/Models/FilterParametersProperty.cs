
namespace TestJavierJoya.Application.Models
{
    public class FilterParametersProperty
    {
        public string? Name { get; set; }
        public string? Address { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? SortBy { get; set; } = "Name";
        public bool SortDescending { get; set; } = false;
    }
}
