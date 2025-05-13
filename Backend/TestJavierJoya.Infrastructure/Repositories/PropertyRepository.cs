using DnsClient.Internal;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Core.Events;
using TestJavierJoya.Domain.Entities;
using TestJavierJoya.Domain.Interfaces;
using TestJavierJoya.Infrastructure.Config;

namespace TestJavierJoya.Infrastructure.Repositories
{
    public class PropertyRepository : IPropertyRepository
    {
        private readonly IMongoCollection<Property> _collection;
        private readonly ILogger<OwnerRepository> _logger;

        public PropertyRepository(IOptions<MongoDbSettings> settings, ILogger<OwnerRepository> logger)
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

            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _collection = database.GetCollection<Property>("properties");
        }

        public async Task<IEnumerable<Property>> GetAllAsync()
        {
            return await _collection.Find(_ => true).ToListAsync();
        }

        public async Task<Property?> GetByIdAsync(string id)
        {
            return await _collection.Find(p => p.Id == id).FirstOrDefaultAsync();
        }

        public async Task AddAsync(Property property)
        {
            await _collection.InsertOneAsync(property);
        }

        public async Task UpdateAsync(string propertyId, Property property)
        {
            var filterBuilder = Builders<Property>.Filter;
            property.Id = propertyId;
            await _collection.ReplaceOneAsync(filterBuilder.Eq(o => o.Id, propertyId), property);
        }

        public async Task<(IEnumerable<Property> items, long totalCount)> GetFilteredAsync(string? name, decimal? minPrice, decimal? maxPrice, string orderBy, string orderDirection, int skip, int take)
        {
            var filterBuilder = Builders<Property>.Filter;
            var filters = new List<FilterDefinition<Property>>();

            if (!string.IsNullOrWhiteSpace(name))
                filters.Add(filterBuilder.Regex(p => p.Name, new BsonRegularExpression(name, "i")));

            if (minPrice.HasValue)
                filters.Add(filterBuilder.Gte(p => p.Price, minPrice.Value));

            if (maxPrice.HasValue && maxPrice > 0)
                filters.Add(filterBuilder.Lte(p => p.Price, maxPrice.Value));

            var filter = filters.Any() ? filterBuilder.And(filters) : filterBuilder.Empty;

            var sortBuilder = Builders<Property>.Sort;
            var sort = orderDirection.ToLower() == "desc"
                ? sortBuilder.Descending(orderBy)
                : sortBuilder.Ascending(orderBy);

            var totalCount = await _collection.CountDocumentsAsync(filter);

            var items = await _collection.Find(filter)
                .Sort(sort)
                .Skip(totalCount > take ? skip : 0)
                .Limit(take)
                .ToListAsync();

            return (items, totalCount);
        }

        public async Task UploadImage(string propertyId, string fileBase64)
        {
            var filter = Builders<Property>.Filter.Eq(p => p.Id, propertyId);
            var update = Builders<Property>.Update.Push(p => p.Images, new PropertyImage() { File = fileBase64 });
            await _collection.UpdateOneAsync(filter, update);
        }

        public async Task DeleteImage(string propertyId, string fileBase64)
        {
            var filter = Builders<Property>.Filter.Eq(p => p.Id, propertyId);
            var update = Builders<Property>.Update.Pull(p => p.Images, new PropertyImage() { File = fileBase64 });
            await _collection.UpdateOneAsync(filter, update);
        }

        public async Task<bool> DeleteByIdAsync(string id)
        {
            await _collection.DeleteOneAsync(s => s.Id == id);
            return true;
        }
    }
}
