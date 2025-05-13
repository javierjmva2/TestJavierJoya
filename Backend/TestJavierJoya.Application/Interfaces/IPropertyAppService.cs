using TestJavierJoya.Application.Common.Models;
using TestJavierJoya.Application.Dtos;
using TestJavierJoya.Application.Models;

namespace TestJavierJoya.Application.Interfaces
{
    public interface IPropertyAppService
    {
        Task<PropertyDto> GetByIdAsync(string id);
        Task<PagedResult<PropertySearchDto>> GetFilteredPropertiesAsync(FilterParametersProperty filterParametersProperty);
        Task UploadImage(string propertyId, byte[] file);
        Task DeleteImage(string propertyId, byte[] file);
        Task AddAsync(PropertyDto property);
        Task UpdatePropertyAsync(string id, PropertyDto property);
        Task<bool> DeleteByIdAsync(string id);
    }
}
