using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Data.Common;

namespace FlightPlanner.DataLayer
{
    class PilotDataMapper
    {
        public string ConnectionString { get; set; }

        public PilotDataMapper(string connectionString)
        {
            this.ConnectionString = connectionString;
        }

        public List<Pilot> ReadPilots()
        {
            List<Pilot> pilots = new List<Pilot>();
    
            using (DbConnection databaseConnection = new SqlConnection(this.ConnectionString))
            {
                IDbCommand selectPilotCommand = databaseConnection.CreateCommand();
                selectPilotCommand.CommandText = "SELECT * FROM Pilot";

                databaseConnection.Open();
                IDataReader pilotReader = selectPilotCommand.ExecuteReader();

                while (pilotReader.Read())
                {
                    Pilot pilot = new Pilot();
                    pilot.Id = pilotReader.GetInt32(0); // Column 0: Id
                    pilot.FirstName = pilotReader.GetString(1); // Column 1: FirstName
                    pilot.LastName = pilotReader.GetString(2); // Column 2: LastName
                    pilot.ExperienceYears = pilotReader.GetInt32(3); // Column 3: ExperienceYears

                    pilots.Add(pilot);
                }

                return pilots;
            }
        }

        public Pilot Read(int id)
        {
            using (DbConnection databaseConnection = new SqlConnection(this.ConnectionString))
            {
                IDbCommand selectPilotCommand = databaseConnection.CreateCommand();
                selectPilotCommand.CommandText = $"SELECT * FROM Pilot WHERE Id = {id}";

                databaseConnection.Open();
                IDataReader pilotReader = selectPilotCommand.ExecuteReader();

                if (pilotReader.Read())
                {
                    Pilot pilot = new Pilot
                    {
                        Id = pilotReader.GetInt32(0),
                        FirstName = pilotReader.GetString(1),
                        LastName = pilotReader.GetString(2),
                        ExperienceYears = pilotReader.GetInt32(3)
                    };

                    return pilot;
                }
            }

            return null;
        }

        public int Create(Pilot pilot)
        {
            using (DbConnection databaseConnection = new SqlConnection(this.ConnectionString))
            {
                IDbCommand createPilotCommand = databaseConnection.CreateCommand();
                createPilotCommand.CommandText =
                   $"INSERT INTO Pilot VALUES ({pilot.Id}, '{pilot.FirstName}', '{pilot.LastName}', {pilot.ExperienceYears});";
                
                
                // 1. create a command object identifying the stored procedure
                IDbCommand command = databaseConnection.CreateCommand();
                command.CommandText = "dbo.BookFlight";

                // 2. tell the command object to execute a stored procedure
                command.CommandType = CommandType.StoredProcedure;

                // 3. add parameter to command, which will be passed to the stored procedure
                IDbDataParameter param;

                param = command.CreateParameter();
                param.ParameterName = "@FlightId";
                param.DbType = DbType.Int32;
                param.Value = pilot.Id;
                param.Direction = ParameterDirection.Input;
                command.Parameters.Add(param);

                param = command.CreateParameter();
                param.ParameterName = "@CustomerId";
                param.DbType = DbType.Int32;
                param.Value = pilot.FirstName;
                param.Direction = ParameterDirection.Input;
                command.Parameters.Add(param);

                param = command.CreateParameter();
                param.ParameterName = "@Seats";
                param.DbType = DbType.Int32;
                param.Value = pilot.LastName;
                param.Direction = ParameterDirection.Input;
                command.Parameters.Add(param);

                param = command.CreateParameter();
                param.ParameterName = "@TravelClass";
                param.DbType = DbType.Int32;
                param.Value = pilot.ExperienceYears;
                param.Direction = ParameterDirection.Input;
                command.Parameters.Add(param);

                IDbDataParameter returnValue;
                returnValue = command.CreateParameter();
                returnValue.ParameterName = "@ReturnValue";
                returnValue.DbType = DbType.Int32;
                returnValue.Direction = ParameterDirection.ReturnValue;
                command.Parameters.Add(returnValue);

                databaseConnection.Open();
                
                Console.WriteLine(createPilotCommand.CommandText);
                databaseConnection.Open();

                int rowCount = createPilotCommand.ExecuteNonQuery();
                return rowCount;
            }
        }

        public int Update(Pilot pilot)
        {
            using (DbConnection databaseConnection = new SqlConnection(this.ConnectionString))
            {
                IDbCommand updatePilotCommand = databaseConnection.CreateCommand();
                updatePilotCommand.CommandText =
                   $"UPDATE Pilot SET FirstName = '{pilot.FirstName}', " +
                   $"LastName = '{pilot.LastName}', " +
                   $"ExperienceYears = {pilot.ExperienceYears} " +
                   $"WHERE Id = {pilot.Id};";

                Console.WriteLine(updatePilotCommand.CommandText);
                databaseConnection.Open();

                int rowCount = updatePilotCommand.ExecuteNonQuery();
                return rowCount;
            }
        }

        public int Delete(Pilot pilot)
        {
            return Delete(pilot.Id);
        }

        public int Delete(int id)
        {
            using (DbConnection databaseConnection = new SqlConnection(this.ConnectionString))
            {
                IDbCommand deletePilotCommand = databaseConnection.CreateCommand();
                deletePilotCommand.CommandText = $"DELETE FROM Pilot WHERE Id = {id};";

                Console.WriteLine(deletePilotCommand.CommandText);
                databaseConnection.Open();

                int rowCount = deletePilotCommand.ExecuteNonQuery();
                return rowCount;
            }
        }
    }
}