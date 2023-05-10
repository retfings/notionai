import os
import requests
from bs4 import BeautifulSoup as soup
import hashlib
from tqdm import tqdm
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1661.62"
}

def md5(img):
    if type(img) == str:
        m = hashlib.md5()
        m.update(img.encode("utf8"))
        return m.hexdigest()
    fmd5 = hashlib.md5(img).hexdigest()
    return fmd5

md5_list = os.listdir('../../wp-content/uploads/imagesContent/')

for name in tqdm(os.listdir('html')):

    src_path = f'./html/{name}'

    trg_path = f'./html_image/{name}'

    f = open(src_path, 'r',encoding='utf-8')
    xml_string = f.read()

    s = soup(xml_string,'html.parser', from_encoding="utf-8", exclude_encodings=["html.parser"])
    for i in s.find_all('img'):
        src = i['src']
        src_md5 = md5(src)

        if src_md5 not in md5_list:
            try:
                r = requests.get(src,headers=headers)
            except:
                print(f'requests {src} faild')
                continue
            try:
                with open(os.path.join(f'../../wp-content/uploads/imagesContent/',src_md5),'wb') as f:
                    f.write(r.content)
                    print(f'save image {src_md5} ok')
            except:
                print(f'save image {src} faild')


        i['src'] = '/wp-content/uploads/imagesContent/' + src_md5

    for a in s.find_all('a'):
        if 'category' in a['href']:
            a['href'] = a['href'].replace('category','favorites')
            a['style'] = 'color: red'

    with open(trg_path, 'w') as f:
        f.write(str(s))


