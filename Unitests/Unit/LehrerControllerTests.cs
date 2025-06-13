using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SWP_abschluss_projekt.Controllers;
using SWP_abschluss_projekt.Models;
using Xunit;

namespace SWP_abschluss_projekt.Tests.Unit;

public class LehrerControllerTests
{
    private SchulDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<SchulDbContext>()
            .UseInMemoryDatabase(databaseName: "LehrerControllerTests")
            .Options;
        return new SchulDbContext(options);
    }

    [Fact]
    public async Task GetAll_Returns_All_Lehrer()
    {
        using var context = CreateContext();
        context.Lehrer.AddRange(new Lehrer("A","B"), new Lehrer("C","D"));
        context.SaveChanges();
        var controller = new LehrerController(context);

        var result = await controller.GetAll();

        Assert.Equal(2, result.Value?.Count());
    }

    [Fact]
    public async Task GetById_NotFound_When_Missing()
    {
        using var context = CreateContext();
        var controller = new LehrerController(context);

        var result = await controller.GetById(1);

        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task Create_Adds_Lehrer()
    {
        using var context = CreateContext();
        var controller = new LehrerController(context);
        var neu = new Lehrer("E","F");

        var result = await controller.Create(neu);

        Assert.Equal(1, context.Lehrer.Count());
        Assert.Equal(201, (result.Result as CreatedAtActionResult)?.StatusCode);
    }
}

