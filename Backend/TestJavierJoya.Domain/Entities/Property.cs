using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace TestJavierJoya.Domain.Entities
{
    public class Property
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = default!;

        public string Name { get; set; } = default!;
        public string Address { get; set; } = default!;
        public int Price { get; set; }
        public string CodeInternal { get; set; } = default!;
        public int Year { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string IdOwner { get; set; } = default!;

        public List<PropertyImage> Images { get; set; } = new();
        public List<PropertyTrace> Traces { get; set; } = new();
    }
}
