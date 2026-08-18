import { registerIcons } from './icons';
import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';
import { EnrollModal } from './enroll-modal';
import { DidYouKnowWidget } from './did-you-know';
import { FaqList } from './faq-list';

registerIcons();

if (!customElements.get('site-header')) customElements.define('site-header', SiteHeader);
if (!customElements.get('site-footer')) customElements.define('site-footer', SiteFooter);
if (!customElements.get('enroll-modal')) customElements.define('enroll-modal', EnrollModal);
if (!customElements.get('did-you-know')) customElements.define('did-you-know', DidYouKnowWidget);
if (!customElements.get('faq-list')) customElements.define('faq-list', FaqList);
