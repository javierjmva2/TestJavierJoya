
namespace TestJavierJoya.Application.Dtos
{
    public class OwnerDto
    {
        public string? Id { get; set; } = default!;
        public string Name { get; set; } = default!;
        public string Address { get; set; } = default!;
        public string Photo { get; set; } = default!;
        public DateTime Birthday { get; set; }
    }
}
