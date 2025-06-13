using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SWP_abschluss_projekt.Controllers;
using SWP_abschluss_projekt.Models;
using Xunit;

namespace SWP_abschluss_projekt.Tests.Unit;

public class FachControllerTests
{
    private SchulDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<SchulDbContext>()
            .UseInMemoryDatabase(databaseName: "FachControllerTests")
            .Options;
        return new SchulDbContext(options);
    }

    [Fact]
    public async Task GetAll_Returns_All_Faecher()
    {
        using var context = CreateContext();
        context.Faecher.Add(new Fach("M", new Lehrer("a","b")));
        context.Faecher.Add(new Fach("E", new Lehrer("c","d")));
        context.SaveChanges();
        var controller = new FachController(context);

        var result = await controller.GetAll();

        Assert.Equal(2, result.Value?.Count());
    }

    [Fact]
    public async Task Create_Adds_Fach()
    {
        using var context = CreateContext();
        var controller = new FachController(context);
        var fach = new Fach("D", new Lehrer("e","f"));

        var result = await controller.Create(fach);

        Assert.Single(context.Faecher);
        Assert.Equal(201, (result.Result as CreatedAtActionResult)?.StatusCode);
    }
}

