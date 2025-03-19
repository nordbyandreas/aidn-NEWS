

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument(config =>
{
    config.DocumentName = "API";
    config.Title = "API v1";
    config.Version = "v1";
});
var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseOpenApi();
    app.UseSwaggerUi(config =>
    {
        config.DocumentTitle = "API";
        config.Path = "/swagger";
        config.DocumentPath = "/swagger/{documentName}/swagger.json";
        config.DocExpansion = "list";
    });
}


app.MapPost("/news", (NEWSMeasurements measurements) => CalculateNEWSScore(measurements));





List<string> ValidateMeasurements(NEWSMeasurements NEWSmeasurements)
{
    List<MeasurementDefinition> MeasurementDefinitions =
        [
            new MeasurementDefinition { Name = "TEMP", MinValue = 31, MaxValue = 42 },
            new MeasurementDefinition { Name = "HR", MinValue = 25, MaxValue = 220 },
            new MeasurementDefinition { Name = "RR", MinValue = 3, MaxValue = 60 }
        ];

    List<string> errors = [];


    // TODO: handle unknown measurement types

    foreach (var measurementDefinition in MeasurementDefinitions)
    {

        var maybeMeasurement = NEWSmeasurements.Measurements.FindAll(x => x.Type.ToString() == measurementDefinition.Name);
        if (maybeMeasurement.Count == 0)
        {
            errors.Add($"Measurement type {measurementDefinition.Name} is missing");
            continue;
        }
        else if (maybeMeasurement.Count > 1)
        {
            errors.Add($"Multiple measurements of type {measurementDefinition.Name} found");
            continue;
        }

        var measurement = maybeMeasurement[0];
        if (measurement.Value < measurementDefinition.MinValue || measurement.Value > measurementDefinition.MaxValue)
        {
            errors.Add($"Measurement value {measurement.Value} is out of range for {measurementDefinition.Name} ({measurementDefinition.MinValue}..{measurementDefinition.MaxValue})");
        }
    }

    return errors;

}


IResult CalculateNEWSScore(NEWSMeasurements NEWSmeasurements)
{

    List<string> errors = ValidateMeasurements(NEWSmeasurements);
    if (errors.Count > 0)
    {
        return TypedResults.BadRequest(new ApiResponse { Error = errors });
    }

    int tempScore = CalcTempScore(NEWSmeasurements.Measurements.Find(x => x.Type == MeasurementType.TEMP).Value);
    int hrScore = CalcHrScore(NEWSmeasurements.Measurements.Find(x => x.Type == MeasurementType.HR).Value);
    int rrScore = CalcRrScore(NEWSmeasurements.Measurements.Find(x => x.Type == MeasurementType.RR).Value);
    int score = tempScore + hrScore + rrScore;



    // TODO: since we should return structured errors if input is invalid I think we need 
    // some sort of API result object that can hold either a success(data) or an error


    return TypedResults.Ok(new ApiResponse { Data = new NewsScore() { score = score } });
}

int CalcTempScore(int value)
{
    if (value <= 35)
    {
        return 3;
    }
    else if (value <= 36)
    {
        return 1;
    }
    else if (value <= 38)
    {
        return 0;
    }
    else if (value <= 39)
    {
        return 1;
    }
    else
    {
        return 2;
    }
}
int CalcHrScore(int value)
{
    if (value <= 40)
    {
        return 3;
    }
    else if (value <= 50)
    {
        return 1;
    }
    else if (value <= 90)
    {
        return 0;
    }
    else if (value <= 110)
    {
        return 1;
    }
    else if (value <= 130)
    {
        return 2;
    }
    else
    {
        return 3;
    }
}
int CalcRrScore(int value)
{
    if (value <= 8)
    {
        return 3;
    }
    else if (value <= 11)
    {
        return 1;
    }
    else if (value <= 20)
    {
        return 0;
    }
    else if (value <= 24)
    {
        return 2;
    }
    else
    {
        return 3;
    }
}


app.Run();