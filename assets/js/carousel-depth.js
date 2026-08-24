(() => {
  const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
  const SECTION_SELECTOR = ".featured-section";
  const VIEWPORT_SELECTOR = ".featured-viewport";
  const DRAG_OFFSET_SELECTOR = ".featured-drag-offset";
  const TRACK_SELECTOR = ".featured-track";
  const GROUP_SELECTOR = ".featured-group";
  const ITEM_SELECTOR = ".featured-item";
  const DEPTH_READY_CLASS = "carousel-depth-ready";
  const DRAG_READY_CLASS = "carousel-drag-ready";
  const PRESSING_CLASS = "is-drag-pressing";
  const DRAGGING_CLASS = "is-dragging";
  const DRAG_THRESHOLD = 6;

  let initialized = false;
  let enabled = false;
  let dragEnabled = false;
  let frameId = null;
  let observer = null;
  let configDirty = true;
  let geometryDirty = true;
  let sections = [];
  let sectionByElement = new Map();
  const activeSections = new Set();

  const motionQuery = window.matchMedia
    ? window.matchMedia(REDUCED_MOTION_QUERY)
    : { matches: false };

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function modulo(value, divisor) {
    return ((value % divisor) + divisor) % divisor;
  }

  function readCssNumber(style, property, fallback) {
    const value = Number.parseFloat(style.getPropertyValue(property));
    return Number.isFinite(value) ? value : fallback;
  }

  function supportsDepth() {
    return (
      typeof window.requestAnimationFrame === "function" &&
      typeof window.cancelAnimationFrame === "function" &&
      window.CSS &&
      CSS.supports("perspective", "1px") &&
      CSS.supports("transform-style", "preserve-3d") &&
      CSS.supports("overflow", "clip")
    );
  }

  function createSectionData(sectionElement) {
    const viewport = sectionElement.querySelector(VIEWPORT_SELECTOR);
    const dragOffset = sectionElement.querySelector(DRAG_OFFSET_SELECTOR);
    const track = sectionElement.querySelector(TRACK_SELECTOR);
    const groups = Array.from(
      sectionElement.querySelectorAll(GROUP_SELECTOR),
    ).map((groupElement) => ({
      element: groupElement,
      items: Array.from(groupElement.querySelectorAll(ITEM_SELECTOR)).map(
        (itemElement) => ({
          element: itemElement,
          localCenter: 0,
        }),
      ),
    }));

    if (!viewport || !dragOffset || !track || groups.length === 0) return null;

    return {
      element: sectionElement,
      viewport,
      dragOffset,
      track,
      groups,
      groupWidth: 0,
      config: null,
      drag: {
        pointerId: null,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        startOffset: 0,
        manualOffset: 0,
        isDragging: false,
        pressedLink: null,
        pressedLinkWasFocused: false,
        suppressClickTarget: null,
        suppressClickTimer: null,
        handlers: null,
      },
    };
  }

  function refreshConfigAndGeometry() {
    sections.forEach((section) => {
      const style = getComputedStyle(section.element);
      section.config = {
        maxRotate: readCssNumber(style, "--carousel-max-rotate", 0),
        centerScale: readCssNumber(style, "--carousel-center-scale", 1),
        centerZ: readCssNumber(style, "--carousel-center-z", 0),
        edgeZ: readCssNumber(style, "--carousel-edge-z", 0),
      };
      section.groupWidth = section.groups[0].element.offsetWidth;

      section.groups.forEach((group) => {
        group.items.forEach((item) => {
          item.localCenter =
            item.element.offsetLeft + item.element.offsetWidth / 2;
        });
      });
    });

    configDirty = false;
    geometryDirty = false;
  }

  function normalizeDragOffset(offset, groupWidth, viewportWidth) {
    if (groupWidth <= 0) return 0;

    const lowerBound = viewportWidth - groupWidth;
    return modulo(offset - lowerBound, groupWidth) + lowerBound;
  }

  function getNextDragOffset(section, viewportWidth) {
    const drag = section.drag;
    const rawOffset = drag.isDragging
      ? drag.startOffset + (drag.currentX - drag.startX)
      : drag.manualOffset;

    return normalizeDragOffset(rawOffset, section.groupWidth, viewportWidth);
  }

  function writeDepth(item, distance, config) {
    const absoluteDistance = Math.abs(distance);
    const scaleFalloff = (config.centerScale - 1) * 2;
    const rotation = -distance * config.maxRotate;
    const scale = config.centerScale - absoluteDistance * scaleFalloff;
    const depth =
      config.centerZ + absoluteDistance * (config.edgeZ - config.centerZ);

    item.element.style.setProperty(
      "--depth-rotate",
      `${rotation.toFixed(3)}deg`,
    );
    item.element.style.setProperty("--depth-z", `${depth.toFixed(3)}px`);
    item.element.style.setProperty("--depth-scale", scale.toFixed(4));
  }

  function updateDepthFrame() {
    if (!enabled || motionQuery.matches || activeSections.size === 0) return;

    if (configDirty || geometryDirty) refreshConfigAndGeometry();

    const offsetUpdates = [];
    const measurements = [];

    activeSections.forEach((section) => {
      const viewportRect = section.viewport.getBoundingClientRect();
      const halfViewportWidth = viewportRect.width / 2;

      if (halfViewportWidth <= 0) return;

      const viewportCenter = viewportRect.left + halfViewportWidth;
      const nextOffset = getNextDragOffset(section, viewportRect.width);
      const offsetAdjustment = nextOffset - section.drag.manualOffset;

      if (Math.abs(offsetAdjustment) > 0.001) {
        offsetUpdates.push({ section, nextOffset });
      }

      section.groups.forEach((group) => {
        const groupLeft = group.element.getBoundingClientRect().left;

        group.items.forEach((item) => {
          const cardCenter = groupLeft + item.localCenter + offsetAdjustment;
          measurements.push({
            item,
            config: section.config,
            distance: clamp(
              (cardCenter - viewportCenter) / halfViewportWidth,
              -1,
              1,
            ),
          });
        });
      });
    });

    offsetUpdates.forEach(({ section, nextOffset }) => {
      section.drag.manualOffset = nextOffset;
      section.dragOffset.style.setProperty(
        "--carousel-drag-offset",
        `${nextOffset.toFixed(3)}px`,
      );
    });

    measurements.forEach(({ item, distance, config }) => {
      writeDepth(item, distance, config);
    });

    scheduleFrame();
  }

  function renderFrame() {
    frameId = null;

    try {
      updateDepthFrame();
    } catch {
      disableDepth();
    }
  }

  function syncDepthFrame() {
    if (frameId !== null) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }

    updateDepthFrame();
  }

  function handleMarqueeIteration(event) {
    if (
      event.target !== event.currentTarget ||
      event.animationName !== "featuredMarquee" ||
      !enabled ||
      motionQuery.matches ||
      activeSections.size === 0
    ) {
      return;
    }

    geometryDirty = true;

    try {
      syncDepthFrame();
    } catch {
      disableDepth();
    }
  }

  function scheduleFrame() {
    if (
      frameId === null &&
      enabled &&
      !motionQuery.matches &&
      activeSections.size > 0
    ) {
      frameId = requestAnimationFrame(renderFrame);
    }
  }

  function setSectionActive(section, isActive) {
    if (isActive) {
      activeSections.add(section);
      scheduleFrame();
      return;
    }

    activeSections.delete(section);
  }

  function observeSections() {
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const section = sectionByElement.get(entry.target);
            if (section) setSectionActive(section, entry.isIntersecting);
          });
        },
        { threshold: 0.01 },
      );

      sections.forEach((section) => observer.observe(section.element));
      return;
    }

    sections.forEach((section) => activeSections.add(section));
    scheduleFrame();
  }

  function clearClickSuppression(drag) {
    if (drag.suppressClickTimer !== null) {
      clearTimeout(drag.suppressClickTimer);
      drag.suppressClickTimer = null;
    }

    drag.suppressClickTarget = null;
  }

  function resetPointerState(section) {
    const drag = section.drag;
    const pointerId = drag.pointerId;

    drag.pointerId = null;
    drag.isDragging = false;
    drag.pressedLink = null;
    drag.pressedLinkWasFocused = false;
    section.viewport.classList.remove(PRESSING_CLASS, DRAGGING_CLASS);

    if (
      pointerId !== null &&
      typeof section.viewport.hasPointerCapture === "function" &&
      section.viewport.hasPointerCapture(pointerId)
    ) {
      try {
        section.viewport.releasePointerCapture(pointerId);
      } catch {
        // Pointer capture may already have been released by the browser.
      }
    }
  }

  function cancelPointerPress(section) {
    resetPointerState(section);
    scheduleFrame();
  }

  function finishPointerInteraction(section, event, allowClickSuppression) {
    const drag = section.drag;

    if (event && event.pointerId !== drag.pointerId) return;

    if (event && Number.isFinite(event.clientX)) {
      drag.currentX = event.clientX;
      drag.currentY = event.clientY;
    }

    const wasDragging = drag.isDragging;
    const pressedLink = drag.pressedLink;
    const pressedLinkWasFocused = drag.pressedLinkWasFocused;

    if (wasDragging) {
      try {
        syncDepthFrame();
      } catch {
        disableDepth();
        return;
      }
    }

    resetPointerState(section);

    if (
      wasDragging &&
      pressedLink &&
      !pressedLinkWasFocused &&
      pressedLink === document.activeElement
    ) {
      // Remove only pointer-introduced focus; preserve existing keyboard focus.
      pressedLink.blur();
    }

    if (wasDragging && allowClickSuppression && pressedLink) {
      clearClickSuppression(drag);
      drag.suppressClickTarget = pressedLink;
      drag.suppressClickTimer = window.setTimeout(() => {
        drag.suppressClickTarget = null;
        drag.suppressClickTimer = null;
      }, 0);
    }

    scheduleFrame();
  }

  function handlePointerDown(section, event) {
    const drag = section.drag;

    if (
      !dragEnabled ||
      motionQuery.matches ||
      drag.pointerId !== null ||
      event.isPrimary === false ||
      (event.pointerType === "mouse" && event.button !== 0)
    ) {
      return;
    }

    clearClickSuppression(drag);
    drag.pointerId = event.pointerId;
    drag.startX = event.clientX;
    drag.startY = event.clientY;
    drag.currentX = event.clientX;
    drag.currentY = event.clientY;
    drag.startOffset = drag.manualOffset;
    drag.isDragging = false;
    drag.pressedLink =
      event.target instanceof Element ? event.target.closest("a") : null;
    drag.pressedLinkWasFocused = drag.pressedLink === document.activeElement;

    section.viewport.classList.add(PRESSING_CLASS);
    activeSections.add(section);
    scheduleFrame();
  }

  function handlePointerMove(section, event) {
    const drag = section.drag;

    if (event.pointerId !== drag.pointerId) return;

    drag.currentX = event.clientX;
    drag.currentY = event.clientY;

    const deltaX = drag.currentX - drag.startX;
    const deltaY = drag.currentY - drag.startY;
    const absoluteX = Math.abs(deltaX);
    const absoluteY = Math.abs(deltaY);

    if (!drag.isDragging) {
      if (absoluteY >= DRAG_THRESHOLD && absoluteY > absoluteX) {
        cancelPointerPress(section);
        return;
      }

      if (absoluteX < DRAG_THRESHOLD || absoluteX <= absoluteY) return;

      drag.isDragging = true;
      section.viewport.classList.add(DRAGGING_CLASS);

      if (typeof section.viewport.setPointerCapture === "function") {
        try {
          section.viewport.setPointerCapture(event.pointerId);
        } catch {
          // Continue without capture if the pointer is no longer active.
        }
      }

      const selection = window.getSelection?.();
      if (selection && selection.type === "Range") selection.removeAllRanges();
    }

    event.preventDefault();
    scheduleFrame();
  }

  function handleSuppressedClick(section, event) {
    const link = section.drag.suppressClickTarget;
    const target = event.target;

    if (!(target instanceof Node) || !link || !link.contains(target)) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    clearClickSuppression(section.drag);
  }

  function handleWindowBlur() {
    sections.forEach((section) => {
      if (section.drag.pointerId !== null) {
        finishPointerInteraction(section, null, false);
      }
    });
  }

  function createDragHandlers(section) {
    return {
      pointerDown: (event) => handlePointerDown(section, event),
      pointerMove: (event) => handlePointerMove(section, event),
      pointerUp: (event) => finishPointerInteraction(section, event, true),
      pointerCancel: (event) => finishPointerInteraction(section, event, false),
      lostPointerCapture: (event) => {
        if (event.pointerId === section.drag.pointerId) {
          finishPointerInteraction(section, null, false);
        }
      },
      click: (event) => handleSuppressedClick(section, event),
      dragStart: (event) => event.preventDefault(),
    };
  }

  function enableDrag() {
    if (dragEnabled || !("PointerEvent" in window) || motionQuery.matches) {
      return;
    }

    dragEnabled = true;

    sections.forEach((section) => {
      const handlers = createDragHandlers(section);
      section.drag.handlers = handlers;
      section.element.classList.add(DRAG_READY_CLASS);
      section.viewport.addEventListener("pointerdown", handlers.pointerDown);
      section.viewport.addEventListener("pointermove", handlers.pointerMove);
      section.viewport.addEventListener("pointerup", handlers.pointerUp);
      section.viewport.addEventListener(
        "pointercancel",
        handlers.pointerCancel,
      );
      section.viewport.addEventListener(
        "lostpointercapture",
        handlers.lostPointerCapture,
      );
      section.viewport.addEventListener("click", handlers.click, true);
      section.viewport.addEventListener("dragstart", handlers.dragStart);
    });

    window.addEventListener("blur", handleWindowBlur);
  }

  function disableDrag() {
    if (!dragEnabled) return;

    dragEnabled = false;
    window.removeEventListener("blur", handleWindowBlur);

    sections.forEach((section) => {
      const handlers = section.drag.handlers;

      resetPointerState(section);
      clearClickSuppression(section.drag);
      section.drag.manualOffset = 0;
      section.drag.startOffset = 0;
      section.dragOffset.style.removeProperty("--carousel-drag-offset");
      section.element.classList.remove(DRAG_READY_CLASS);

      if (!handlers) return;

      section.viewport.removeEventListener("pointerdown", handlers.pointerDown);
      section.viewport.removeEventListener("pointermove", handlers.pointerMove);
      section.viewport.removeEventListener("pointerup", handlers.pointerUp);
      section.viewport.removeEventListener(
        "pointercancel",
        handlers.pointerCancel,
      );
      section.viewport.removeEventListener(
        "lostpointercapture",
        handlers.lostPointerCapture,
      );
      section.viewport.removeEventListener("click", handlers.click, true);
      section.viewport.removeEventListener("dragstart", handlers.dragStart);
      section.drag.handlers = null;
    });
  }

  function clearDepthStyles() {
    sections.forEach((section) => {
      section.element.classList.remove(DEPTH_READY_CLASS);
      section.groups.forEach((group) => {
        group.items.forEach((item) => {
          item.element.style.removeProperty("--depth-rotate");
          item.element.style.removeProperty("--depth-z");
          item.element.style.removeProperty("--depth-scale");
        });
      });
    });
  }

  function disableDepth() {
    enabled = false;
    disableDrag();

    if (observer) {
      observer.disconnect();
      observer = null;
    }

    activeSections.clear();

    if (frameId !== null) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }

    clearDepthStyles();
  }

  function enableDepth() {
    if (enabled || motionQuery.matches) return;

    enabled = true;
    configDirty = true;
    geometryDirty = true;

    try {
      sections.forEach((section) =>
        section.element.classList.add(DEPTH_READY_CLASS),
      );
      observeSections();
      enableDrag();
    } catch {
      disableDepth();
    }
  }

  function handleMotionPreference(event) {
    if (event.matches) {
      disableDepth();
      return;
    }

    enableDepth();
  }

  function handleResize() {
    if (!enabled || motionQuery.matches) return;
    configDirty = true;
    geometryDirty = true;
    scheduleFrame();
  }

  function initCarouselDepth() {
    if (initialized || !supportsDepth()) return;

    sections = Array.from(document.querySelectorAll(SECTION_SELECTOR))
      .map(createSectionData)
      .filter(Boolean);

    if (sections.length === 0) return;

    initialized = true;
    sectionByElement = new Map(
      sections.map((section) => [section.element, section]),
    );

    sections.forEach((section) => {
      section.track.addEventListener(
        "animationiteration",
        handleMarqueeIteration,
      );
    });

    window.addEventListener("resize", handleResize, { passive: true });

    if (typeof motionQuery.addEventListener === "function") {
      motionQuery.addEventListener("change", handleMotionPreference);
    } else if (typeof motionQuery.addListener === "function") {
      motionQuery.addListener(handleMotionPreference);
    }

    if (!motionQuery.matches) enableDepth();
  }

  window.DamianApp = window.DamianApp || {};
  window.DamianApp.initCarouselDepth = initCarouselDepth;
})();
