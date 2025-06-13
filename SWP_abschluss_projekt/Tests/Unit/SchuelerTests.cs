using SWP_abschluss_projekt.Models;
using Xunit;

namespace SWP_abschluss_projekt.Tests.Unit;

public class SchuelerTests
{
    [Fact]
    public void Constructor_Sets_Properties()
    {
        var klasse = new Klasse("1B", new Lehrer("L","B"));
        var schueler = new Schueler("Tim", "Test", klasse);

        Assert.Equal("Tim", schueler.Vorname);
        Assert.Equal("Test", schueler.Nachname);
        Assert.Same(klasse, schueler.Klasse);
        Assert.Empty(schueler.Noten);
    }
}
