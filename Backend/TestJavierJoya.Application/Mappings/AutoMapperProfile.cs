using AutoMapper;
using MongoDB.Bson;
using TestJavierJoya.Application.Dtos;
using TestJavierJoya.Domain.Entities;

namespace TestJavierJoya.Application.Mappings
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {

            CreateMap<Owner, OwnerListDto>().ReverseMap();
            CreateMap<Owner, OwnerDto>().ReverseMap();
            CreateMap<OwnerDto, Owner>().ForMember(dest => dest.Id, opt => opt.MapFrom(src => (string.IsNullOrEmpty(src.Id) ? ObjectId.GenerateNewId().ToString() : src.Id))).ReverseMap();
            CreateMap<Owner, OwnerSearchDto>().ReverseMap();

            //Para el mapeo de la busqueda inicial de propiedades solo se muestra la primera imagen.. si es que la tiene.
            CreateMap<Property, PropertyDto>().ForMember(dest => dest.Id, opt => opt.MapFrom(src => (string.IsNullOrEmpty(src.Id) ? ObjectId.GenerateNewId().ToString() : src.Id))).ReverseMap();
            CreateMap<Property, PropertySearchDto>().ForMember(dest => dest.ImageShow, opt => opt.MapFrom(src => (src.Images != null && src.Images.Count > 0 ? src.Images.FirstOrDefault() : null)));
            CreateMap<Property, PropertyDto>().ReverseMap();

            CreateMap<PropertyImage, PropertyImageDto>().ReverseMap();
            CreateMap<PropertyTrace, PropertyTraceDto>().ReverseMap();
        }
    }
}
