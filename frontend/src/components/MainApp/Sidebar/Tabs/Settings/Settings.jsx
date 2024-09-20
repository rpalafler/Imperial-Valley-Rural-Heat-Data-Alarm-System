// Import React Hooks
import { useState } from 'react';

// React-Bootstrap Components
import Nav from "react-bootstrap/Nav";

// CSS Modules
import styles from '../ClimateData/ClimateData.module.css'; // Reusing ClimateData styles

function Settings() {
    // Local state for managing checkbox status
    const [checkedItems, setCheckedItems] = useState({ Basemap2d: false });
    const [tabOpen, setTabOpen] = useState(false);

    // Handle checkbox state change
    const handleDataSelection = (event) => {
        const { id, checked } = event.target;
        setCheckedItems({
            ...checkedItems,
            [id]: checked,
        });
        // Optional: You can log or perform other actions when the checkbox is toggled
        console.log(`${id} checkbox is now ${checked}`);
    };

    // Data Array with single checkbox
    const coolingCentersMenu = [
        {
            name: '2D Basemap',
            id: 'basemapChange',
            component: '', // Replace with actual component or data
        },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className={styles.sectionContent}>
                <h4>
                    Change Basemap Tiles more text
                </h4>
                <ul>
                    {coolingCentersMenu.map((element) => (
                        <li key={element.id}>
                            {/* No onClick on <li> to avoid opening a tab */}
                            <input type="checkbox"
                                id={element.id}
                                name={element.id}
                                checked={checkedItems[element.id] || false}
                                onChange={handleDataSelection} />
                            <Nav.Item>
                                <Nav.Link style={{ textDecoration: 'none', color: 'rgba(0, 0, 0, 1)' }}>
                                    <label htmlFor={element.id}>
                                        <div className={styles.checkBox}>
                                            {element.name}
                                        </div>
                                    </label>
                                </Nav.Link>
                            </Nav.Item>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Optional: Display additional content if tab should be opened by other actions */}
            {tabOpen && (
                <div className={styles.sectionContent}>
                    <h4>
                        {coolingCentersMenu[0].name}
                    </h4>
                    <div className={styles.bodyContent}>
                        {/* Replace with actual Cooling Centers component or data */}
                        {coolingCentersMenu[0].component}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Settings;
