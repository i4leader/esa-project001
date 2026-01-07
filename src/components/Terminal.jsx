import React, { useState, useEffect, useRef } from 'react';
import { commands } from '../utils/commands';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';

import MatrixRain from './MatrixRain';
import CRTWrapper from './CRTWrapper';

const Terminal = () => {
    const [showMatrix, setShowMatrix] = useState(false);
    const [history, setHistory] = useState([
        {
            id: uuidv4(),
            type: 'output',
            content: (
                <div>
                    <p>Welcome to RetroTerm v1.0.0</p>
                    <p>Type <span style={{ color: '#fff' }}>help</span> to get started.</p>
                    <br />
                </div>
            )
        }
    ]);
    const [inputVal, setInputVal] = useState('');
    const inputRef = useRef(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [history]);

    const handleCommand = (cmd) => {
        const trimmedCmd = cmd.trim().toLowerCase();

        // Add User Input to History
        const inputEntry = {
            id: uuidv4(),
            type: 'input',
            content: cmd
        };

        let baseHistory = [...history, inputEntry];

        // Handle Clear
        if (trimmedCmd === 'clear') {
            setHistory([]);
            return;
        }

        // Handle Matrix Toggle
        if (trimmedCmd === 'matrix') {
            setShowMatrix(!showMatrix);
            setHistory([...baseHistory, {
                id: uuidv4(),
                type: 'output',
                content: !showMatrix ? 'The Matrix has you...' : 'Disconnected.'
            }]);
            return;
        }

        // Handle Projects (Dynamic for now)
        if (trimmedCmd === 'projects') {
            const projectEntry = {
                id: uuidv4(),
                type: 'output',
                content: (
                    <div className="projects-grid">
                        <p>Fetching projects from GitHub...</p>
                        {/* Placeholder for now */}
                        <div style={{ border: '1px solid var(--terminal-green)', padding: '10px', marginTop: '10px' }}>
                            <h3>Project A</h3>
                            <p>A cool React app deployed on Aliyun.</p>
                        </div>
                    </div>
                )
            };
            setHistory([...baseHistory, projectEntry]);
            return;
        }

        // Handle Registry Commands
        if (commands[trimmedCmd]) {
            setHistory([...baseHistory, { id: uuidv4(), ...commands[trimmedCmd] }]);
        } else if (trimmedCmd !== '') {
            setHistory([...baseHistory, {
                id: uuidv4(),
                type: 'output',
                content: `Command not found: ${trimmedCmd}`
            }]);
        } else {
            setHistory(baseHistory);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleCommand(inputVal);
        setInputVal('');
    };

    return (
        <CRTWrapper background={showMatrix ? <MatrixRain /> : null}>
            <div className="terminal" onClick={() => inputRef.current?.focus()}>
                {history.map((item) => (
                    <div key={item.id} className={`line ${item.type}`}>
                        {item.type === 'input' && <span className="prompt">{'>'} </span>}
                        {item.type === 'output' ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                {item.content}
                            </motion.div>
                        ) : (
                            <span>{item.content}</span>
                        )}
                    </div>
                ))}

                <form onSubmit={handleSubmit} className="input-line">
                    <span className="prompt">{'>'} </span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        autoFocus
                        className="cmd-input"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                    />
                </form>
                <div ref={bottomRef} />
            </div>
        </CRTWrapper>
    );
};

export default Terminal;
