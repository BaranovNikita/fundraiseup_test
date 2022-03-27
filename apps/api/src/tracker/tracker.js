(async () => {
  Date.prototype.toISOStringWithTimezone = function () {
    const strDate = this.toString();
    const GMTEndIndex = strDate.indexOf('GMT') + 3;
    const TZ =
      strDate.slice(GMTEndIndex, GMTEndIndex + 3) +
      ':' +
      strDate.slice(GMTEndIndex + 3, GMTEndIndex + 5);
    this.setTime(this.getTime() - this.getTimezoneOffset() * 60000);

    return this.toISOString().slice(0, -1) + TZ;
  };

  class EventBuffer {
    #subscribers = [];

    #onChange() {
      const events = this.getEvents();
      this.#subscribers.forEach((s) => s(events));
    }

    constructor() {
      if (!window.localStorage.getItem('buffer')) {
        this.empty();
      }
    }

    getEvents() {
      return JSON.parse(window.localStorage.getItem('buffer'));
    }

    push(...events) {
      const currentEvents = this.getEvents();
      window.localStorage.setItem(
        'buffer',
        JSON.stringify([...currentEvents, ...events]),
      );
      this.#onChange();
    }

    empty() {
      window.localStorage.setItem('buffer', JSON.stringify([]));
      this.#onChange();
    }

    subscribe(fn) {
      this.#subscribers.push(fn);
    }
  }

  class Tracker {
    #currentInterval = null;
    #buffer = new EventBuffer();

    async #sendEvents() {
      const events = this.#buffer.getEvents();
      if (!events.length) {
        return;
      }
      this.#buffer.empty();
      try {
        await fetch('http://localhost:8001/track', {
          method: 'POST',
          body: JSON.stringify(events),
          headers: {
            'Content-Type': 'text/plain',
          },
        });
      } catch (e) {
        console.error(e);
        this.#buffer.push(...events);
      } finally {
        this.#resetInterval();
      }
    }

    #startInterval() {
      this.#currentInterval = setInterval(() => {
        this.#sendEvents();
      }, 1000);
    }

    #resetInterval() {
      if (this.#currentInterval) {
        clearInterval(this.#currentInterval);
      }
      this.#startInterval();
    }

    constructor() {
      window.addEventListener('beforeunload', async (e) => {
        if (e.target.activeElement.tagName !== 'A') {
          await this.#sendEvents();
        }
      });

      this.#buffer.subscribe((events) => {
        if (events.length > 2) {
          this.#sendEvents();
        }
      });
      this.#startInterval();

      document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('body ul li a').forEach((link) => {
          link.addEventListener('click', async (event) => {
            event.preventDefault();
            await this.sendEvents();
            window.location.href = link.getAttribute('href');
          });
        });
      });
    }

    track(event, ...tags) {
      this.#buffer.push({
        event,
        tags,
        url: window.location.href,
        title: document.title,
        ts: new Date().toISOStringWithTimezone(),
      });
    }
  }

  window.tracker = new Tracker();
})();
