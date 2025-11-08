// ...existing code...
(function () {
    'use strict';

    console.log('✅ detalle-curso.js cargado (gestión de pestañas)');

    function findTargetKey(btn) {
        return btn.getAttribute('data-target') || btn.getAttribute('data-tab') || btn.dataset.tab;
    }

    function findContentForKey(key) {
        if (!key) return null;
        // soporta varios formatos usados en las vistas:
        // - <div class="tab-content" data-tab="materials">
        // - <div id="tab-materiales">  (docente)
        // - <div class="tab-content" id="materials">
        // - <div id="materials">
        return document.querySelector(`.tab-content[data-tab="${key}"]`)
            || document.querySelector(`#tab-${key}`)
            || document.querySelector(`.tab-content#${key}`)
            || document.querySelector(`#${key}`);
    }

    function deactivateGroupButtons(group) {
        group.querySelectorAll('.tab, .tab-btn, .tab-btn, .tab').forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
        });
    }

    function hideAllTabContents() {
        document.querySelectorAll('.tab-content').forEach(c => {
            c.setAttribute('hidden', '');
            c.classList.remove('active');
        });
    }

    function activateButton(button) {
        if (!button) return;
        // determinar grupo (puede ser .tabs o .curso-tabs o el padre inmediato)
        const group = button.closest('.tabs') || button.closest('.curso-tabs') || button.parentElement;
        if (group) deactivateGroupButtons(group);

        hideAllTabContents();

        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');

        const key = findTargetKey(button);
        const content = findContentForKey(key);
        if (content) {
            content.removeAttribute('hidden');
            content.classList.add('active');
        } else {
            console.warn('detalle-curso.js: no se encontró contenido para clave:', key);
        }
    }

    function init() {
        // buscar botones en ambos patrones
        const buttons = document.querySelectorAll('.tabs .tab, .curso-tabs .tab-btn, .tabs .tab-btn, .curso-tabs .tab');
        if (!buttons.length) {
            console.log('detalle-curso.js: no se encontraron botones de pestañas en la página.');
            return;
        }

        buttons.forEach(btn => {
            // evitar doble asignación si el script se ejecuta varias veces
            if (btn.dataset._tabHandlerAttached === 'true') return;
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                activateButton(this);
            });
            btn.dataset._tabHandlerAttached = 'true';
        });

        // inicializar la pestaña marcada como .active si existe (soporta ambos tipos)
        const initial = document.querySelector('.tabs .tab.active, .curso-tabs .tab-btn.active, .tabs .tab-btn.active, .curso-tabs .tab.active');
        if (initial) {
            // pequeña espera para asegurar que el DOM (si fue inyectado dinámicamente) esté estable
            setTimeout(() => activateButton(initial), 0);
        } else {
            // si no hay .active explícito, activar la primera del grupo si existe
            const first = buttons[0];
            if (first) setTimeout(() => activateButton(first), 0);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(); 
// ...existing code...