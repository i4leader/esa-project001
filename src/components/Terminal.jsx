import React, { useState, useEffect, useRef } from 'react';
import { commands } from '../utils/commands';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';
import { sendMessageToTongyi } from '../utils/tongyi';

import MatrixRain from './MatrixRain';
import CRTWrapper from './CRTWrapper';

const Terminal = () => {
    // Modes: 'default', 'tongyi_auth', 'tongyi_chat'
    const [terminalMode, setTerminalMode] = useState('default');
    const [apiKey, setApiKey] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

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
    const isComposing = useRef(false);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [history]);

    const handleTongyiChat = async (input) => {
        const userMsg = input.trim();
        if (userMsg.toLowerCase() === 'exit') {
            setTerminalMode('default');
            setHistory(prev => [...prev, {
                id: uuidv4(),
                type: 'output',
                content: 'Exited Tongyi Chat. Back to local terminal.'
            }]);
            return;
        }

        // 1. Show User Input
        const inputEntry = { id: uuidv4(), type: 'input', content: `[Me]: ${userMsg}` };
        setHistory(prev => [...prev, inputEntry]);

        // 2. Prepare API Payload
        const newHistory = [...chatHistory, { role: 'user', content: userMsg }];

        // 3. Show Loading
        const loadingId = uuidv4();
        setHistory(prev => [...prev, { id: loadingId, type: 'output', content: 'Tongyi is thinking...' }]);

        // 4. Call API
        const response = await sendMessageToTongyi(apiKey, newHistory);

        // 5. Update History (Remove loading, add response)
        setHistory(prev => {
            const filtered = prev.filter(item => item.id !== loadingId);
            return [...filtered, {
                id: uuidv4(),
                type: 'output',
                content: <span style={{ color: '#00ccff' }}>[Tongyi]: {response}</span>
            }];
        });

        setChatHistory([...newHistory, { role: 'assistant', content: response }]);
    };

    const handleCommand = (cmd) => {
        // Special Input Handling for Chat Modes
        if (terminalMode === 'tongyi_auth') {
            if (cmd.trim() === '') return;

            setApiKey(cmd.trim());
            setTerminalMode('tongyi_chat');
            setHistory(prev => [...prev, {
                id: uuidv4(),
                type: 'input',
                content: 'REDACTED_API_KEY'
            }, {
                id: uuidv4(),
                type: 'output',
                content: 'API Key stored using session memory. You may now speak to Tongyi. Type "exit" to leave.'
            }]);
            return;
        }

        if (terminalMode === 'tongyi_chat') {
            handleTongyiChat(cmd);
            return;
        }

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

        // Handle Tongyi Command
        if (trimmedCmd === 'tongyi') {
            setTerminalMode('tongyi_auth');
            setHistory([...baseHistory, {
                id: uuidv4(),
                type: 'output',
                content: (
                    <div>
                        <p>Initializing Secure Uplink to DashScope (Tongyi Qianwen)...</p>
                        <p style={{ color: 'yellow' }}>Please enter your DashScope API Key:</p>
                    </div>
                )
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
        // Logic moved to handleKeyDown to better support IME
        if (isComposing.current) return;
        handleCommand(inputVal);
        setInputVal('');
    };

    const handleCompositionStart = () => {
        isComposing.current = true;
    };

    const handleCompositionEnd = () => {
        isComposing.current = false;
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (isComposing.current) {
                e.preventDefault();
                return;
            }
        }
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
                    <span className="prompt">
                        {terminalMode === 'tongyi_auth' ? 'Key: ' :
                            terminalMode === 'tongyi_chat' ? 'Chat: ' : '> '}
                    </span>
                    <input
                        ref={inputRef}
                        type={terminalMode === 'tongyi_auth' ? "password" : "text"}
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        autoFocus
                        className="cmd-input"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        onCompositionStart={handleCompositionStart}
                        onCompositionEnd={handleCompositionEnd}
                        onKeyDown={handleKeyDown}
                    />
                </form>
                <div ref={bottomRef} />
            </div>
        </CRTWrapper>
    );
};

export default Terminal;
