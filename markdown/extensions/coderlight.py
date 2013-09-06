#!/usr/bin/env python
from __future__ import absolute_import
from __future__ import unicode_literals
from . import Extension
from ..preprocessors import Preprocessor
from .codehilite import CodeHilite, CodeHiliteExtension
import re

# Global vars
HIGHTLIGHT_BLOCK_RE = re.compile( \
    r'(?P<fence>^(?:`{3,}))[ ]*(?P<lang>[\w+-]*)[ ]*\n(?P<code>.*?)(?P=fence)[ ]*$',
    re.MULTILINE|re.DOTALL
    )

CODE_WRAP = '<pre><code%s>%s</code></pre>'
LANG_TAG = ' class="%s"'

class FencedCodeExtension(Extension):

    def extendMarkdown(self, md, md_globals):
        """ Add FencedBlockPreprocessor to the Markdown instance. """
        md.registerExtension(self)

        md.preprocessors.add('fenced_code_block',
                                 HightlightBlockPreprocessor(md),
                                 ">normalize_whitespace")

class HightlightBlockPreprocessor(Preprocessor):

    def __init__(self, md):
        super(HightlightBlockPreprocessor, self).__init__(md)

        self.checked_for_codehilite = False
        self.codehilite_conf = {}

    def run(self, lines):
        """ Match and store Fenced Code Blocks in the HtmlStash. """

        # Check for code hilite extension
        if not self.checked_for_codehilite:
            for ext in self.markdown.registeredExtensions:
                if isinstance(ext, CodeHiliteExtension):
                    print ext.config
                    self.codehilite_conf = ext.config
                    break

            self.checked_for_codehilite = True

        text = "\n".join(lines)
        while 1:
            m = HIGHTLIGHT_BLOCK_RE.search(text)
            if m:
                try:
                    lang = m.group('lang').lower()
                except:
                    lang = None
                highliter = CodeHilite(m.group('code'), css_class="highlight", lang=lang)
                code = highliter.hilite()
                placeholder = self.markdown.htmlStash.store(code, safe=True)
                text = '%s\n%s\n%s'% (text[:m.start()], placeholder, text[m.end():])
            else:
                break
        return text.split("\n")

    def _escape(self, txt):
        """ basic html escaping """
        txt = txt.replace('&', '&amp;')
        txt = txt.replace('<', '&lt;')
        txt = txt.replace('>', '&gt;')
        txt = txt.replace('"', '&quot;')
        return txt

def makeExtension(configs=None):
    return FencedCodeExtension(configs=configs)


if __name__ == "__main__":
    import doctest
    doctest.testmod()
