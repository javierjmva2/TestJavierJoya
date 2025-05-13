using TestJavierJoya.Domain.Entities;

namespace TestJavierJoya.Domain.Interfaces
{
    public interface IPropertyRepository
    {
        Task<(IEnumerable<Property> items, long totalCount)> GetFilteredAsync(string? name, decimal? minPrice, decimal? maxPrice, string orderBy, string orderDirection, int skip, int take);
        Task<IEnumerable<Property>> GetAllAsync();
        Task<Property?> GetByIdAsync(string id);
        Task AddAsync(Property property);
        Task UpdateAsync(string propertyId, Property property);
        Task UploadImage(string propertyId, string fileBase64);
        Task DeleteImage(string propertyId, string fileBase64);
        Task<bool> DeleteByIdAsync(string id);
    }
}
