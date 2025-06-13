using SWP_abschluss_projekt.Models;
using Xunit;

namespace SWP_abschluss_projekt.Tests.Unit;

public class LehrerTests
{
    [Fact]
    public void Constructor_Sets_Base_Properties()
    {
        var lehrer = new Lehrer("Tom", "Trauner");

        Assert.Equal("Tom", lehrer.Vorname);
        Assert.Equal("Trauner", lehrer.Nachname);
        Assert.Empty(lehrer.Faecher);
        Assert.Empty(lehrer.KlassenAlsKV);
    }
}
