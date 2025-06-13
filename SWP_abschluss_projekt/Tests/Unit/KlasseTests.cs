using SWP_abschluss_projekt.Models;
using Xunit;

namespace SWP_abschluss_projekt.Tests.Unit;

public class KlasseTests
{
    [Fact]
    public void Constructor_Sets_Properties()
    {
        var lehrer = new Lehrer("Eva", "Schmidt");
        var klasse = new Klasse("3A", lehrer);

        Assert.Equal("3A", klasse.Name);
        Assert.Same(lehrer, klasse.Klassenvorstand);
        Assert.Empty(klasse.Schueler);
    }
}
