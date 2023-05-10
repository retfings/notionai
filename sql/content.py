import sys
sys.path.insert(0,'.')
sys.path.insert(0,'..')
sys.path.insert(0,'../..')
from sql3 import *
import pandas as pd 
import os
import re
df = pd.read_excel('../all.xlsx')
htmls = [f[:-5] for f in os.listdir('../html_image')]
c =0

from tqdm import tqdm


import zhconv


def hans_2_cn(str: str):
    '''
    Function: 将 str 繁体到简体
    '''
    return zhconv.convert(str, 'zh-cn')
update_count = 0

for n in tqdm(list(df['name'])):
    s = re.split("\\s+", n)  
    s = "".join(s)  
    s = s.replace("?", "")  
    if s in htmls:
        post_content = open(os.path.join('..','html_image',f"{s}.html")).read()
        post_content = hans_2_cn(post_content)
        post_title = n
        # print(n)
        update_wp_posts_content(post_title,post_content)
        update_count += 1

print(f"update_count:{update_count}")
