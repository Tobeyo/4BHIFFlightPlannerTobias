using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Data;
using System.Data.SqlClient;
using System.Data.Common;

namespace FlightPlanner.DataLayer
{
    // Implement operations that affect several tables (e.g. deleting a flight affects also the Booking table)
    class PlaneRepository
    {
        private PlaneDataMapper PlaneDataMapper;
        private PilotDataMapper PilotDataMapper;
        private FlightDataMapper FlightDataMapper;
        // TODO: add other data mappers
        string ConnectionString { get; set; }

        public PlaneRepository(string connectionString)
        {
            this.ConnectionString = connectionString;
            PlaneDataMapper = new PlaneDataMapper(this.ConnectionString);
            PilotDataMapper = new PilotDataMapper(this.ConnectionString);
        }

        public void DeletPlane(int id)
        {
            int rowCount = Int32.MinValue;
            try
            {
                rowCount = PlaneDataMapper.Delete(id);
                //FlightDataMapper.Delete(DELETE from Flight where FLight.PlaneID = id );
            }
            catch (DbException dbEx) // TODO: review and improve exception handling
            {
                // TODO: log to log file
                throw new InvalidOperationException("Flight could not be deleted!", dbEx);
            }
            catch (Exception)
            {
                // TODO: log to log file
                throw;
            }

            if (rowCount < 1)
            {
                throw new InvalidOperationException("The specified flight could not be deleted.");
            }
        }

    }
}