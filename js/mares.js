const topics = Array.from(document.querySelectorAll('.topic[id]'));
const topicsById = new Map(topics.map((topic) => [topic.id, topic]));
const navLinks = Array.from(document.querySelectorAll('.index a[href^="#"]'));
const linksById = new Map();

const normalizeHash = (hash) => {
    if (!hash) return null;
    const trimmed = hash.startsWith('#') ? hash.slice(1) : hash;
    const decoded = decodeURIComponent(trimmed);
    return decoded.length ? decoded : null;
};

const setActive = (activeId) => {
    if (activeId) {
        document.body.dataset.activeTopic = activeId;
    } else {
        delete document.body.dataset.activeTopic;
    }

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

if (navLinks.length) {
    navLinks.forEach((link) => {
        const topicId = normalizeHash(link.hash);
        if (!topicId) return;
        const topic = topicsById.get(topicId);
        if (!topic) return;

        linksById.set(topicId, link);
        link.addEventListener('click', () => {
            setActive(topicId);
        });
    });

    window.addEventListener('hashchange', syncFromLocation);
    syncFromLocation();
}

const buildTopicUrl = (topicId) => {
    const url = new URL(window.location.href);
    url.hash = topicId;
    return url.toString();
};

const copyTopicLink = async (topicId) => {
    const topicUrl = buildTopicUrl(topicId);
    await navigator.clipboard.writeText(topicUrl);
};

topics.forEach((topic) => {
    const heading = topic.querySelector(':scope > h2');
    if (!heading) return;

    heading.addEventListener('click', async () => {
        const topicId = topic.id;
        if (!topicId) return;

        try {
            await copyTopicLink(topicId);
        } catch (error) {
            console.error(`Failed to copy link for topic "${topicId}"`, error);
            return;
        }

        if (window.location.hash !== `#${topicId}`) {
            history.replaceState(null, '', `#${topicId}`);
        }

        setActive(topicId);
    });
});
