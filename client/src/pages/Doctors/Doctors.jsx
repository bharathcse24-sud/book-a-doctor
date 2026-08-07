import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DoctorCard from '../../components/DoctorCard/DoctorCard';
import { getDoctors } from '../../services/api';
import './Doctors.css';

const SPECIALTIES = ['All', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'Ophthalmology', 'Dentistry', 'General'];

const Doctors = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeSpecialty, setActiveSpecialty] = useState(searchParams.get('specialty') || 'All');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const params = {};
        if (activeSpecialty !== 'All') params.specialty = activeSpecialty;
        if (search) params.search = search;
        const { data } = await getDoctors(params);
        setDoctors(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [activeSpecialty, search]);

  const handleSpecialty = (s) => {
    setActiveSpecialty(s);
    if (s !== 'All') setSearchParams({ specialty: s });
    else setSearchParams({});
  };

  const sorted = [...doctors].sort((a, b) => {
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'fees_asc') return a.fees - b.fees;
    if (sortBy === 'fees_desc') return b.fees - a.fees;
    if (sortBy === 'experience') return b.experience - a.experience;
    return 0;
  });

  return (
    <div className="doctors-page page-content">
      <div className="container">
        {/* Header */}
        <div className="doctors-header">
          <div>
            <h1 className="doctors-title">Find Your Doctor</h1>
            <p className="doctors-subtitle">Browse {doctors.length} verified specialists</p>
          </div>
          <select id="sort-doctors" className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="rating">Sort: Best Rating</option>
            <option value="experience">Sort: Experience</option>
            <option value="fees_asc">Sort: Fees Low → High</option>
            <option value="fees_desc">Sort: Fees High → Low</option>
          </select>
        </div>

        {/* Search Bar */}
        <div className="doctors-search-bar">
          <span className="search-icon">🔍</span>
          <input
            id="doctor-search"
            type="text"
            placeholder="Search doctors by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && <button className="clear-search" onClick={() => setSearch('')}>✕</button>}
        </div>

        {/* Specialty Filter */}
        <div className="specialty-filters">
          {SPECIALTIES.map((s) => (
            <button
              key={s}
              className={`specialty-filter-btn ${activeSpecialty === s ? 'active' : ''}`}
              onClick={() => handleSpecialty(s)}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div className="spinner-container"><div className="spinner" /></div>
        ) : sorted.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🩺</div>
            <h3>No Doctors Found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="doctors-grid">
            {sorted.map((doc) => (
              <DoctorCard key={doc._id} doctor={doc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;
