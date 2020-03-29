import React, {useState} from 'react';

import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import logoImg from '../../assets/logo.svg';

import api from '../../services/api';

import './styles.css';

export default function NovoCaso() {
  const history = useHistory();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  
  async function handleNovoCaso(e) {
    e.preventDefault();
    const ongId = localStorage.getItem('ongId');
    const data = {title, description, value};

    try {
      await api.post('incidents', data, {
        headers: {
          Authorization: ongId,
        }
      });
      
      history.push('/profile');
    } catch (error) {
      alert('Erro ao cadastrar caso, tente novamente');
    }
    
  }

  return (
    <div className="novo-caso-container">
      <div className="content">
        <section>
          <img src={logoImg} alt="Be The Hero"/>

          <h1>Cadastrar novo caso</h1>
          <p>
            Descreva o seu caso detalhadamente para encontrar um herói disposto
            a resolver isso.
          </p>

          <Link className="back-link" to="/profile">
            <FiArrowLeft size={16} color="#E02041"/>
            Voltar para a home.
          </Link>
        </section>
        <form onSubmit={handleNovoCaso}>
          <input 
            type="text" 
            placeholder="Titulo do caso"
            value = {title}
            onChange = {e => setTitle(e.target.value)} 
          />
          <textarea 
            placeholder="Descrição"
            value = {description}
            onChange = {e => setDescription(e.target.value)}
          />
          <input 
            placeholder="Valor em reais" 
            value = {value}
            onChange = {e => setValue(e.target.value)}
          />

          <button className="button" type="submit">Cadastrar</button>
        </form>
      </div>
  </div>
  );
}