import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';


const AddEmployeePage = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { t } = useTranslation();

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post("http://localhost:8080/employees/add", form);
      Swal.fire({
        icon: 'success',
        title: t('employee_added'),
        text: t('employee_addedText'),
      });
      setForm({ username: "", email: "", password: "" });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: t('failed'),
        text: t('failedtoadd'),
      });
    }    
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">{t('add_employee')}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block mb-1 font-medium">
          {t('username')}
          </label>
          <input
            id="username"
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 font-medium">
          {t('password')}
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {t('add_employee')}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center font-semibold">{message}</p>
      )}
    </div>
  );
};

export default AddEmployeePage;
