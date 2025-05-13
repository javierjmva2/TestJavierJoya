namespace TestJavierJoya.Application.Common.Models
{
    public class PagedResult<T>
    {
        public IEnumerable<T> Items { get; set; } = new List<T>();
        public long TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }
}
