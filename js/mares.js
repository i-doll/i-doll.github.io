const navLinks = Array.from(document.querySelectorAll('.index a[href^="#"]'));

if (navLinks.length) {
    const topicsById = new Map();
    const linksById = new Map();

    const normalizeHash = (hash) => {
        if (!hash) return null;
        const trimmed = hash.startsWith('#') ? hash.slice(1) : hash;
        const decoded = decodeURIComponent(trimmed);
        return decoded.length ? decoded : null;
    };

    const registerLink = (link) => {
        const topicId = normalizeHash(link.hash);
        if (!topicId) return;
        const topic = document.getElementById(topicId);
        if (!topic) return;

        topicsById.set(topicId, topic);
        linksById.set(topicId, link);
    };

    const setActive = (activeId) => {
        topicsById.forEach((topic, id) => {
            topic.classList.toggle('is-active', id === activeId);
        });
        linksById.forEach((link, id) => {
            link.classList.toggle('is-active', id === activeId);
        });
    };

    const syncFromLocation = () => {
        const currentId = normalizeHash(window.location.hash);
        if (currentId && topicsById.has(currentId)) {
            setActive(currentId);
        } else {
            setActive(null);
        }
    };

    navLinks.forEach((link) => {
        registerLink(link);
        link.addEventListener('click', () => {
            const targetId = normalizeHash(link.hash);
            if (targetId && topicsById.has(targetId)) {
                setActive(targetId);
            } else {
                setActive(null);
            }
        });
    });

    window.addEventListener('hashchange', syncFromLocation);
    syncFromLocation();
}

