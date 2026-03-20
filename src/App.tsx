import { useState } from 'react';
import { DEFAULT_UNIT_TIERS } from './units';

type UnitStatus = {
  owned: boolean;
  maxed: boolean;
  mastery: boolean;
  favorite: boolean;
};

// Extracted Legend component to avoid code duplication and prevent nested component renders
const LegendContent = () => (
  <div className="legend">
    <div className="legend-item">
      <span style={{ color: '#facc15', fontSize: '1.2em', lineHeight: 0.8 }}>★</span> Favorite
    </div>
    <div className="legend-item">
      <div className="mastery-btn active" style={{ width: 12, height: 12, cursor: 'default' }}></div> Mastery
    </div>
    <div className="legend-item">
      <div className="maxed-btn active" style={{ width: 12, height: 12, cursor: 'default' }}></div> Maxed
    </div>
    <div className="legend-item">
      <input type="checkbox" className="owned-checkbox" checked readOnly style={{ cursor: 'default' }} /> Owned
    </div>
  </div>
);

const HowToUse = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="how-to-use-wrapper">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`how-to-use-btn ${isOpen ? 'active' : ''}`}
      >
        How to Use <span>{isOpen ? '▲' : '▼'}</span>
      </button>
      
      {isOpen && (
        <div className="how-to-use-dropdown">
          <div className="how-to-use-content">
            <ul>
              <li>
                <strong>Favorite</strong> <span className="star-btn active" style={{ display: 'inline-block', verticalAlign: 'middle', cursor: 'default', margin: '0 2px' }}>★</span>: Use this to highlight your absolute favorite units—the ones you enjoy using the most or consider your "go-to" units for your Warband.
              </li>
              <li style={{ marginTop: '10px' }}>
                <strong>Mastery</strong> <div className="mastery-btn active" style={{ display: 'inline-block', verticalAlign: 'middle', cursor: 'default', margin: '0 4px' }}></div>: This indicates the unit has its specific Mastery Tree fully unlocked.
                <ul style={{ marginTop: '5px', marginBottom: '5px' }}>
                  <li><strong>How to check:</strong> Click on the unit in your Barracks, then click the <strong>"Leveling Up"</strong> button. If the unit has Mastery available, a dedicated <strong>Mastery box</strong> will appear here. If you don't see this box, the unit does not currently have a Mastery Tree in the game.</li>
                  <li><em>Note: This is separate from Veterancy lines and Doctrines.</em></li>
                </ul>
              </li>
              <li style={{ marginTop: '10px' }}>
                <strong>Max Level</strong> <div className="maxed-btn active" style={{ display: 'inline-block', verticalAlign: 'middle', cursor: 'default', margin: '0 4px' }}></div>: The unit has reached its maximum level. (You can verify this by checking if the level bar under the unit's name in the Barracks is completely filled and glowing.)
              </li>
              <li style={{ marginTop: '10px' }}>
                <strong>Owned</strong> <input type="checkbox" className="owned-checkbox" checked readOnly style={{ cursor: 'default', verticalAlign: 'middle', margin: '0 4px' }} title="Owned Status" />: Mark this if you have the unit unlocked in your Barracks.
              </li>
            </ul>

            <h3 style={{ marginTop: '20px', marginBottom: '10px', fontSize: '1.1rem', color: '#f3f4f6' }}>App Logic & Tips:</h3>
            <ul>
              <li>
                <strong>Smart Selection:</strong>
                <ul>
                  <li>Marking a unit as <strong>Maxed</strong>, <strong>Mastery</strong>, or <strong>Favorite</strong> will automatically mark it as <strong>Owned</strong>.</li>
                  <li>Marking a unit with <strong>Mastery</strong> will automatically set it to <strong>Maxed</strong>.</li>
                  <li>If you uncheck <strong>Owned</strong>, all other statuses for that unit will be cleared.</li>
                </ul>
              </li>
              <li style={{ marginTop: '10px' }}>
                <strong>Search:</strong>
                <ul>
                  <li>Use the search icon (🔍) to quickly filter units by name.</li>
                </ul>
              </li>
              <li style={{ marginTop: '10px' }}>
                <strong>Sharing Your List:</strong>
                <ul>
                  <li>When your list is complete, click <strong>"Copy Form Code"</strong> to get a formatted text version of your barracks. You can then paste this directly into a message.</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  const [selectedUnits, setSelectedUnits] = useState<Record<string, UnitStatus>>({});
  const [copyFeedback, setCopyFeedback] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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
        {Object.entries(DEFAULT_UNIT_TIERS).map(([tier, units]) => {
          let sortedUnits = [...units].sort((a, b) => a.name.localeCompare(b.name));

          if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            sortedUnits = sortedUnits.filter(u => u.name.toLowerCase().includes(lowerSearch));
          }

          if (sortedUnits.length === 0) return null;

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

        <button className="copy-btn" onClick={handleCopy}>
          Copy Form Code
        </button>
        {copyFeedback && <span className="feedback">{copyFeedback}</span>}
      </div>
    </div>
  );
}

export default App;