using SWP_abschluss_projekt.Models;
using Xunit;

namespace SWP_abschluss_projekt.Tests.Unit;

public class RaumTests
{
    [Fact]
    public void Constructor_Sets_Bezeichnung()
    {
        var raum = new Raum("R101");

        Assert.Equal("R101", raum.Bezeichnung);
    }
}
