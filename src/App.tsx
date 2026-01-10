import { useState } from 'react';
import { DEFAULT_UNIT_TIERS } from './units';

type UnitStatus = {
  owned: boolean;
  maxed: boolean;
  mastery: boolean;
  favorite: boolean;
};

function App() {
  const [selectedUnits, setSelectedUnits] = useState<Record<string, UnitStatus>>({});
  const [copyFeedback, setCopyFeedback] = useState("");

  const toggleStatus = (unitName: string, field: keyof UnitStatus) => {
    setSelectedUnits(prev => {
      const current = prev[unitName] || { owned: false, maxed: false, mastery: false, favorite: false };
      
      const updated = { ...current, [field]: !current[field] };
      
      // Om man väljer Maxed, Mastery eller Favorite, måste man äga enheten
      if ((field === 'maxed' || field === 'mastery' || field === 'favorite') && updated[field]) {
        updated.owned = true;
      }

      // NYTT: Om man väljer Mastery, så blir den automatiskt Maxed också
      if (field === 'mastery' && updated[field]) {
        updated.maxed = true;
      }
      
      // Om man avmarkerar Owned, rensa allt annat
      if (field === 'owned' && !updated.owned) {
        updated.maxed = false;
        updated.mastery = false;
        updated.favorite = false;
      }

      return { ...prev, [unitName]: updated };
    });
  };

  const generateImportString = () => {
    const NAME_WIDTH = 30;
    const padRight = (str: string, length: number) => str.padEnd(length, ' ');
    
    let formText = `Generated Unit List\n\n`;

    Object.entries(DEFAULT_UNIT_TIERS).forEach(([tier, units]) => {
      const sortedUnits = [...units].sort((a, b) => a.name.localeCompare(b.name));
      
      formText += `--- ${tier} ---\n`;
      sortedUnits.forEach(unit => {
        const status = selectedUnits[unit.name] || { owned: false, maxed: false, mastery: false, favorite: false };
        formText += `${padRight(unit.name, NAME_WIDTH)} - ✅ Owned: [${status.owned ? 'x' : ' '}]  🌟 Maxed: [${status.maxed ? 'x' : ' '}]  👑 Mastery: [${status.mastery ? 'x' : ' '}]  ❤️ Favorite: [${status.favorite ? 'x' : ' '}]\n`;
      });
      formText += `\n`;
    });

    return formText;
  };

  const handleCopy = () => {
    const text = generateImportString();
    navigator.clipboard.writeText(text);
    setCopyFeedback("Copied to clipboard!");
    setTimeout(() => setCopyFeedback(""), 3000);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Conqueror's Blade Unit Picker</h1>
        <p>
          Click on a unit to mark as <b>Owned</b>. Use the icons to set specific status.
          <br />
          <span style={{ opacity: 0.8, fontSize: '0.9em' }}>
            When done, click <b>Copy Form Code</b> below and paste the result into a DM to me.
          </span>
        </p>
      </header>

      <div className="unit-list">
        {Object.entries(DEFAULT_UNIT_TIERS).map(([tier, units]) => {
           const sortedUnits = [...units].sort((a, b) => a.name.localeCompare(b.name));
           return (
            <div key={tier} className="tier-section">
              <div className={`tier-header ${tier}`}>
                <h3>{tier}</h3>
              </div>
              <div className="tier-grid">
                {sortedUnits.map(unit => {
                  const status = selectedUnits[unit.name] || { owned: false, maxed: false, mastery: false, favorite: false };
                  return (
                    <div 
                      key={unit.name} 
                      className={`unit-row ${status.owned ? 'is-owned' : ''}`}
                      onClick={() => toggleStatus(unit.name, 'owned')} 
                      title="Click to mark as Owned"
                    >
                      {/* Favorite Star */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleStatus(unit.name, 'favorite'); }}
                        className={`star-btn ${status.favorite ? 'active' : ''}`}
                        title="Mark as Favorite"
                      >
                        ★
                      </button>

                      {/* Mastery Box (Square) */}
                      <div 
                        onClick={(e) => { e.stopPropagation(); toggleStatus(unit.name, 'mastery'); }}
                        className={`mastery-btn ${status.mastery ? 'active' : ''}`}
                        title="Unit has Full Mastery"
                      ></div>

                      {/* Maxed Circle (Round) */}
                      <div 
                        onClick={(e) => { e.stopPropagation(); toggleStatus(unit.name, 'maxed'); }}
                        className={`maxed-btn ${status.maxed ? 'active' : ''}`}
                        title="Unit is Max Level"
                      ></div>

                      {/* Owned Checkbox */}
                      <input 
                        type="checkbox" 
                        className="owned-checkbox"
                        checked={status.owned} 
                        onChange={() => {}} 
                        tabIndex={-1}
                      />
                      
                      <span className="unit-name">{unit.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="footer-bar">
        <div className="legend">
           <div className="legend-item">
             <input type="checkbox" className="owned-checkbox" checked readOnly style={{cursor:'default'}} /> Owned
           </div>
           <div className="legend-item">
             <span style={{color: '#facc15', fontSize: '1.2em', lineHeight: 0.8}}>★</span> Favorite
           </div>
           <div className="legend-item">
             <div className="mastery-btn active" style={{width:12, height:12, cursor:'default'}}></div> Mastery
           </div>
           <div className="legend-item">
             <div className="maxed-btn active" style={{width:12, height:12, cursor:'default'}}></div> Maxed
           </div>
        </div>
        <button className="copy-btn" onClick={handleCopy}>
          Copy Form Code
        </button>
        {copyFeedback && <span className="feedback">{copyFeedback}</span>}
      </div>
    </div>
  );
}

export default App;