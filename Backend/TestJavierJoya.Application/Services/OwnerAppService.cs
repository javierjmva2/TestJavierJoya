using AutoMapper;
using TestJavierJoya.Application.Common.Models;
using TestJavierJoya.Application.Dtos;
using TestJavierJoya.Application.Interfaces;
using TestJavierJoya.Application.Models;
using TestJavierJoya.Domain.Entities;
using TestJavierJoya.Domain.Repositories;

namespace TestJavierJoya.Application.Services
{
    public class OwnerAppService : IOwnerAppService
    {
        private readonly IOwnerRepository _repository;
        private readonly IMapper _mapper;

        public OwnerAppService(IOwnerRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task AddNew(OwnerDto owner)
        {
            await _repository.AddNew(_mapper.Map<Owner>(owner));
        }

        public async Task<bool> DeleteByIdAsync(string id)
        {
            return await _repository.DeleteByIdAsync(id);
        }

        public async Task<IEnumerable<OwnerListDto>> GetAllOrderedByName()
        {
            return _mapper.Map<IEnumerable<OwnerListDto>>(await _repository.GetAllOrderedByName());
        }

        public async Task<OwnerDto> GetByIdAsync(string id)
        {
            return _mapper.Map<OwnerDto>(await _repository.GetByIdAsync(id));
        }

        public async Task<PagedResult<OwnerSearchDto>> GetFilteredOwnersAsync(FilterParametersOwner filterParametersOwner)
        {
            int skip = (filterParametersOwner.PageNumber - 1) * filterParametersOwner.PageSize;

            var (items, totalCount) = await _repository.GetFilteredAsync(
                filterParametersOwner.Name,
                filterParametersOwner.Address,
                filterParametersOwner.SortBy,
                filterParametersOwner.SortDescending ? "desc" : "asc",
                skip,
                filterParametersOwner.PageSize);

            return new PagedResult<OwnerSearchDto>
            {
                Items = _mapper.Map<IEnumerable<OwnerSearchDto>>(items),
                TotalCount = totalCount,
                Page = filterParametersOwner.PageNumber,
                PageSize = filterParametersOwner.PageSize
            };
        }

        public async Task UpdateOwner(string id, OwnerDto owner)
        {
            await _repository.UpdateOwner(id, _mapper.Map<Owner>(owner));
        }
    }
}
