(function () {
    'use strict';

    function getInitials(nombres = '', apellidos = '') {
        const n = (nombres || '').split(' ').filter(Boolean)[0] || '';
        const a = (apellidos || '').split(' ').filter(Boolean)[0] || '';
        return ( (n.charAt(0) || '') + (a.charAt(0) || '') ).toUpperCase() || 'NE';
    }

    function applyUserToRoot(auth, root = document) {
        if (!auth) return;
        // Sidebar (global)
        const avatarSpan = document.querySelector('.sidebar .profile-avatar span') || (() => {
            const av = document.querySelector('.sidebar .profile-avatar');
            if (av) {
                const s = document.createElement('span');
                av.appendChild(s);
                return s;
            }
            return null;
        })();

        const nameEl = document.querySelector('.sidebar .profile-name');
        const roleEl = document.querySelector('.sidebar .profile-role');

        if (avatarSpan) avatarSpan.textContent = getInitials(auth.nombres, auth.apellidos);
        if (nameEl) nameEl.textContent = `${auth.nombres} ${auth.apellidos}`;
        if (roleEl) roleEl.textContent = (auth.role === 'personal') ? 'Personal' : 'Estudiante';

        // Principal view welcome (injected into #main-content)
        const welcomeSpan = (root === document ? document.getElementById('welcome-user') : root.querySelector('#welcome-user'));
        if (welcomeSpan) {
            welcomeSpan.textContent = `${auth.nombres} ${auth.apellidos}`;
        }

        // También actualizar cualquier elemento con data-user-name
        const anyNameNodes = (root === document ? document.querySelectorAll('[data-user-name]') : root.querySelectorAll('[data-user-name]'));
        anyNameNodes.forEach(n => n.textContent = `${auth.nombres} ${auth.apellidos}`);
    }

    function init() {
        let auth = null;
        try {
            const raw = sessionStorage.getItem('authUser');
            if (!raw) return;
            auth = JSON.parse(raw);
        } catch (e) {
            console.error('session-user: fallo leyendo sessionStorage', e);
            return;
        }

        applyUserToRoot(auth, document);

        // Observer para cuando panel.js inyecta vistas dentro de #main-content
        const main = document.getElementById('main-content');
        if (!main) return;

        const mo = new MutationObserver(muts => {
            muts.forEach(m => {
                m.addedNodes.forEach(node => {
                    if (node.nodeType !== 1) return;
                    // Si la vista entera fue añadida
                    if (node.matches && node.matches('.container, .course-detail, #materials-panel, #evaluations-panel, #principal, #principal *')) {
                        applyUserToRoot(auth, node);
                    } else if (node.querySelector) {
                        // buscar elementos dentro del nodo
                        const found = node.querySelector('#welcome-user') || node.querySelector('[data-user-name]');
                        if (found) applyUserToRoot(auth, node);
                    }
                });
            });
        });
        mo.observe(main, { childList: true, subtree: true });
    }

    // Ejecutar al cargar script (panel-Estudiante.html ya incluye este script)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();