using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace TestJavierJoya.Domain.Entities
{
    public class Owner
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = default!;

        public string Name { get; set; } = default!;
        public string Address { get; set; } = default!;
        public string Photo { get; set; } = default!;
        public DateTime Birthday { get; set; }
    }
}
