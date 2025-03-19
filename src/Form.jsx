import supabase from './supabase-client';
import { useState } from 'react';

function Form({ metrics }) {
    const [newDeal, setNewDeal] = useState({name: 'Sandra'});


    async function addDeal() {
      try {
        const { error } = await supabase
          .from('ProjectMetrics')
          .insert(newDeal);
        if (error) {
          throw error;
        }
      } catch (error) {
        console.error("Error adding deal: ", error);
      }  
    }
    
      const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setNewDeal(values => ({...values, [name]: value}))
      }
    
      const handleSubmit = (event) => {
        event.preventDefault();
        console.log(newDeal);
        addDeal();
        setNewDeal({ name: 'Sandra', value: '' });
      }

      const generateNameOptions = () => {
        return metrics.map((metric) => (
          <option key={metric.name} value={metric.name}>
            {metric.name}
          </option>
        ));
      };

      return (
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <label>Name:
              <select value={newDeal.name} onChange={handleChange} name="name">
                {generateNameOptions()}
              </select>
            </label>
            <label>Amount: $
              <input 
                type="text" 
                name="value"
                value={newDeal.value || ""}
                onChange={handleChange}
                className="amount-input" 
              />
            </label>
            <button>Add Deal</button>
          </form>
        </div>
      );
    }
    
    export default Form;