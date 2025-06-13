using SWP_abschluss_projekt.Models;
using Xunit;

namespace SWP_abschluss_projekt.Tests.Unit;

public class PersonTests
{
    [Fact]
    public void Constructor_Sets_Names()
    {
        var person = new Person("Max", "Mustermann");
        Assert.Equal("Max", person.Vorname);
        Assert.Equal("Mustermann", person.Nachname);
    }
}
