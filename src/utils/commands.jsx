
export const commands = {
    help: {
        type: 'output',
        content: (
            <div>
                <p>Available commands:</p>
                <ul style={{ listStyleType: 'none', paddingLeft: '1rem' }}>
                    <li>- <span style={{ color: '#fff' }}>about</span>: Who am I?</li>
                    <li>- <span style={{ color: '#fff' }}>projects</span>: Show off my work</li>
                    <li>- <span style={{ color: '#fff' }}>contact</span>: Get in touch</li>
                    <li>- <span style={{ color: '#fff' }}>why</span>: Design philosophy</li>
                    <li>- <span style={{ color: '#fff' }}>gui</span>: Graphical User Interface?</li>
                    <li>- <span style={{ color: '#fff' }}>matrix</span>: Toggle The Matrix</li>
                    <li>- <span style={{ color: '#fff' }}>clear</span>: Clear the screen</li>
                </ul>
            </div>
        )
    },

    about: {
        type: 'output',
        content: (
            <div>
                <p>HEADER_INFO: [USER_PROFILE_LOADED]</p>
                <p>----------------------------------------</p>
                <p>Name: [REDACTED]</p>
                <p>Role: Creative Developer / Cyberpunk Enthusiast</p>
                <p>Stack: React, Vite, WebGL, Node.js</p>
                <br />
                <p>Bio:</p>
                <p>I build immersive web experiences that blur the line between utility and art. </p>
                <p>Currently focused on pushing the boundaries of what static sites can do on the Edge.</p>
                <p>Deployed via: <strong>Aliyun ESA</strong> (Edge Security Acceleration)</p>
            </div>
        )
    },

    why: {
        type: 'output',
        content: (
            <div>
                <p>&gt; QUERY: WHY_THIS_STYLE?</p>
                <p>Because the web used to be raw. It used to be mysterious.</p>
                <p>Before standard UI libraries homogenized the internet, every site was an adventure.</p>
                <p>This terminal is a tribute to the explorers of the early net.</p>
                <p>And also... green text on black just looks cool.</p>
            </div>
        )
    },

    gui: {
        type: 'output',
        content: (
            <div>
                <p style={{ color: '#ff3333' }}>ERROR: GUI_MODULE_NOT_FOUND</p>
                <p>What did you expect? Windows 95?</p>
                <p>Real hackers use the command line.</p>
                <p>(Try typing 'matrix' if you want visual stimulation)</p>
            </div>
        )
    },

    contact: {
        type: 'output',
        content: (
            <div>
                <p>ESTABLISHING_UPLINK...</p>
                <ul style={{ listStyleType: 'none', paddingLeft: '1rem' }}>
                    <li>Github: <a href="https://github.com/i4leader" target="_blank" style={{ color: 'var(--terminal-green)' }}>@i4leader</a></li>
                    <li>Email: <a href="mailto:i4leader@163.com" style={{ color: 'var(--terminal-green)' }}>i4leader@163.com</a></li>
                    <li>X (Twitter): <a href="#" style={{ color: 'var(--terminal-green)' }}>@jackt1314</a></li>
                </ul>
            </div>
        )
    },

    projects: {
        type: 'output',
        content: (
            <div className="projects-grid">
                <p>LOADED_PROJECTS: [3]</p>
                <div style={{ border: '1px dashed var(--terminal-green)', padding: '1rem', marginBottom: '1rem' }}>
                    <h3>[01] Retro Terminal Portfolio</h3>
                    <p>Status: <span style={{ color: '#33ff33' }}>ONLINE</span></p>
                    <p>Tech: Vite, React, Aliyun ESA</p>
                    <p>Desc: A CLI-based portfolio website. You are looking at it.</p>
                </div>
                <div style={{ border: '1px dashed var(--terminal-dim)', padding: '1rem', marginBottom: '1rem' }}>
                    <h3>[02] Project Neon</h3>
                    <p>Status: <span style={{ color: 'yellow' }}>ARCHIVED</span></p>
                    <p>Tech: Three.js, WebGL</p>
                    <p>Desc: 3D cyber city generation experiment.</p>
                </div>
            </div>
        )
    }
};
