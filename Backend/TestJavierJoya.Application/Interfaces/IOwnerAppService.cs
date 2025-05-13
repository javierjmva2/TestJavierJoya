using TestJavierJoya.Application.Common.Models;
using TestJavierJoya.Application.Dtos;
using TestJavierJoya.Application.Models;

namespace TestJavierJoya.Application.Interfaces
{
    public interface IOwnerAppService
    {
        Task<PagedResult<OwnerSearchDto>> GetFilteredOwnersAsync(FilterParametersOwner filterParametersOwner);
        Task<OwnerDto> GetByIdAsync(string id);
        Task AddNew(OwnerDto owner);
        Task UpdateOwner(string id, OwnerDto owner);
        Task<bool> DeleteByIdAsync(string id);
        Task<IEnumerable<OwnerListDto>> GetAllOrderedByName();
    }
}
