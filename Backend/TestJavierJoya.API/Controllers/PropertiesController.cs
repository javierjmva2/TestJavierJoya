using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TestJavierJoya.Application.Dtos;
using TestJavierJoya.Application.Interfaces;
using TestJavierJoya.Application.Models;
using TestJavierJoya.Application.Services;

namespace TestJavierJoya.API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PropertiesController : ControllerBase
    {

        private readonly IPropertyAppService _propertyAppService;

        public PropertiesController(IPropertyAppService propertyAppService)
        {
            _propertyAppService = propertyAppService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PropertySearchDto>>> Get([FromQuery] FilterParametersProperty filters)
        {
            var properties = await _propertyAppService.GetFilteredPropertiesAsync(filters);
            return Ok(properties);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PropertyDto>> GetById(string id)
        {
            var property = await _propertyAppService.GetByIdAsync(id);
            if (property == null)
                return NotFound();

            return Ok(property);
        }

        [HttpPost("{propertyId}/images")]
        public async Task<IActionResult> UploadImage(string propertyId, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No se seleccionó ningún archivo");

            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            byte[] fileBytes = memoryStream.ToArray();

            await _propertyAppService.UploadImage(propertyId, fileBytes);

            return Ok(new { imageBase64 = Convert.ToBase64String(fileBytes) });
        }

        [HttpDelete("{propertyId}/images")]
        public async Task<IActionResult> DeleteImage(string propertyId, [FromBody] string imageBase64)
        {
            if (string.IsNullOrWhiteSpace(imageBase64))
                return BadRequest("La imagen es requerida");

            string base64Final = imageBase64.Contains(",") ? imageBase64.Split(',')[1] : imageBase64;
            byte[] file = Convert.FromBase64String(base64Final);

            await _propertyAppService.DeleteImage(propertyId, file);
            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] PropertyDto propertyDto)
        {
            await _propertyAppService.AddAsync(propertyDto);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(string id, [FromBody] PropertyDto propertyDto)
        {
            await _propertyAppService.UpdatePropertyAsync(id, propertyDto);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<string>> Delete(string id)
        {
            var response = await _propertyAppService.DeleteByIdAsync(id);
            return Ok(response);
        }
    }
}
