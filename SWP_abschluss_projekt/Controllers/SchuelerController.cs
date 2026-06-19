using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SWP_abschluss_projekt.Models;

namespace SWP_abschluss_projekt.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SchuelerController : ControllerBase
    {
        private readonly SchulDbContext _context;

        public SchuelerController(SchulDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Schueler>>> GetAll()
        {
            return await _context.Schueler.Include(s => s.Klasse).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Schueler>> GetById(int id)
        {
            var schueler = await _context.Schueler
                .Include(s => s.Klasse)
                .FirstOrDefaultAsync(s => s.Id == id);
            if (schueler == null) return NotFound();
            return schueler;
        }

        [HttpPost]
        public async Task<ActionResult<Schueler>> Create(Schueler schueler)
        {
            // Fix: Klasse aus DB laden statt das JSON-Objekt zu inserieren
            if (schueler.Klasse != null && schueler.Klasse.Id > 0)
            {
                var klasse = await _context.Klassen.FindAsync(schueler.Klasse.Id);
                schueler.Klasse = klasse;
            }
            else
            {
                schueler.Klasse = null;
            }

            _context.Schueler.Add(schueler);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = schueler.Id }, schueler);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Schueler updated)
        {
            if (id != updated.Id) return BadRequest();

            // Bestehenden Schüler aus DB laden
            var existing = await _context.Schueler.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Vorname = updated.Vorname;
            existing.Nachname = updated.Nachname;

            // Klasse aktualisieren
            if (updated.Klasse != null && updated.Klasse.Id > 0)
            {
                existing.Klasse = await _context.Klassen.FindAsync(updated.Klasse.Id);
            }
            else
            {
                existing.Klasse = null;
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var schueler = await _context.Schueler.FindAsync(id);
            if (schueler == null) return NotFound();

            _context.Schueler.Remove(schueler);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
