using SWP_abschluss_projekt.Models;
using Xunit;

namespace SWP_abschluss_projekt.Tests.Unit;

public class FachTests
{
    [Fact]
    public void Constructor_Sets_Properties()
    {
        var lehrer = new Lehrer("Anna", "Bauer");
        var fach = new Fach("Math", lehrer);

        Assert.Equal("Math", fach.Bezeichnung);
        Assert.Same(lehrer, fach.Lehrer);
        Assert.Empty(fach.Noten);
    }
}
