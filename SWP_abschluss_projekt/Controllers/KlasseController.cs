using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SWP_abschluss_projekt.Models;

namespace SWP_abschluss_projekt.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class KlasseController : ControllerBase
    {
        private readonly SchulDbContext _context;

        public KlasseController(SchulDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Klasse>>> GetAll()
        {
            return await _context.Klassen.Include(k => k.Klassenvorstand).ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Klasse>> Create(Klasse klasse)
        {
            // Fix: Lehrer aus DB laden statt das JSON-Objekt zu inserieren
            if (klasse.Klassenvorstand != null && klasse.Klassenvorstand.Id > 0)
            {
                var lehrer = await _context.Lehrer.FindAsync(klasse.Klassenvorstand.Id);
                klasse.Klassenvorstand = lehrer;
            }
            else
            {
                klasse.Klassenvorstand = null;
            }

            _context.Klassen.Add(klasse);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAll), new { id = klasse.Id }, klasse);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var klasse = await _context.Klassen.FindAsync(id);
            if (klasse == null) return NotFound();
            _context.Klassen.Remove(klasse);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
