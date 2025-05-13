using TestJavierJoya.Domain.Entities;

namespace TestJavierJoya.Domain.Repositories
{
    public interface IOwnerRepository
    {
        Task AddNew(Owner owner);
        Task UpdateOwner(string id, Owner owner);
        Task<Owner?> GetByIdAsync(string id);
        Task<bool> DeleteByIdAsync(string id);
        Task<(IEnumerable<Owner> items, long totalCount)> GetFilteredAsync(string? name, string? address, string orderBy, string orderDirection, int skip, int take);
        Task<IEnumerable<Owner>> GetAllOrderedByName();
    }
}
