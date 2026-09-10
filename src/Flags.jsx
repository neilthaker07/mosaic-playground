import React, { useEffect } from 'react';
import './Flags.css';

function Flags() {
    const [allFlags, setAllFlags] = React.useState([]);
    const [search, setSearch] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('All');
    useEffect(() => {
        console.log('Flags component mounted');
        setAllFlags([
            { name: 'homepage', status: 'ON'},
            { name: 'taskspage', status: 'OFF'},
            { name: 'timepage', status: 'ON'},
        ]);
    }, []);

    const toggleFlag = name => {
        setAllFlags(prev =>
            prev.map(flag =>
                flag.name === name ? { ...flag, status: flag.status === 'ON' ? 'OFF' : 'ON' } : flag
            )
        );
    };

    const filteredFlags = allFlags
        .filter(flag => flag.name.toLowerCase().includes(search.toLowerCase()))
        .filter(flag => statusFilter === 'All' || flag.status === statusFilter);

    return (
        <div>
            <h1>Flags</h1>
            <input 
                type="text"
                placeholder="Search flags..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="All">All</option>
                <option value="ON">ON</option>
                <option value="OFF">OFF</option>
            </select>
            <div className="flag-list">
                {filteredFlags.map(flag => (
                    <div key={flag.name}>
                        <input
                            type="checkbox"
                            checked={flag.status === 'ON'}
                            onChange={() => toggleFlag(flag.name)}
                        />
                        <strong>{flag.name}</strong>: {flag.status}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Flags;
