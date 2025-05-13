namespace TestJavierJoya.Application.Dtos
{    
    public class PropertyDto
    {
        public string? Id { get; set; } = default!;
        public string Name { get; set; } = default!;
        public string Address { get; set; } = default!;
        public int Price { get; set; }
        public string? CodeInternal { get; set; } = default!;
        public int? Year { get; set; }

        public string IdOwner { get; set; } = default!;
        public List<PropertyImageDto> Images { get; set; } = new();
        public List<PropertyTraceDto> Traces { get; set; } = new();
    }
}
