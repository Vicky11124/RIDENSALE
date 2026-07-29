import sys
import zipfile
import xml.etree.ElementTree as ET

def get_docx_text(filename):
    with zipfile.ZipFile(filename) as docx:
        xml_content = docx.read('word/document.xml')
    tree = ET.XML(xml_content)
    word_schema = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
    paragraphs = []
    for paragraph in tree.iter(word_schema + 'p'):
        texts = [node.text for node in paragraph.iter(word_schema + 't') if node.text]
        if texts:
            paragraphs.append(''.join(texts))
    return '\n'.join(paragraphs)

print(get_docx_text(sys.argv[1]))
