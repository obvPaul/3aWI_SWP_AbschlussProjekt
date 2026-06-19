namespace SWP_abschluss_projekt.Models
{
    public class Raum
    {
        public int Id { get; set; }
        public string Bezeichnung { get; set; } = string.Empty;

        public Raum() { }

        public Raum(string bezeichnung)
        {
            Bezeichnung = bezeichnung;
        }
    }
}
