using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TestJavierJoya.Domain.Entities
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = default!;
        public string Username { get; set; } = default!;
        public string PasswordHash { get; set; } = default!;
        public bool IsLocked { get; set; } = false;
        public List<string> Roles { get; set; } = new();
    }
}
