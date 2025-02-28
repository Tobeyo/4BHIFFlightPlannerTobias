using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FlightPlanner.DataLayer;

namespace FlightPlanner.BusinessLogicLayer
{
    class BookingService
    {
        private readonly BookingDataMapper _bookingDataMapper;

        public BookingService(string connectionString)
        {
            _bookingDataMapper = new BookingDataMapper(connectionString);
        }

        public void CreateBooking(int flightId, int customerId, int seats, int travelClass, decimal price)
        {
            var booking = new Booking(flightId, customerId, seats, travelClass, price);
            _bookingDataMapper.Create(booking);
        }

        public Booking GetBooking(int flightId, int customerId)
        {
            var bookings = _bookingDataMapper.ReadBookings();
            return bookings.FirstOrDefault(b => b.FlightId == flightId && b.CustomerId == customerId);
        }

        public List<Booking> GetAllBookings()
        {
            return _bookingDataMapper.ReadBookings();
        }

        public void UpdateBooking(int flightId, int customerId, int seats, int travelClass, decimal price)
        {
            var booking = new Booking(flightId, customerId, seats, travelClass, price);
            _bookingDataMapper.Update(booking);
        }

        public void DeleteBooking(int flightId, int customerId)
        {
            _bookingDataMapper.Delete(flightId, customerId);
        }

        public void DeleteBookingsByFlightId(int flightId)
        {
            _bookingDataMapper.DeleteByFlightId(flightId);
        }
    }
}
