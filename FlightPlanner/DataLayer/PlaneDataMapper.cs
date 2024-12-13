using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Data.Common;

namespace FlightPlanner.DataLayer
{
    class PlaneDataMapper
    {
        public string ConnectionString { get; set; }

        public PlaneDataMapper(string connectionString)
        {
            this.ConnectionString = connectionString;
        }

        public List<Plane> ReadPlanes()
        {
            List<Plane> planes = new List<Plane>();

            using (DbConnection databaseConnection = new SqlConnection(this.ConnectionString))
            {
                IDbCommand selectPlaneCommand = databaseConnection.CreateCommand();
                selectPlaneCommand.CommandText = "SELECT * FROM Plane";

                databaseConnection.Open();
                IDataReader planeReader = selectPlaneCommand.ExecuteReader();

                while (planeReader.Read())
                {
                    Plane plane = new Plane();
                    plane.Id = planeReader.GetInt32(0); // Column 0: Id
                    plane.RegistrationNumber = planeReader.GetString(1); // Column 1: RegistrationNumber
                    plane.PlaneTypeId = planeReader.GetInt32(2); // Column 2: PlaneTypeId

                    planes.Add(plane);
                }

                return planes;
            }
        }

        public Plane Read(int id)
        {
            using (DbConnection databaseConnection = new SqlConnection(this.ConnectionString))
            {
                IDbCommand selectPlaneCommand = databaseConnection.CreateCommand();
                selectPlaneCommand.CommandText = $"SELECT * FROM Plane WHERE Id = {id}";

                databaseConnection.Open();
                IDataReader planeReader = selectPlaneCommand.ExecuteReader();

                if (planeReader.Read())
                {
                    Plane plane = new Plane
                    {
                        Id = planeReader.GetInt32(0),
                        RegistrationNumber = planeReader.GetString(1),
                        PlaneTypeId = planeReader.GetInt32(2)
                    };

                    return plane;
                }
            }

            return null;
        }

        public int Create(Plane plane)
        {
            using (DbConnection databaseConnection = new SqlConnection(this.ConnectionString))
            {
                IDbCommand createPlaneCommand = databaseConnection.CreateCommand();
                createPlaneCommand.CommandText =
                   $"INSERT INTO Plane VALUES ({plane.Id}, '{plane.RegistrationNumber}', {plane.PlaneTypeId});";

                Console.WriteLine(createPlaneCommand.CommandText);
                databaseConnection.Open();

                int rowCount = createPlaneCommand.ExecuteNonQuery();
                return rowCount;
            }
        }

        public int Update(Plane plane)
        {
            using (DbConnection databaseConnection = new SqlConnection(this.ConnectionString))
            {
                IDbCommand updatePlaneCommand = databaseConnection.CreateCommand();
                updatePlaneCommand.CommandText =
                   $"UPDATE Plane SET RegistrationNumber = '{plane.RegistrationNumber}', " +
                   $"PlaneTypeId = {plane.PlaneTypeId} " +
                   $"WHERE Id = {plane.Id};";

                Console.WriteLine(updatePlaneCommand.CommandText);
                databaseConnection.Open();

                int rowCount = updatePlaneCommand.ExecuteNonQuery();
                return rowCount;
            }
        }

        public int Delete(Plane plane)
        {
            return Delete(plane.Id);
        }

        public int Delete(int id)
        {
            using (DbConnection databaseConnection = new SqlConnection(this.ConnectionString))
            {
                IDbCommand deletePlaneCommand = databaseConnection.CreateCommand();
                deletePlaneCommand.CommandText = $"DELETE FROM Plane WHERE Id = {id};";

                Console.WriteLine(deletePlaneCommand.CommandText);
                databaseConnection.Open();

                int rowCount = deletePlaneCommand.ExecuteNonQuery();
                return rowCount;
            }
        }
    }
}