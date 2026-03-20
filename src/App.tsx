import { useState, useEffect, useMemo } from 'react';
import { DEFAULT_UNIT_TIERS, type Unit } from './units';
import { LegendContent } from './components/Legend';
import { HowToUse } from './components/HowToUse';

type UnitStatus = {
  owned: boolean;
  maxed: boolean;
  mastery: boolean;
  favorite: boolean;
};

function App() {
  const [selectedUnits, setSelectedUnits] = useState<Record<string, UnitStatus>>(() => {
    // Initialize state from local storage on first render
    const savedData = localStorage.getItem('cb-unit-picker-save');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        console.error("Failed to parse saved unit data:", e);
      }
    }
    return {};
  });
  
  const [copyFeedback, setCopyFeedback] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Memoize the filtered and sorted unit list so it only recalculates when the search term changes.
  // This drastically improves performance since it won't re-sort on every checkbox toggle!
  const filteredTiers = useMemo(() => {
    const result: [string, Unit[]][] = [];
    const lowerSearch = searchTerm.toLowerCase();

    Object.entries(DEFAULT_UNIT_TIERS).forEach(([tier, units]) => {
      let sortedUnits = [...units].sort((a, b) => a.name.localeCompare(b.name));
      
      if (lowerSearch) {
        sortedUnits = sortedUnits.filter(u => u.name.toLowerCase().includes(lowerSearch));
      }

      if (sortedUnits.length > 0) {
        result.push([tier, sortedUnits]);
      }
    });

    return result;
  }, [searchTerm]);

  // Save to local storage whenever selectedUnits changes
  useEffect(() => {
    localStorage.setItem('cb-unit-picker-save', JSON.stringify(selectedUnits));
  }, [selectedUnits]);

  const toggleStatus = (unitName: string, field: keyof UnitStatus) => {
    setSelectedUnits(prev => {
      const current = prev[unitName] || { owned: false, maxed: false, mastery: false, favorite: false };

      const updated = { ...current, [field]: !current[field] };

      // If Maxed, Mastery, or Favorite is selected, the unit must be owned
      if ((field === 'maxed' || field === 'mastery' || field === 'favorite') && updated[field]) {
        updated.owned = true;
      }

      // If Mastery is selected, it automatically becomes Maxed as well
      if (field === 'mastery' && updated[field]) {
        updated.maxed = true;
      }

      // If Owned is deselected, clear all other statuses
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

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all your saved selections? This cannot be undone.")) {
      setSelectedUnits({});
    }
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

        {/* Add the legend at the top as well, with some margin */}
        <div style={{ marginTop: '25px' }}>
          <LegendContent />
        </div>
      </header>

      <div className="search-container">
        <HowToUse />
        <div className="search-wrapper" title="Search Unit">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="unit-list">
        {filteredTiers.map(([tier, sortedUnits]) => {
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
                        onChange={() => { }}
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
        {/* Use the same LegendContent down here */}
        <LegendContent />

        <div className="footer-buttons" style={{ display: 'flex', gap: '15px' }}>
          <button className="clear-btn" onClick={handleClear}>
            Clear All
          </button>
          
          <button className="copy-btn" onClick={handleCopy}>
            Copy Form Code
          </button>
        </div>
        
        {copyFeedback && <span className="feedback">{copyFeedback}</span>}
      </div>
    </div>
  );
}

export default App;