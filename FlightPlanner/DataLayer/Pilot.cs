namespace FlightPlanner.DataLayer
{
    public class Pilot
    {
        public int Id { get; set; } // Eindeutige ID des Piloten
        public string FirstName { get; set; } // Vorname des Piloten
        public string LastName { get; set; } // Nachname des Piloten
        public int ExperienceYears { get; set; } // Erfahrung in Jahren

        public override string ToString()
        {
            return $"Pilot: Id={Id}, FirstName={FirstName}, LastName={LastName}, ExperienceYears={ExperienceYears}";
        }
    }
}