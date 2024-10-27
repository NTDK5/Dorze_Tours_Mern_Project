import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateTourForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    destination: '',
    price: '',
    duration: '',
    itinerary: [],
  });
  const [images, setImages] = useState([]);
  const [itineraryDay, setItineraryDay] = useState('');
  const [itineraryActivity, setItineraryActivity] = useState('');
  const [itineraryTime, setItineraryTime] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [itinerary, setItinerary] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleItineraryChange = (e) => {
    const { name, value } = e.target;
    if (name === 'day') setItineraryDay(value);
    if (name === 'activity') setItineraryActivity(value);
    if (name === 'time') setItineraryTime(value);
  };

  const addDay = () => {
    if (!itinerary.find((item) => item.day === Number(itineraryDay))) {
      setItinerary((prevItinerary) => [
        ...prevItinerary,
        {
          day: Number(itineraryDay),
          activities: [],
        },
      ]);
    }
    setItineraryDay('');
  };

  const addActivity = () => {
    const dayIndex = itinerary.findIndex(
      (item) => item.day === Number(selectedDay)
    );
    if (dayIndex > -1) {
      const updatedItinerary = [...itinerary];
      updatedItinerary[dayIndex].activities.push({
        time: itineraryTime,
        activity: itineraryActivity,
      });
      setItinerary(updatedItinerary);
    } else {
      toast.error('Please select a valid day to add activity.');
    }
    setItineraryActivity('');
    setItineraryTime('');
  };

  const deleteActivity = (day, activityIndex) => {
    setItinerary((prevItinerary) =>
      prevItinerary
        .map((item) =>
          item.day === day
            ? {
                ...item,
                activities: item.activities.filter(
                  (_, i) => i !== activityIndex
                ),
              }
            : item
        )
        .filter((item) => item.activities.length > 0)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('destination', formData.destination);
    data.append('price', formData.price);
    data.append('duration', formData.duration);
    data.append('itinerary', JSON.stringify(itinerary));

    // Append images
    Array.from(images).forEach((image) => {
      data.append('image', image);
    });

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/tours`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      toast.success('Tour created successfully');
    } catch (error) {
      console.error(
        'Error creating tour:',
        error.response?.data || error.message
      );
      toast.error('Failed to create tour');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg text-white shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Create Tour</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Tour Title"
            required
            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed description of the tour"
            required
            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Destination</label>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="Tour Destination"
            required
            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white"
          />
        </div>

        <div className="mb-4 flex space-x-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium mb-2">Price ($)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Tour Price"
              required
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium mb-2">Duration</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Duration (e.g., 3 days, 2 nights)"
              required
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white"
            />
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Itinerary</h3>
          <div className="flex space-x-4 mb-3">
            <input
              type="number"
              name="day"
              value={itineraryDay}
              onChange={handleItineraryChange}
              placeholder="Day"
              className="w-1/4 p-2 rounded-md bg-gray-700 border border-gray-600 text-white"
            />
            <button
              type="button"
              onClick={addDay}
              className="w-1/4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
            >
              Add Day
            </button>
          </div>
          <div className="mb-4 flex space-x-4">
            <select
              name="selectedDay"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-3/4 px-2 py-0 rounded-md bg-gray-700 border border-gray-600 text-white"
            >
              <option value="">Select Day</option>
              {itinerary.map((item, index) => (
                <option key={index} value={item.day}>
                  Day {item.day}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="activity"
              value={itineraryActivity}
              onChange={handleItineraryChange}
              placeholder="Activity"
              className="w-1/3 p-2 rounded-md bg-gray-700 border border-gray-600 text-white"
            />
            <input
              type="text"
              name="time"
              value={itineraryTime}
              onChange={handleItineraryChange}
              placeholder="Time"
              className="w-1/3 p-2 rounded-md bg-gray-700 border border-gray-600 text-white"
            />
            <button
              type="button"
              onClick={addActivity}
              className="w-3/4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white"
            >
              Add Activity
            </button>
          </div>
          <ul className="mt-4">
            {itinerary.map((item, index) => (
              <li key={index} className="mb-4">
                <h4 className="font-semibold">Day {item.day}</h4>
                <ul className="list-disc pl-5">
                  {item.activities.map((act, i) => (
                    <li key={i} className="flex justify-between items-center">
                      <span>
                        {act.activity} at {act.time}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteActivity(item.day, i)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>

        {/* Image Upload Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Upload Images
          </label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="block w-full text-white bg-gray-700 border border-gray-600 rounded-md p-2"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-bold"
        >
          Create Tour
        </button>
      </form>
    </div>
  );
};

export default CreateTourForm;
