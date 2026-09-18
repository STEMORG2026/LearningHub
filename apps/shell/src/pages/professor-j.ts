import '../styles/main.css';
import '../components/index';
import { askProfessorJ, type ChatMessage } from '../lib/professor-j-client';
import { initScrollReveal, initScrollProgress } from '../lib/scroll';
import { initCosmicBackground } from '../lib/cosmic-background';

document.addEventListener('DOMContentLoaded', () => {
  const chatBox = document.getElementById('profPageChat');
  const input = document.getElementById('profPageInput') as HTMLInputElement | null;
  const sendBtn = document.getElementById('profPageSend');
  const modelSelect = document.getElementById('profPageModel') as HTMLSelectElement | null;
  const history: ChatMessage[] = [];

  const appendMsg = (role: 'user' | 'assistant', content: string) => {
    if (!chatBox) return document.createElement('div');
    const msg = document.createElement('div');
    msg.className = `prof-msg prof-msg-${role}`;
    msg.style.cssText = role === 'user'
      ? 'background:rgba(0,212,255,0.15);border:1px solid rgba(0,212,255,0.3);color:#fff;padding:0.9rem 1.2rem;border-radius:14px;align-self:flex-end;max-width:80%;margin-bottom:1rem;'
      : 'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);color:#e0e0e0;padding:0.9rem 1.2rem;border-radius:14px;align-self:flex-start;max-width:80%;margin-bottom:1rem;line-height:1.5;';
    msg.innerHTML = content;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msg;
  };

  const handleSend = async () => {
    const text = input?.value.trim();
    if (!text) return;
    if (input) input.value = '';

    appendMsg('user', text);
    history.push({ role: 'user', content: text });

    const pending = appendMsg('assistant', '⚡ <i>PROFESSOR-J is reasoning...</i>');
    const model = modelSelect?.value || 'google/gemini-3.7-flash';

    const reply = await askProfessorJ(text, history, undefined, { model });
    pending.innerHTML = reply.replace(/\n/g, '<br/>');
    history.push({ role: 'assistant', content: reply });
  };

  sendBtn?.addEventListener('click', handleSend);
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  document.querySelectorAll('.prompt-preset-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const prompt = (e.currentTarget as HTMLElement).dataset.prompt;
      if (prompt) {
        if (input) input.value = prompt;
        handleSend();
      }
    });
  });

  initScrollReveal();
  initScrollProgress();
  initCosmicBackground();
});
