import { NAV_LINKS, SITE_CONTACT } from '../data/site';

export class SiteFooter extends HTMLElement {
  connectedCallback(): void {
    this.innerHTML = `
      <footer>
        <div class="footer-inner">
          <div class="footer-brand">
            <a href="index.html" class="nav-logo"><icon-bolt name="bolt"></icon-bolt> LearningHub</a>
            <p>Open STEM Learning Platform, Knowledge Infrastructure & Educational Foundation.</p>
          </div>
          <div class="footer-links">
            <h3>Navigation</h3>
            <ul>
              ${NAV_LINKS.map((link) => `<li><a href="${link.href}">${link.label}</a></li>`).join('')}
            </ul>
          </div>
          <div class="footer-links">
            <h3>Direct Contact</h3>
            <ul>
              <li><a href="${SITE_CONTACT.phoneHref}"><icon-phone name="phone"></icon-phone> ${SITE_CONTACT.phone}</a></li>
              <li><a href="mailto:${SITE_CONTACT.email}"><icon-mail name="mail"></icon-mail> ${SITE_CONTACT.email}</a></li>
              <li><a href="${SITE_CONTACT.whatsapp}" target="_blank" rel="noopener"><icon-chat name="chat"></icon-chat> WhatsApp Direct</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">© 2026 LearningHub · STEMXIS Technology Pvt. Ltd.</div>
      </footer>
    `;
  }
}
