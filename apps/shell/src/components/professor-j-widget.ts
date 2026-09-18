import { askProfessorJ, type ChatMessage } from '../lib/professor-j-client';

const STYLES = `
:host {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 9999;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
}

.trigger-btn {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: linear-gradient(135deg, #00d4ff, #a078ff);
  color: #0b0f19;
  border: none;
  padding: 0.8rem 1.4rem;
  border-radius: 30px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 212, 255, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.trigger-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(0, 212, 255, 0.5);
}

.chat-drawer {
  display: none;
  flex-direction: column;
  position: fixed;
  bottom: 5.5rem;
  right: 1.5rem;
  width: 380px;
  max-width: calc(100vw - 2rem);
  height: 520px;
  background: #0f1527;
  border: 1px solid rgba(0, 212, 255, 0.25);
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
  overflow: hidden;
}

.chat-drawer.open {
  display: flex;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1.2rem;
  background: rgba(0, 212, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.drawer-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  color: #00d4ff;
  font-size: 1rem;
}

.model-select {
  background: rgba(0, 0, 0, 0.4);
  color: #e0e0e0;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  outline: none;
}

.close-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 1.4rem;
  cursor: pointer;
  line-height: 1;
}

.context-banner {
  display: none;
  align-items: center;
  justify-content: space-between;
  background: rgba(160, 120, 255, 0.15);
  border-bottom: 1px solid rgba(160, 120, 255, 0.3);
  padding: 0.5rem 0.9rem;
  font-size: 0.8rem;
  color: #d8b4ff;
}

.context-banner.active {
  display: flex;
}

.context-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 280px;
}

.messages-list {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.msg {
  max-width: 85%;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.88rem;
  line-height: 1.45;
}

.msg-user {
  align-self: flex-end;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(0, 212, 255, 0.1));
  border: 1px solid rgba(0, 212, 255, 0.3);
  color: #fff;
}

.msg-assistant {
  align-self: flex-start;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #e0e0e0;
}

.chips-row {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  padding: 0.4rem 1rem;
}

.chip-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #00d4ff;
  border-radius: 12px;
  padding: 0.25rem 0.6rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background 0.2s;
}

.chip-btn:hover {
  background: rgba(0, 212, 255, 0.15);
}

.input-bar {
  display: flex;
  gap: 0.5rem;
  padding: 0.8rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.chat-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  color: #fff;
  padding: 0.6rem 0.8rem;
  font-size: 0.88rem;
  outline: none;
}

.send-btn {
  background: #00d4ff;
  color: #0b0f19;
  border: none;
  border-radius: 10px;
  padding: 0.6rem 1rem;
  font-weight: 700;
  cursor: pointer;
}

.highlight-tooltip {
  display: none;
  position: fixed;
  z-index: 10000;
  background: linear-gradient(135deg, #00d4ff, #a078ff);
  color: #0b0f19;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  transform: translate(-50%, -100%);
  margin-top: -8px;
}

.highlight-tooltip.visible {
  display: block;
}
`;

export class ProfessorJWidget extends HTMLElement {
  #history: ChatMessage[] = [];
  #currentContext: string = '';
  #drawer: HTMLElement | null = null;
  #messagesList: HTMLElement | null = null;
  #input: HTMLInputElement | null = null;
  #contextBanner: HTMLElement | null = null;
  #contextText: HTMLElement | null = null;
  #modelSelect: HTMLSelectElement | null = null;
  #highlightTooltip: HTMLElement | null = null;

