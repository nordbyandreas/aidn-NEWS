using System.Runtime.Serialization;
using System.Text.Json.Serialization;

enum MeasurementType
{
    [EnumMember(Value = "TEMP")]
    TEMP,
    [EnumMember(Value = "HR")]
    HR,
    [EnumMember(Value = "RR")]
    RR
}

struct Measurement
{
    [JsonPropertyName("type")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public MeasurementType Type { get; set; }
    public int Value { get; set; }
}