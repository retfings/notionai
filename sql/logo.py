import os
import sys
sys.path.insert(0,'.')
sys.path.insert(0,'..')
sys.path.insert(0,'../..')
sys.path.insert(0,'../../..')
from tqdm import tqdm
import os
file_dir = os.path.dirname(os.path.abspath(__file__))
from sql3 import *
import hashlib

local_logos = os.listdir('/www/admin/free-ai-tools.top_80/wwwroot/wp-content/uploads/imagesLogo')

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

# https://free-ai-tools.top/wp-content/uploads/imagesLogo/ee9014ab70378a67057131de92fe7cf5

import pandas as pd

df = pd.read_excel('../all.xlsx')
names = list(df['name'])
logos = list(df['logo'])

err_count = 0
save_dir = 'logo'
for n,l in tqdm(zip(names,logos)):
    post_id = query_wp_posts_id(n)
    if post_id is  None:
        continue
    src_md5 = md5(n)
    logo_url = f"https://free-ai-tools.top/wp-content/uploads/imagesLogo/{src_md5}"
    update_wp_postmeta_url(post_id,logo_url)
    update_wp_postmeta_country(post_id,'国外')





    