  connectedCallback(): void {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>${STYLES}</style>

      <button type="button" class="trigger-btn" id="triggerBtn">
        ⚡ Ask PROFESSOR-J
      </button>

      <div class="chat-drawer" id="drawer">
        <div class="drawer-header">
          <div class="drawer-title">
            <span>⚡ PROFESSOR-J</span>
          </div>
          <select class="model-select" id="modelSelect">
            <option value="google/gemini-3.7-flash" selected>Gemini 3.7 Flash (Google AI Pro)</option>
            <option value="google/gemini-2.5-flash">Gemini 2.5 Flash</option>
            <option value="google/gemini-2.5-pro">Gemini 2.5 Pro</option>
          </select>
          <button type="button" class="close-btn" id="closeBtn">×</button>
        </div>

        <div class="context-banner" id="contextBanner">
          <span class="context-text" id="contextText">Context: ...</span>
          <button type="button" style="background:none;border:none;color:#fff;cursor:pointer;" id="clearContext">×</button>
        </div>

        <div class="messages-list" id="messagesList">
          <div class="msg msg-assistant">
            👋 Hello! I am <strong>PROFESSOR-J</strong>, your Socratic AI Tutor grounded in the STEMMA knowledge base. Ask me any question or highlight text on the page!
          </div>
        </div>

        <div class="chips-row">
          <button type="button" class="chip-btn" data-prompt="Explain Photosynthesis in STEMMA">🌱 Photosynthesis</button>
          <button type="button" class="chip-btn" data-prompt="How does STEMMA export to LearningHub?">⚙️ STEMMA Export</button>
          <button type="button" class="chip-btn" data-prompt="Explain Newton's Second Law">🚀 Newton's 2nd Law</button>
        </div>

        <div class="input-bar">
          <input type="text" class="chat-input" id="chatInput" placeholder="Ask PROFESSOR-J anything..." />
          <button type="button" class="send-btn" id="sendBtn">Send</button>
        </div>
      </div>

      <div class="highlight-tooltip" id="highlightTooltip">
        ✨ Ask PROFESSOR-J about this
      </div>
    `;

    this.#drawer = shadow.getElementById('drawer');
    this.#messagesList = shadow.getElementById('messagesList');
    this.#input = shadow.getElementById('chatInput') as HTMLInputElement | null;
    this.#contextBanner = shadow.getElementById('contextBanner');
    this.#contextText = shadow.getElementById('contextText');
    this.#modelSelect = shadow.getElementById('modelSelect') as HTMLSelectElement | null;
    this.#highlightTooltip = shadow.getElementById('highlightTooltip');

    const triggerBtn = shadow.getElementById('triggerBtn');
    const closeBtn = shadow.getElementById('closeBtn');
    const sendBtn = shadow.getElementById('sendBtn');
    const clearContext = shadow.getElementById('clearContext');

    triggerBtn?.addEventListener('click', () => this.toggleDrawer());
    closeBtn?.addEventListener('click', () => this.closeDrawer());
    sendBtn?.addEventListener('click', () => this.handleSend());
    clearContext?.addEventListener('click', () => this.setContext(''));

    this.#input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleSend();
    });

    shadow.querySelectorAll('.chip-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const prompt = (e.currentTarget as HTMLElement).dataset.prompt;
        if (prompt) {
          if (this.#input) this.#input.value = prompt;
          this.handleSend();
        }
      });
    });

    this.#setupHighlightListener();
  }

  toggleDrawer(): void {
    this.#drawer?.classList.toggle('open');
    if (this.#drawer?.classList.contains('open')) {
      this.#input?.focus();
    }
  }

  openDrawer(): void {
    this.#drawer?.classList.add('open');
    this.#input?.focus();
  }

  closeDrawer(): void {
    this.#drawer?.classList.remove('open');
  }

  setContext(text: string): void {
    this.#currentContext = text.trim();
    if (this.#currentContext) {
      if (this.#contextBanner) this.#contextBanner.classList.add('active');
      if (this.#contextText) this.#contextText.textContent = `Context: "${this.#currentContext}"`;
    } else {
      if (this.#contextBanner) this.#contextBanner.classList.remove('active');
    }
  }

  #setupHighlightListener(): void {
    document.addEventListener('mouseup', () => {
      const selection = window.getSelection();
      const selectedText = selection?.toString().trim();

      if (selectedText && selectedText.length > 3) {
        const range = selection?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();

        if (rect && this.#highlightTooltip) {
          this.#highlightTooltip.style.top = `${rect.top + window.scrollY - 10}px`;
          this.#highlightTooltip.style.left = `${rect.left + rect.width / 2}px`;
          this.#highlightTooltip.classList.add('visible');

          this.#highlightTooltip.onclick = () => {
            this.setContext(selectedText);
            this.openDrawer();
            this.#highlightTooltip?.classList.remove('visible');
          };
        }
      } else {
        // Small delay to allow clicking tooltip before hiding
        setTimeout(() => {
          if (!window.getSelection()?.toString()) {
            this.#highlightTooltip?.classList.remove('visible');
          }
        }, 200);
      }
    });
  }

  async handleSend(): Promise<void> {
    const text = this.#input?.value.trim();
    if (!text) return;

    if (this.#input) this.#input.value = '';

    // Append User Message
    this.appendMessage('user', text);
    this.#history.push({ role: 'user', content: text });

    // Pending response placeholder
    const pendingMsg = this.appendMessage('assistant', '<i>PROFESSOR-J is thinking...</i>');

    const model = this.#modelSelect?.value || 'google/gemini-3.7-flash';
    const context = this.#currentContext;

    // Clear context banner after sending
    this.setContext('');

    const answer = await askProfessorJ(text, this.#history, context, { model });
    pendingMsg.innerHTML = answer.replace(/\n/g, '<br/>');
    this.#history.push({ role: 'assistant', content: answer });
  }

  appendMessage(role: 'user' | 'assistant', content: string): HTMLElement {
    const msg = document.createElement('div');
    msg.className = `msg msg-${role}`;
    msg.innerHTML = content;
    if (this.#messagesList) {
      this.#messagesList.appendChild(msg);
      this.#messagesList.scrollTop = this.#messagesList.scrollHeight;
    }
    return msg;
  }
}

if (!customElements.get('professor-j-widget')) {
  customElements.define('professor-j-widget', ProfessorJWidget);
}
