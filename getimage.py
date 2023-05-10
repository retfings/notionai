import os

from bs4 import BeautifulSoup as soup

from tqdm import tqdm

htmls = os.listdir('html/')

print(len(htmls))

save_dir = 'image'

import hashlib

def md5(img):
    if type(img) == str:
        m = hashlib.md5()
        m.update(img.encode("utf8"))
        return m.hexdigest()
    fmd5 = hashlib.md5(img).hexdigest()
    return fmd5

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1661.62"
}
# Load HTML file as XML

def do(one_html_file):

        f = open(os.path.join('html',one_html_file), 'r',encoding='utf-8')
        xml_string = f.read()

        s = soup(xml_string,'lxml')
        if len(s.find_all('img')) <= 0 :
            print(f"image count < 0 : {one_html_file} \n")
        for i in s.find_all('img'):
            src = i['src']
            src_md5 = md5(src)
            import requests
            try:
                print(f"src:{src}\n")
                print(src_md5)
                print(os.path.isfile(os.path.join(save_dir,src_md5)))
                if not os.path.isfile(os.path.join(save_dir,src_md5)):
                    print(f'requests {src}\n')
                    r = requests.get(src,headers=headers)
                    try:
                        with open(os.path.join(save_dir,src_md5),'wb') as f:
                            f.write(r.content)
                    except:
                        print(f'save image {src} faild')
            except:
                print(f'get image {src} faild')
        f.close()
import time        
for one_html_file in tqdm(htmls):
    do(one_html_file)
    time.sleep(3)

    