import { useState, useRef, useEffect } from 'react';

export const HowToUse = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="how-to-use-wrapper" ref={dropdownRef}>
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
                <strong>Favorite</strong> <span title="Mark as Favorite" className="star-btn active" style={{ display: 'inline-block', verticalAlign: 'middle', cursor: 'default', margin: '0 2px' }}>★</span>: Use this to highlight your absolute favorite units—the ones you enjoy using the most or consider your "go-to" units for your Warband.
              </li>
              <li style={{ marginTop: '10px' }}>
                <strong>Mastery</strong> <div title="Unit has Full Mastery" className="mastery-btn active" style={{ display: 'inline-block', verticalAlign: 'middle', cursor: 'default', margin: '0 4px' }}></div>: This indicates the unit has its specific Mastery Tree fully unlocked.
                <ul style={{ marginTop: '5px', marginBottom: '5px' }}>
                  <li><strong>How to check:</strong> Click on the unit in your Barracks, then click the <strong>"Leveling Up"</strong> button. If the unit has Mastery available, a dedicated <strong>Mastery box</strong> will appear here. If you don't see this box, the unit does not currently have a Mastery Tree in the game.</li>
                  <li><em>Note: This is separate from Veterancy lines and Doctrines.</em></li>
                </ul>
              </li>
              <li style={{ marginTop: '10px' }}>
                <strong>Max Level</strong> <div title="Unit is Max Level" className="maxed-btn active" style={{ display: 'inline-block', verticalAlign: 'middle', cursor: 'default', margin: '0 4px' }}></div>: The unit has reached its maximum level. (You can verify this by checking if the level bar under the unit's name in the Barracks is completely filled and glowing.)
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
              <li style={{ marginTop: '10px' }}>
                <strong>Auto-Save:</strong>
                <ul>
                  <li>Your selections are automatically saved to your browser's local memory. You can safely close the tab and return later without losing your progress. Use the <strong>"Clear All"</strong> button to wipe this memory.</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
