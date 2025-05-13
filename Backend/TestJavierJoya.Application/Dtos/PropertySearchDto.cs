namespace TestJavierJoya.Application.Dtos
{
    public class PropertySearchDto
    {
        public string Id { get; set; } = default!;
        public string Name { get; set; } = default!;
        public string Address { get; set; } = default!;
        public int Price { get; set; }
        public PropertyImageDto? ImageShow { get; set; }
    }
}
