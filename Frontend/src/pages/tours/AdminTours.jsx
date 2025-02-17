import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTotalTours } from '../../services/tourApi';
import { FaSearch, FaEdit, FaTrash, FaPlusCircle } from 'react-icons/fa';
import Modal from '../../components/Modal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

const AdminToursPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    destination: '',
    price: '',
    duration: '',
    imageUrl: [],
    averageRating: 4.8,
    totalRatings: 1,
    itinerary: [],
  });
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      destination: '',
      price: '',
      duration: '',
      imageUrl: [],
      averageRating: 4.8,
      totalRatings: 1,
      itinerary: [],
    });
    setEditingTour(null);
  };
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('all');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['totalTours'],
    queryFn: fetchTotalTours,
  });

  const deleteTour = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/tours/${id}`, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['totalTours']);
      toast.success('Tour deleted successfully');
    },
  });

  const updateTourMutation = useMutation({
    mutationFn: async (updatedTour) => {
      const formData = new FormData();

      // Separate existing URLs and new files
      const existingImages = updatedTour.imageUrl.filter(img => typeof img === 'string');
      const newImages = updatedTour.imageUrl.filter(img => img instanceof File);
      newImages.forEach(file => formData.append('image', file));

      formData.append('data', JSON.stringify({
        ...updatedTour,
        imageUrl: existingImages, // Preserve existing URLs
        clearExistingImages: newImages.length > 0 // Only clear when adding new images
      }));

      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/tours/${updatedTour._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['totalTours']);
      toast.success('Tour updated successfully');
      setIsModalOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error updating tour');
    },
  });


  const handleEdit = (tour) => {
    setEditingTour(tour);
    setFormData({
      title: tour.title,
      description: tour.description,
      destination: tour.destination,
      price: tour.price,
      duration: tour.duration,
      imageUrl: tour.imageUrl,
      averageRating: tour.averageRating,
      totalRatings: tour.totalRatings,
      itinerary: tour.itinerary,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this tour?')) {
      deleteTour.mutate(id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingTour) {
      updateTourMutation.mutate({ ...formData, _id: editingTour._id });
    } else {
      // Handle creating a new tour if needed
    }
  };

  const filteredTours = data?.filter((tour) => {
    const matchesSearch =
      tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.destination.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDestination = selectedDestination === 'all' || tour.destination === selectedDestination;

    return matchesSearch && matchesDestination;
  });

  const destinations = [...new Set(data?.map(tour => tour.destination) || [])];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center p-4">
        Error fetching tour data
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">Tour Management</h1>
        <button
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          onClick={() => navigate('/admin/create_tour')}
        >
          <FaPlusCircle className="mr-2" />
          Create New Tour
        </button>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tours..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedDestination}
          onChange={(e) => setSelectedDestination(e.target.value)}
        >
          <option value="all">All Destinations</option>
          {destinations.map((destination) => (
            <option key={destination} value={destination}>
              {destination}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tour</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Destination</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredTours?.map((tour) => (
              <tr key={tour._id} className="hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {tour.imageUrl && tour.imageUrl.length > 0 ? (
                      <img
                        src={`${process.env.REACT_APP_API_URL}/${tour.imageUrl[0].replace(/\\/g, '/')}`}
                        alt={tour.title}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-gray-600 flex items-center justify-center">
                        <span className="text-white text-xs">No img</span>
                      </div>
                    )}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">{tour.title}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {tour.destination}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  ${tour.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {tour.duration} days
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(tour)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <FaEdit className="text-xl" />
                  </button>
                  <button
                    className="text-red-400 hover:text-red-500"
                    onClick={() => handleDelete(tour._id)}
                  >
                    <FaTrash className="text-xl" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => {
        setIsModalOpen(false);
        resetForm();
      }}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-bold mb-4">
            {editingTour ? 'Edit Tour' : 'Add New Tour'}
          </h2>

          {/* Form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Tour Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Destination"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Price (USD)"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Duration (e.g., 1 day, 3 days)"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <div className="md:col-span-2">
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded h-32"
                required
              />
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tour Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, imageUrl: Array.from(e.target.files) })}
                className="w-full p-2 border rounded"
                required={!editingTour}
              />
            </div>

            {/* Itinerary Section */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Itinerary</label>
              {formData.itinerary.map((day, index) => (
                <div key={index} className="p-2 border rounded mb-2">
                  <input
                    type="number"
                    placeholder="Day Number"
                    value={day.day}
                    onChange={(e) => {
                      const updatedItinerary = [...formData.itinerary];
                      updatedItinerary[index].day = e.target.value;
                      setFormData({ ...formData, itinerary: updatedItinerary });
                    }}
                    className="w-full p-2 border rounded mb-2"
                    required
                  />
                  {day.activities.map((activity, actIndex) => (
                    <div key={actIndex} className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Time (e.g., 09:00 AM)"
                        value={activity.time}
                        onChange={(e) => {
                          const updatedItinerary = [...formData.itinerary];
                          updatedItinerary[index].activities[actIndex].time = e.target.value;
                          setFormData({ ...formData, itinerary: updatedItinerary });
                        }}
                        className="w-1/3 p-2 border rounded"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Activity"
                        value={activity.activity}
                        onChange={(e) => {
                          const updatedItinerary = [...formData.itinerary];
                          updatedItinerary[index].activities[actIndex].activity = e.target.value;
                          setFormData({ ...formData, itinerary: updatedItinerary });
                        }}
                        className="w-2/3 p-2 border rounded"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updatedItinerary = [...formData.itinerary];
                          updatedItinerary[index].activities.splice(actIndex, 1);
                          setFormData({ ...formData, itinerary: updatedItinerary });
                        }}
                        className="text-red-500 text-lg"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const updatedItinerary = [...formData.itinerary];
                      updatedItinerary[index].activities.push({ time: '', activity: '' });
                      setFormData({ ...formData, itinerary: updatedItinerary });
                    }}
                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    + Add Activity
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, itinerary: [...formData.itinerary, { day: '', activities: [] }] });
                }}
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
              >
                + Add Day
              </button>
            </div>
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              className="px-4 py-2 text-gray-600 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {editingTour ? 'Update Tour' : 'Add Tour'}
            </button>
          </div>
        </form>
      </Modal>
      <Toaster position="top-right" />
    </div>
  );
};

export default AdminToursPage;
