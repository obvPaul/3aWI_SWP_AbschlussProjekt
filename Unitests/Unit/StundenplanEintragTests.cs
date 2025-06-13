using System;
using SWP_abschluss_projekt.Models;
using Xunit;

namespace SWP_abschluss_projekt.Tests.Unit;

public class StundenplanEintragTests
{
    [Fact]
    public void Constructor_Sets_Properties()
    {
        var klasse = new Klasse("1A", new Lehrer("A","B"));
        var fach = new Fach("Mathe", new Lehrer("C","D"));
        var raum = new Raum("R1");
        var start = new DateTime(2024,1,1,8,0,0);
        var end = new DateTime(2024,1,1,9,0,0);

        var eintrag = new StundenplanEintrag(klasse, fach, raum, start, end);

        Assert.Same(klasse, eintrag.Klasse);
        Assert.Same(fach, eintrag.Fach);
        Assert.Same(raum, eintrag.Raum);
        Assert.Equal(start, eintrag.Start);
        Assert.Equal(end, eintrag.End);
    }
}
