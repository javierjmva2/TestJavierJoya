using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Core.Events;
using TestJavierJoya.Domain.Entities;
using TestJavierJoya.Domain.Repositories;
using TestJavierJoya.Infrastructure.Config;

namespace TestJavierJoya.Infrastructure.Repositories
{
    public class OwnerRepository : IOwnerRepository
    {
        private readonly IMongoCollection<Owner> _collection;
        private readonly IMongoCollection<Property> _collectionProperties;
        private readonly ILogger<OwnerRepository> _logger;

        public OwnerRepository(IOptions<MongoDbSettings> settings, ILogger<OwnerRepository> logger)
        {
            _logger = logger;

            var mongoClientSettings = MongoClientSettings.FromConnectionString(settings.Value.ConnectionString);
            mongoClientSettings.ClusterConfigurator = cb =>
            {
                cb.Subscribe<CommandStartedEvent>(e =>
                {
                    _logger.LogInformation("MongoDB Command: {CommandName} - {Command}", e.CommandName, e.Command.ToJson());
                });
            };

            var client = new MongoClient(mongoClientSettings);
            var db = client.GetDatabase(settings.Value.DatabaseName);
            _collection = db.GetCollection<Owner>("owners");
            _collectionProperties = db.GetCollection<Property>("properties");

        }

        public async Task AddNew(Owner owner)
        {
            await _collection.InsertOneAsync(owner);
        }

        public async Task<bool> DeleteByIdAsync(string id)
        {
            var filterBuilder = Builders<Property>.Filter;
            var filters = new List<FilterDefinition<Property>>();
            filters.Add(filterBuilder.Eq(o => o.IdOwner, id));

            //Se verifica si se puede borrar (Que no contenga propiedades)
            if (await _collectionProperties.CountDocumentsAsync(filterBuilder.And(filters)) != 0)
                return false;

            await _collection.DeleteOneAsync(s => s.Id == id);
            return true;
        }

        public async Task<IEnumerable<Owner>> GetAllOrderedByName()
        {
            var sort = Builders<Owner>.Sort.Ascending("Name");
            return await _collection.Find(s => true).Sort(sort).ToListAsync();
        }

        public async Task<Owner?> GetByIdAsync(string id)
        {


            return await _collection.Find(o => o.Id == id).FirstOrDefaultAsync();
        }

        public async Task<(IEnumerable<Owner> items, long totalCount)> GetFilteredAsync(string? name, string? address, string orderBy, string orderDirection, int skip, int take)
        {
            var filterBuilder = Builders<Owner>.Filter;
            var filters = new List<FilterDefinition<Owner>>();

            if (!string.IsNullOrWhiteSpace(name))
                filters.Add(filterBuilder.Regex(o => o.Name, new BsonRegularExpression(name, "i")));

            if (!string.IsNullOrWhiteSpace(address))
                filters.Add(filterBuilder.Regex(o => o.Address, new BsonRegularExpression(address, "i")));

            var combinedFilter = filters.Any() ? filterBuilder.And(filters) : filterBuilder.Empty;

            var sort = orderDirection.ToLower() == "desc"
                ? Builders<Owner>.Sort.Descending(orderBy)
                : Builders<Owner>.Sort.Ascending(orderBy);

            var totalCount = await _collection.CountDocumentsAsync(combinedFilter);

            var items = await _collection.Find(combinedFilter)
                .Sort(sort)
                .Skip(totalCount > take ? skip : 0)
                .Limit(take)
                .ToListAsync();

            return (items, totalCount);
        }

        public async Task UpdateOwner(string id, Owner owner)
        {
            var filterBuilder = Builders<Owner>.Filter;
            owner.Id = id;
            await _collection.ReplaceOneAsync(filterBuilder.Eq(o => o.Id, id), owner);
        }
    }
}
