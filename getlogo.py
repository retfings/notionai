import os

from bs4 import BeautifulSoup as soup

from tqdm import tqdm

htmls = os.listdir('html/')

# print(len(htmls))

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


import pandas as pd

df = pd.read_excel('Wikiaitools(1).xlsx')
names = list(df['name'])
logos = list(df['logo'])
df2 = pd.read_excel('Wikiaitools(2).xlsx')
names2 = list(df2['name'])
logos2 = list(df2['logo'])
print(len(names2))
print(len(logos2))
names = names + names2
logos = logos + logos2

save_dir = 'logo'
for n,l in tqdm(zip(names,logos)):

    src = l
    src_md5 = md5(n)
    import requests
    try:
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




    