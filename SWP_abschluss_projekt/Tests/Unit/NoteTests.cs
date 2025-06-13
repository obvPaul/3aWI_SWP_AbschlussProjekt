using SWP_abschluss_projekt.Models;
using Xunit;

namespace SWP_abschluss_projekt.Tests.Unit;

public class NoteTests
{
    [Fact]
    public void Constructor_Sets_Properties()
    {
        var schueler = new Schueler("Max", "Muster", new Klasse("1A", new Lehrer("L","B")));
        var fach = new Fach("Deutsch", new Lehrer("T","S"));
        var note = new Note(schueler, fach, 1);

        Assert.Same(schueler, note.Schueler);
        Assert.Same(fach, note.Fach);
        Assert.Equal(1, note.Wert);
    }
}
