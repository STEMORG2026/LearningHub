import { NAV_LINKS, SITE_CONTACT } from '../data/site';

export class SiteFooter extends HTMLElement {
  connectedCallback(): void {
    this.innerHTML = `
      <footer>
        <div class="footer-inner">
          <div class="footer-brand">
            <a href="index.html" class="nav-logo"><icon-bolt name="bolt"></icon-bolt> STEM Tuition</a>
            <p>Comprehensive home, group & online STEM tutoring in Pokhara, Nepal. SEE, NEB & Cambridge A-Levels.</p>
          </div>
          <div class="footer-links">
            <h4>Navigation</h4>
            <ul>
              ${NAV_LINKS.map((link) => `<li><a href="${link.href}">${link.label}</a></li>`).join('')}
            </ul>
          </div>
          <div class="footer-links">
            <h4>Direct Contact</h4>
            <ul>
              <li><a href="${SITE_CONTACT.phoneHref}"><icon-phone name="phone"></icon-phone> ${SITE_CONTACT.phone}</a></li>
              <li><a href="mailto:${SITE_CONTACT.email}"><icon-mail name="mail"></icon-mail> ${SITE_CONTACT.email}</a></li>
              <li><a href="${SITE_CONTACT.whatsapp}" target="_blank" rel="noopener"><icon-chat name="chat"></icon-chat> WhatsApp Direct</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">© 2026 STEM Tuition · Pokhara, Nepal</div>
      </footer>
    `;
  }
}
