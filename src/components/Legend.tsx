export const LegendContent = () => (
  <div className="legend">
    <div className="legend-item">
      <span title="Mark as Favorite" style={{ color: '#facc15', fontSize: '1.2em', lineHeight: 0.8 }}>★</span> Favorite
    </div>
    <div className="legend-item">
      <div title="Unit has Full Mastery" className="mastery-btn active" style={{ width: 12, height: 12, cursor: 'default' }}></div> Mastery
    </div>
    <div className="legend-item">
      <div title="Unit is Max Level" className="maxed-btn active" style={{ width: 12, height: 12, cursor: 'default' }}></div> Maxed
    </div>
    <div className="legend-item">
      <input type="checkbox" title="Owned Status" className="owned-checkbox" checked readOnly style={{ cursor: 'default' }} /> Owned
    </div>
  </div>
);
