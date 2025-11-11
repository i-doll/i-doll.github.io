const topics = Array.from(globalThis.document.querySelectorAll(".topic[id]"));
const topicsById = new Map(topics.map((topic) => [topic.id, topic]));
const navLinks = Array.from(
  globalThis.document.querySelectorAll('.index a[href^="#"]'),
);
const linksById = new Map();
let currentActiveId = null;
let manualOverrideId = null;
let manualOverrideClearTimer = null;

const normalizeHash = (hash) => {
  if (!hash) return null;
  const trimmed = hash.startsWith("#") ? hash.slice(1) : hash;
  const decoded = decodeURIComponent(trimmed);
  return decoded.length ? decoded : null;
};

const setActive = (activeId) => {
  const normalizedId = activeId ?? null;

  if (normalizedId === currentActiveId) {
    return;
  }

  currentActiveId = normalizedId;

  if (normalizedId) {
    globalThis.document.body.dataset.activeTopic = normalizedId;
  } else {
    delete globalThis.document.body.dataset.activeTopic;
  }

  topicsById.forEach((topic, id) => {
    topic.classList.toggle("is-active", id === normalizedId);
  });
  linksById.forEach((link, id) => {
    const isActive = id === normalizedId;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

const clearManualOverride = () => {
  manualOverrideId = null;
  if (manualOverrideClearTimer) {
    globalThis.clearTimeout(manualOverrideClearTimer);
    manualOverrideClearTimer = null;
  }
};

const setManualOverride = (topicId) => {
  manualOverrideId = topicId;
  if (manualOverrideClearTimer) {
    globalThis.clearTimeout(manualOverrideClearTimer);
  }
  manualOverrideClearTimer = globalThis.setTimeout(() => {
    clearManualOverride();
  }, 1500);
};

const syncFromLocation = () => {
  const currentId = normalizeHash(globalThis.location.hash);
  if (currentId && topicsById.has(currentId)) {
    setManualOverride(currentId);
    setActive(currentId);
  } else {
    clearManualOverride();
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
    link.addEventListener("click", () => {
      setManualOverride(topicId);
      setActive(topicId);
    });
  });

  globalThis.addEventListener("hashchange", syncFromLocation);
  syncFromLocation();
}

const buildTopicUrl = (topicId) => {
  const url = new globalThis.URL(globalThis.location.href);
  url.hash = topicId;
  return url.toString();
};

const copyTopicLink = async (topicId) => {
  const topicUrl = buildTopicUrl(topicId);
  await globalThis.navigator.clipboard.writeText(topicUrl);
};

topics.forEach((topic) => {
  const heading = topic.querySelector(":scope > h2");
  if (!heading) return;

  heading.addEventListener("click", async () => {
    const topicId = topic.id;
    if (!topicId) return;

    try {
      await copyTopicLink(topicId);
    } catch (error) {
      globalThis.console.error(
        `Failed to copy link for topic "${topicId}"`,
        error,
      );
      return;
    }

    if (globalThis?.location?.hash !== `#${topicId}`) {
      globalThis.history.replaceState(null, "", `#${topicId}`);
    }

    setManualOverride(topicId);
    setActive(topicId);
  });
});

const getScrollPaddingTop = () => {
  const rootStyles = globalThis.getComputedStyle(
    globalThis.document.documentElement,
  );
  const value = rootStyles.getPropertyValue("scroll-padding-top");
  const parsed = parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const findActiveTopicId = (scrollPaddingTop) => {
  if (!topics.length) {
    return null;
  }

  const viewportTop = scrollPaddingTop;
  const viewportBottom =
    globalThis.innerHeight ||
    globalThis.document.documentElement.clientHeight ||
    0;

  let bestId = topics[0].id;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (const topic of topics) {
    const rect = topic.getBoundingClientRect();
    const visibleTop = Math.max(rect.top, viewportTop);
    const visibleBottom = Math.min(rect.bottom, viewportBottom);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);

    let score = visibleHeight;

    if (visibleHeight <= 0) {
      const distance =
        rect.top > viewportBottom
          ? rect.top - viewportBottom
          : viewportTop - rect.bottom;
      score = -Math.abs(distance);
    }

    if (score > bestScore) {
      bestScore = score;
      bestId = topic.id;
    }
  }

  return bestId;
};

const updateActiveFromScroll = () => {
  if (!topics.length) return;

  if (manualOverrideId) {
    if (topicsById.has(manualOverrideId)) {
      setActive(manualOverrideId);
      return;
    }
    clearManualOverride();
  }

  const scrollPaddingTop = getScrollPaddingTop();
  const activeId = findActiveTopicId(scrollPaddingTop);
  setActive(activeId);
};

let isTicking = false;

const requestActiveUpdate = () => {
  if (isTicking) return;
  isTicking = true;

  globalThis.requestAnimationFrame(() => {
    isTicking = false;
    updateActiveFromScroll();
  });
};

globalThis.addEventListener(
  "scroll",
  () => {
    requestActiveUpdate();
  },
  { passive: true },
);

globalThis.addEventListener("resize", requestActiveUpdate);

requestActiveUpdate();
