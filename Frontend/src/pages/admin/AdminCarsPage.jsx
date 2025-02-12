import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { Toaster, toast } from 'react-hot-toast';
import Modal from '../../components/Modal';

const AdminCarsPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCar, setEditingCar] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        model: '',
        year: '',
        transmission: 'Manual',
        fuelType: 'Petrol',
        seats: '',
        pricePerDay: '',
        description: '',
        images: [],
        features: [],
        available: true
    });

    const queryClient = useQueryClient();

    const { data: cars } = useQuery({
        queryKey: ['cars'],
        queryFn: async () => {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/cars`);
            return data;
        },
    });

    const createCarMutation = useMutation({
        mutationFn: async (newCar) => {
            const formData = new FormData();
            Object.keys(newCar).forEach(key => {
                if (key === 'images') {
                    newCar.images.forEach(image => {
                        formData.append('images', image);
                    });
                } else if (key === 'features') {
                    formData.append('features', JSON.stringify(newCar.features));
                } else {
                    formData.append(key, newCar[key]);
                }
            });

            const { data } = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/cars`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                }
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['cars']);
            toast.success('Car created successfully');
            setIsModalOpen(false);
            resetForm();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Error creating car');
        },
    });

    const deleteCarMutation = useMutation({
        mutationFn: async (carId) => {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/cars/${carId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['cars']);
            toast.success('Car deleted successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Error deleting car');
        },
    });

    const updateCarMutation = useMutation({
        mutationFn: async (updatedCar) => {
            const formData = new FormData();
            Object.keys(updatedCar).forEach(key => {
                if (key === 'images') {
                    if (updatedCar.images.length > 0) {
                        updatedCar.images.forEach(image => {
                            formData.append('images', image);
                        });
                    }
                } else if (key === 'features') {
                    formData.append('features', JSON.stringify(updatedCar.features));
                } else {
                    formData.append(key, updatedCar[key]);
                }
            });

            const { data } = await axios.put(
                `${process.env.REACT_APP_API_URL}/api/cars/${updatedCar._id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    withCredentials: true,
                }
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['cars']);
            toast.success('Car updated successfully');
            setIsModalOpen(false);
            resetForm();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Error updating car');
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCar) {
            updateCarMutation.mutate({ ...formData, _id: editingCar._id });
        } else {
            createCarMutation.mutate(formData);
        }
    };

    const handleDelete = (carId) => {
        if (window.confirm('Are you sure you want to delete this car?')) {
            deleteCarMutation.mutate(carId);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            brand: '',
            model: '',
            year: '',
            transmission: 'Manual',
            fuelType: 'Petrol',
            seats: '',
            pricePerDay: '',
            description: '',
            images: [],
            features: [],
            available: true
        });
        setEditingCar(null);
    };

    const handleEdit = (car) => {
        setEditingCar(car);
        setFormData({
            name: car.name,
            brand: car.brand,
            model: car.model,
            year: car.year,
            transmission: car.transmission,
            fuelType: car.fuelType,
            seats: car.seats,
            pricePerDay: car.pricePerDay,
            description: car.description,
            features: car.features,
            available: car.available,
            images: [] // Keep empty for now, will only update if new images are selected
        });
        setIsModalOpen(true);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Cars</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <FaPlus /> Add New Car
                </button>
            </div>

            {/* Cars Table */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Car
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Details
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {cars?.map((car) => (
                            <tr key={car._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            <img
                                                className="h-10 w-10 rounded-full object-cover"
                                                src={`${process.env.REACT_APP_API_URL}/${car.images[0]}`}
                                                alt={car.name}
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {car.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {car.brand} {car.model}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {car.transmission} | {car.fuelType}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {car.seats} Seats | {car.year}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        ${car.pricePerDay}/day
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${car.available
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {car.available ? 'Available' : 'Unavailable'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(car)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        <FaEdit className="text-xl" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(car._id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <FaTrash className="text-xl" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Car Modal */}
            <Modal isOpen={isModalOpen} onClose={() => {
                setIsModalOpen(false);
                resetForm();
            }}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-xl font-bold mb-4">
                        {editingCar ? 'Edit Car' : 'Add New Car'}
                    </h2>

                    {/* Form fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Brand"
                            value={formData.brand}
                            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Model"
                            value={formData.model}
                            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Year"
                            value={formData.year}
                            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <select
                            value={formData.transmission}
                            onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="Manual">Manual</option>
                            <option value="Automatic">Automatic</option>
                        </select>
                        <select
                            value={formData.fuelType}
                            onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="Petrol">Petrol</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Electric">Electric</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                        <input
                            type="number"
                            placeholder="Number of Seats"
                            value={formData.seats}
                            onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Price Per Day"
                            value={formData.pricePerDay}
                            onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                placeholder="Features (comma-separated)"
                                value={formData.features.join(', ')}
                                onChange={(e) => setFormData({ ...formData, features: e.target.value.split(',').map(f => f.trim()) })}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <textarea
                                placeholder="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full p-2 border rounded h-32"
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Car Images
                            </label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => setFormData({ ...formData, images: Array.from(e.target.files) })}
                                className="w-full p-2 border rounded"
                                required={!editingCar}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={formData.available}
                                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                                    className="rounded border-gray-300"
                                />
                                <span>Available for Rent</span>
                            </label>
                        </div>
                    </div>

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
                            {editingCar ? 'Update Car' : 'Add Car'}
                        </button>
                    </div>
                </form>
            </Modal>

            <Toaster position="top-right" />
        </div>
    );
};

export default AdminCarsPage; 