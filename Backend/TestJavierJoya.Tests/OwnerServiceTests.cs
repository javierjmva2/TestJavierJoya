using AutoMapper;
using Moq;
using TestJavierJoya.Application.Dtos;
using TestJavierJoya.Application.Services;
using TestJavierJoya.Domain.Entities;
using TestJavierJoya.Domain.Repositories;

namespace TestJavierJoya.Tests
{
    public class OwnerAppServiceTests
    {
        private Mock<IOwnerRepository> _ownerRepositoryMock;
        private Mock<IMapper> _mapperMock;
        private OwnerAppService _ownerService;

        [SetUp]
        public void Setup()
        {
            _ownerRepositoryMock = new Mock<IOwnerRepository>();
            _mapperMock = new Mock<IMapper>();
            _ownerService = new OwnerAppService(_ownerRepositoryMock.Object, _mapperMock.Object);
        }

        [Test]
        public async Task CreateOwnerAsync_Should_Call_Repository_And_Return_Id()
        {
            var dto = new OwnerDto { Name = "Juan", Address = "Calle X" };
            var entity = new Owner { Name = "Juan", Address = "Calle X" };

            _mapperMock.Setup(m => m.Map<Owner>(dto)).Returns(entity);
            _ownerRepositoryMock.Setup(r => r.AddNew(entity));


            await _ownerService.AddNew(dto);


            Assert.Pass();
            _ownerRepositoryMock.Verify(r => r.AddNew(It.IsAny<Owner>()), Times.Once);
        }

        [Test]
        public async Task GetAllAsync_Should_Return_List_Of_DTOs()
        {
            // Arrange
            var entities = new List<Owner>
    {
        new Owner { Id = "1", Name = "Ana", Address = "Dir" }
    };

            var dtos = new List<OwnerListDto>
    {
        new OwnerListDto { Name = "Ana" }
    };

            _ownerRepositoryMock
                .Setup(r => r.GetAllOrderedByName())
                .ReturnsAsync(entities);

            _mapperMock
                .Setup(m => m.Map<IEnumerable<OwnerListDto>>(It.IsAny<IEnumerable<Owner>>()))
                .Returns(dtos);

            // Act
            var result = await _ownerService.GetAllOrderedByName();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual("Ana", result.FirstOrDefault()?.Name);
        }
    }
}
