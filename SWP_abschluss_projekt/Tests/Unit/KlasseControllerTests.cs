using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SWP_abschluss_projekt.Controllers;
using SWP_abschluss_projekt.Models;
using Xunit;

namespace SWP_abschluss_projekt.Tests.Unit;

public class KlasseControllerTests
{
    private SchulDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<SchulDbContext>()
            .UseInMemoryDatabase(databaseName: "KlasseControllerTests")
            .Options;
        return new SchulDbContext(options);
    }

    [Fact]
    public async Task GetAll_Returns_All_Klassen()
    {
        using var context = CreateContext();
        context.Klassen.Add(new Klasse("1A", new Lehrer("a","b")));
        context.Klassen.Add(new Klasse("2B", new Lehrer("c","d")));
        context.SaveChanges();
        var controller = new KlasseController(context);

        var result = await controller.GetAll();

        Assert.Equal(2, result.Value?.Count());
    }

    [Fact]
    public async Task Create_Adds_Klasse()
    {
        using var context = CreateContext();
        var controller = new KlasseController(context);
        var klasse = new Klasse("3C", new Lehrer("e","f"));

        var result = await controller.Create(klasse);

        Assert.Single(context.Klassen);
        Assert.Equal(201, (result.Result as CreatedAtActionResult)?.StatusCode);
    }
}

