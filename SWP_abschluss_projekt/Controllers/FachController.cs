using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SWP_abschluss_projekt.Models;

namespace SWP_abschluss_projekt.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FachController : ControllerBase
    {
        private readonly SchulDbContext _context;

        public FachController(SchulDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Fach>>> GetAll()
        {
            return await _context.Faecher.Include(f => f.Lehrer).ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Fach>> Create(Fach fach)
        {
            // Fix: Lehrer aus DB laden statt das JSON-Objekt zu inserieren
            if (fach.Lehrer != null && fach.Lehrer.Id > 0)
            {
                var lehrer = await _context.Lehrer.FindAsync(fach.Lehrer.Id);
                fach.Lehrer = lehrer;
            }
            else
            {
                fach.Lehrer = null;
            }

            _context.Faecher.Add(fach);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAll), new { id = fach.Id }, fach);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var fach = await _context.Faecher.FindAsync(id);
            if (fach == null) return NotFound();
            _context.Faecher.Remove(fach);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
