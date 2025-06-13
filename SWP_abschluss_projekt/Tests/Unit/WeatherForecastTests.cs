using SWP_abschluss_projekt;
using Xunit;

namespace SWP_abschluss_projekt.Tests.Unit;

public class WeatherForecastTests
{
    [Fact]
    public void TemperatureF_Computes_From_Celsius()
    {
        var forecast = new WeatherForecast { TemperatureC = 0 };
        Assert.Equal(32, forecast.TemperatureF);

        forecast.TemperatureC = 100;
        Assert.Equal(212, forecast.TemperatureF);
    }
}
