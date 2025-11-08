(function () {
    'use strict';

    function getInitials(nombres = '', apellidos = '') {
        const n = (nombres || '').split(' ').filter(Boolean)[0] || '';
        const a = (apellidos || '').split(' ').filter(Boolean)[0] || '';
        return ((n.charAt(0) || '') + (a.charAt(0) || '')).toUpperCase() || 'NE';
    }

    function applyUserToRoot(auth, root = document) {
        if (!auth) return;

        // Sidebar (global)
        const avatar = document.querySelector('.sidebar .profile-avatar');
        if (avatar) {
            let span = avatar.querySelector('span');
            if (!span) { span = document.createElement('span'); avatar.appendChild(span); }
            span.textContent = getInitials(auth.nombres, auth.apellidos);
        }

        const nameEl = document.querySelector('.sidebar .profile-name');
        const roleEl = document.querySelector('.sidebar .profile-role');

        if (nameEl) nameEl.textContent = `${auth.nombres || ''} ${auth.apellidos || ''}`.trim() || auth.usuario;
        if (roleEl) {
            // Map role values to friendly names
            const r = (auth.role || '').toLowerCase();
            roleEl.textContent = (r === 'docente') ? 'Docente' : (r === 'estudiante' ? 'Estudiante' : (r ? r.charAt(0).toUpperCase() + r.slice(1) : 'Usuario'));
        }

        // Welcome span inside views
        const welcome = (root === document ? document.getElementById('welcome-user') : root.querySelector('#welcome-user'));
        if (welcome) welcome.textContent = `${auth.nombres || ''} ${auth.apellidos || ''}`.trim() || auth.usuario;

        // Any element with data-user-name
        const nodes = (root === document ? document.querySelectorAll('[data-user-name]') : root.querySelectorAll('[data-user-name]'));
        nodes.forEach(n => n.textContent = `${auth.nombres || ''} ${auth.apellidos || ''}`.trim() || auth.usuario);
    }

    function init() {
        let auth = null;
        try {
            const raw = sessionStorage.getItem('authUser');
            if (!raw) return;
            auth = JSON.parse(raw);
        } catch (e) {
            console.error('session-user: error reading sessionStorage', e);
            return;
        }

        applyUserToRoot(auth, document);

        const main = document.getElementById('main-content');
        if (!main) return;

        const mo = new MutationObserver(muts => {
            muts.forEach(m => {
                m.addedNodes.forEach(node => {
                    if (node.nodeType !== 1) return;
                    if (node.querySelector && (node.querySelector('#welcome-user') || node.querySelector('[data-user-name]') || node.matches('.course-detail'))) {
                        applyUserToRoot(auth, node);
                    }
                });
            });
        });
        mo.observe(main, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();