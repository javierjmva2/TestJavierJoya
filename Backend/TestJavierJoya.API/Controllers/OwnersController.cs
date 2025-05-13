using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TestJavierJoya.Application.Dtos;
using TestJavierJoya.Application.Interfaces;
using TestJavierJoya.Application.Models;

namespace TestJavierJoya.API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OwnersController : ControllerBase
    {
        private readonly IOwnerAppService _ownerAppService;

        public OwnersController(IOwnerAppService ownerAppService)
        {
            _ownerAppService = ownerAppService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OwnerDto>> GetById(string id)
        {
            var owner = await _ownerAppService.GetByIdAsync(id);
            if (owner == null)
                return NotFound();

            return Ok(owner);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OwnerSearchDto>>> Get([FromQuery] FilterParametersOwner filters)
        {
            var owners = await _ownerAppService.GetFilteredOwnersAsync(filters);
            return Ok(owners);
        }

        [HttpGet("getAll")]
        public async Task<ActionResult<IEnumerable<OwnerListDto>>> GetAll()
        {
            var owners = await _ownerAppService.GetAllOrderedByName();
            return Ok(owners);
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] OwnerDto ownerDto)
        {
            await _ownerAppService.AddNew(ownerDto);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(string id, [FromBody] OwnerDto ownerDto)
        {
            await _ownerAppService.UpdateOwner(id, ownerDto);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<string>> Delete(string id)
        {
            var response = await _ownerAppService.DeleteByIdAsync(id);
            return Ok(response);
        }
    }
}
