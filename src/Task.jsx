import { useEffect } from "react";
import React from 'react';
import './Task.css';

const STATUSES = ['TODO', 'In Progress', 'Blocked'];
const ALL_STATUSES = ['TODO', 'In Progress', 'Done', 'Blocked'];

function statusSlug(status) {
    return status.toLowerCase().replace(/\s+/g, '-');
}

function Task() {
    const [tasks, setTasks] = React.useState([]);
    const [expandedIds, setExpandedIds] = React.useState(new Set());
    const [sort, setSort] = React.useState({ key: null, direction: 'asc' });
    useEffect(() => {
        fetch('https://dummyjson.com/todos')
            .then(response => response.json())
            .then(data => {
                console.log('Fetched todos:', data);
                // here add dummy subtasks
                const tasksWithSubTasks = data.todos.map(todo => ({
                    id: todo.id,
                    todo: todo.todo,
                    userId: todo.userId,
                    completed: todo.completed,
                    // API has no status field; derive one until a real source exists
                    status: todo.completed ? 'Done' : STATUSES[todo.id % STATUSES.length],
                    subtask: [1, 2, 3].map(n => ({
                        name: `Subtask ${n} for ${todo.todo}`,
                        status: ALL_STATUSES[(todo.id + n) % ALL_STATUSES.length],
                    })),
                }));
                setTasks(tasksWithSubTasks);
                console.log('Generated subtasks:', tasksWithSubTasks);
            })
            .catch(error => {
                console.error('Error fetching todos:', error);
            });

        // This effect runs when the component mounts
        console.log('Task component mounted');
    }, []);

    const displayedTasks = React.useMemo(() => {
        if (!sort.key) return tasks;
        const sorted = [...tasks].sort((a, b) => {
            if (sort.key === 'status') {
                return ALL_STATUSES.indexOf(a.status) - ALL_STATUSES.indexOf(b.status);
            }
            return a.id - b.id;
        });
        return sort.direction === 'asc' ? sorted : sorted.reverse();
    }, [tasks, sort]);

    const toggleSort = key => {
        setSort(prev => {
            if (prev.key !== key) return { key, direction: 'asc' };
            return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
        });
    };

    const sortIndicator = key => {
        if (sort.key !== key) return '';
        return sort.direction === 'asc' ? ' ▲' : ' ▼';
    };

    return (
        <div>
            <h1>Task Component</h1>
            <p>This is a simple task component.</p>
            <table className="task-table">
                <thead>
                    <tr>
                        <th className="sortable" onClick={() => toggleSort('id')}>
                            ID{sortIndicator('id')}
                        </th>
                        <th>Todo</th>
                        <th>User ID</th>
                        <th onClick={() => toggleSort('status')}>
                            Status{sortIndicator('status')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {displayedTasks?.map(task => {
                        const isExpanded = expandedIds.has(task.id);
                        return (
                            <React.Fragment key={task.id}>
                                <tr
                                    className={`task-row status-${statusSlug(task.status)}`}
                                    onClick={() => setExpandedIds(prev => {
                                        const next = new Set(prev);
                                        if (next.has(task.id)) {
                                            next.delete(task.id);
                                        } else {
                                            next.add(task.id);
                                        }
                                        return next;
                                    })}
                                >
                                    <td>{task.id}</td>
                                    <td>{task.todo}</td>
                                    <td>{task.userId}</td>
                                    <td>
                                        <span className={`status-badge status-${statusSlug(task.status)}`}>
                                            {task.status}
                                        </span>
                                    </td>
                                </tr>
                                {isExpanded && (
                                    <tr className="subtask-row">
                                        <td colSpan={4}>
                                            <table className="subtask-table">
                                                <thead>
                                                    <tr>
                                                        <th>Subtask</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {task.subtask.map(subtask => (
                                                        <tr key={subtask.name}>
                                                            <td>{subtask.name}</td>
                                                            <td>
                                                                <span className={`status-badge status-${statusSlug(subtask.status)}`}>
                                                                    {subtask.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default Task;