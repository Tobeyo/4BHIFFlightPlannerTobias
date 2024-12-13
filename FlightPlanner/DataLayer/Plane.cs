namespace FlightPlanner.DataLayer
{
    public class Plane
    {
        public int Id { get; set; } // Eindeutige ID des Flugzeugs
        public string RegistrationNumber { get; set; } // Kennzeichen des Flugzeugs
        public int PlaneTypeId { get; set; } // Verweis auf den Flugzeugtyp (Foreign Key)

        public override string ToString()
        {
            return $"Plane: Id={Id}, RegistrationNumber={RegistrationNumber}, PlaneTypeId={PlaneTypeId}";
        }
    }
}