using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TestJavierJoya.Domain.Entities;
using TestJavierJoya.Domain.Interfaces;
using TestJavierJoya.Infrastructure.Config;

namespace TestJavierJoya.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly IMongoCollection<User> _collection;

        public UserRepository(IOptions<MongoDbSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _collection = database.GetCollection<User>("users");
        }

        public async Task<User?> GetByUsernameAsync(string username)
        {
            return await _collection.Find(u => u.Username == username).FirstOrDefaultAsync();
        }

        public async Task AddAsync(User user)
        {
            await _collection.InsertOneAsync(user);
        }
    }
}
