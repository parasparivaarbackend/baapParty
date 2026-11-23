// Merges every Hindi dictionary file. Key = exact English string passed to t().
import common from './common';
import home from './home';
import about from './about';
import manifesto from './manifesto';
import documents from './documents';
import forms from './forms';
import wings from './wings';
import dashboard from './dashboard';
import content from './content';
import chapters from './chapters';

const hi = { ...common, ...home, ...about, ...manifesto, ...documents, ...forms, ...wings, ...dashboard, ...content, ...chapters };
export default hi;
