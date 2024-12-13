using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;

namespace FlightPlanner.DataLayer
{
    class PilotDataMapper
    {
        public string ConnectionString { get; set; }

        public PilotDataMapper(string connectionString)
        {
            this.ConnectionString = connectionString;
        }

        private Dictionary<string, object> ParseRecord(IDataReader reader)
        {
            var result = new Dictionary<string, object>();
            for (int i = 0; i < reader.FieldCount; i++)
            {
                result[reader.GetName(i)] = reader.GetValue(i);
            }
            return result;
        }

        private List<Dictionary<string, object>> ReadPilots(string sqlCommandText)
        {
            var pilots = new List<Dictionary<string, object>>();

            using (DbConnection databaseConnection = new SqlConnection(this.ConnectionString))
            {
                IDbCommand command = databaseConnection.CreateCommand();
                command.CommandText = sqlCommandText;

                databaseConnection.Open();
                using (IDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        pilots.Add(ParseRecord(reader));
                    }
                }
            }

            return pilots;
        }

        public List<Dictionary<string, object>> GetAllPilots()
        {
            return ReadPilots("SELECT * FROM Pilots;");
        }

        public Dictionary<string, object> GetPilotById(int pilotId)
        {
            string sqlCommandText = $"SELECT * FROM Pilots WHERE PilotId = {pilotId};";
            var pilots = ReadPilots(sqlCommandText);
            return pilots.Count > 0 ? pilots[0] : null;
        }

        public void AddPilot(string firstName, string lastName, string licenseNumber)
        {
            using (DbConnection databaseConnection = new SqlConnection(this.ConnectionString))
            {
                IDbCommand command = databaseConnection.CreateCommand();
                command.CommandText = "INSERT INTO Pilots (FirstName, LastName, LicenseNumber) VALUES (@FirstName, @LastName, @LicenseNumber)";

                var param = command.CreateParameter();
                param.ParameterName = "@FirstName";
                param.Value = firstName;
                command.Parameters.Add(param);

                param = command.CreateParameter();
                param.ParameterName = "@LastName";
                param.Value = lastName;
                command.Parameters.Add(param);

                param = command.CreateParameter();
                param.ParameterName = "@LicenseNumber";
                param.Value = licenseNumber;
                command.Parameters.Add(param);

                databaseConnection.Open();
                command.ExecuteNonQuery();
            }
        }

        public void DeletePilot(int pilotId)
        {
            using (DbConnection databaseConnection = new SqlConnection(this.ConnectionString))
            {
                IDbCommand command = databaseConnection.CreateCommand();
                command.CommandText = $"DELETE FROM Pilots WHERE PilotId = {pilotId};";

                databaseConnection.Open();
                command.ExecuteNonQuery();
            }
        }
    }
}