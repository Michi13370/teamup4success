import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function ProfilForm() {
  const [profile, setProfile] = useState({
    firstname: '',
    lastname: '',
    hourlyRate: '',
    availableTimes: [],
    subjectList: [] 
  });

  const [subjects, setSubjects] = useState([]);
  const [availableTimeInput, setAvailableTimeInput] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/subjects')
      .then(response => setSubjects(response.data))
      .catch(error => console.error('Error loading subjects:', error));
  }, []);

  const handleChange = (event) => {
    setProfile({ ...profile, [event.target.name]: event.target.value });
  };

  const handleSubjectChange = (event) => {
    const selectedSubjectIds = Array.from(event.target.selectedOptions, option => parseInt(option.value));
    setProfile({ ...profile, subjectList: selectedSubjectIds });
  };

  const handleAvailableTimeChange = (event) => {
    setAvailableTimeInput(event.target.value);
  };

  const handleAddAvailableTime = () => {
    if (availableTimeInput) {
      setProfile({
        ...profile,
        availableTimes: [...profile.availableTimes, availableTimeInput]
      });
      setAvailableTimeInput('');
    }
  };

  const handleRemoveAvailableTime = (indexToRemove) => {
    setProfile({
      ...profile,
      availableTimes: profile.availableTimes.filter((_, index) => index !== indexToRemove)
    });
  };

  const handleSubmit = (event) => {
  event.preventDefault();

  
  const hourlyRateAsNumber = parseFloat(profile.hourlyRate);

  const tutorData = {
    firstname: profile.firstname,
    lastname: profile.lastname,
    hourlyRate: hourlyRateAsNumber,
    availableTimes: profile.availableTimes,
    subjectList: profile.subjectList.map(id => ({ id })) 
  };

  console.log("Sending data:", tutorData); 

  axios.post('http://localhost:8080/tutors', tutorData)
    .then(response => {
      alert('Profil erfolgreich gespeichert!');
    })
    .catch(error => {
      console.error('Error saving profile:', error);
      alert('Fehler beim Speichern des Profils.');
    });
};


  return (
        <div className="form-container">
      <h1>Tutor erstellen</h1> 

    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstname">Vorname:</label>
          <input 
            type="text" 
            id="firstname" 
            name="firstname" 
            value={profile.firstname} 
            onChange={handleChange} 
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastname">Nachname:</label>
          <input 
            type="text" 
            id="lastname" 
            name="lastname" 
            value={profile.lastname} 
            onChange={handleChange} 
          />
        </div>

        <div className="form-group">
          <label htmlFor="hourlyRate">Stundensatz:</label>
          <input 
            type="number" 
            id="hourlyRate" 
            name="hourlyRate" 
            value={profile.hourlyRate} 
            onChange={handleChange} 
            step="0.01" 
          />
        </div>

        <div className="form-group">
          <label htmlFor="availableTime">Verfügbare Zeit hinzufügen (z.B. Monday 10am-12pm):</label>
          <input 
            type="text" 
            id="availableTime" 
            value={availableTimeInput} 
            onChange={handleAvailableTimeChange} 
          />
          <button type="button" onClick={handleAddAvailableTime}>Zeit hinzufügen</button>
        </div>

        <div className="form-group">
          <ul className="available-times-list">
            {profile.availableTimes.map((time, index) => (
              <li key={index}>{time} <button onClick={() => handleRemoveAvailableTime(index)}>Entfernen</button></li>
            ))}
          </ul>
        </div>

        <div className="form-group">
          <label>Fachgebiete:</label>
          <select multiple value={profile.subjectList} onChange={handleSubjectChange}>
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>{subject.subjectName}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <button type="submit">Profil speichern</button>
        </div>
      </form>
    </div>
  
  </div>
  );
}

export default ProfilForm;
