using AutoMapper;
using TestJavierJoya.Application.Common.Models;
using TestJavierJoya.Application.Dtos;
using TestJavierJoya.Application.Interfaces;
using TestJavierJoya.Application.Models;
using TestJavierJoya.Domain.Entities;
using TestJavierJoya.Domain.Interfaces;

namespace TestJavierJoya.Application.Services
{
    public class PropertyAppService : IPropertyAppService
    {
        private readonly IPropertyRepository _repository;
        private readonly IMapper _mapper;

        public PropertyAppService(IPropertyRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<PropertyDto> GetByIdAsync(string id)
        {
            return _mapper.Map<PropertyDto>(await _repository.GetByIdAsync(id));
        }

        public async Task<PagedResult<PropertySearchDto>> GetFilteredPropertiesAsync(FilterParametersProperty filterParametersProperty)
        {
            int skip = (filterParametersProperty.PageNumber - 1) * filterParametersProperty.PageSize;

            var (items, totalCount) = await _repository.GetFilteredAsync(
                filterParametersProperty.Name,
                filterParametersProperty.MinPrice,
                filterParametersProperty.MaxPrice,
                filterParametersProperty.SortBy,
                filterParametersProperty.SortDescending ? "desc" : "asc",
                skip,
                filterParametersProperty.PageSize);

            return new PagedResult<PropertySearchDto>
            {
                Items = _mapper.Map<IEnumerable<PropertySearchDto>>(items),
                TotalCount = totalCount,
                Page = filterParametersProperty.PageNumber,
                PageSize = filterParametersProperty.PageSize
            };
        }

        public async Task UploadImage(string propertyId, byte[] file)
        {
            await _repository.UploadImage(propertyId, Convert.ToBase64String(file));
        }

        public async Task DeleteImage(string propertyId, byte[] file)
        {
            await _repository.DeleteImage(propertyId, Convert.ToBase64String(file));
        }

        public async Task AddAsync(PropertyDto property)
        {
            await _repository.AddAsync(_mapper.Map<Property>(property));
        }

        public async Task UpdatePropertyAsync(string propertyId, PropertyDto property)
        {
            await _repository.UpdateAsync(propertyId, _mapper.Map<Property>(property));
        }

        public async Task<bool> DeleteByIdAsync(string id)
        {
            return await _repository.DeleteByIdAsync(id);
        }
    }
}
