namespace TestJavierJoya.Application.Dtos
{
    public class PropertyTraceDto
    {
        public DateTime DateSale { get; set; }
        public string Name { get; set; } = default!;
        public decimal Value { get; set; }
        public decimal Tax { get; set; }
    }
}
