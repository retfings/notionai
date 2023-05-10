import requests
import uuid
import json
import datetime
import markdown
import os
from tqdm import tqdm
if not os.path.exists('mdhtml'):
    os.mkdir('mdhtml')

TaskName = f"{datetime.datetime.now().year}-{datetime.datetime.now().month}-{datetime.datetime.now().day}-{datetime.datetime.now().hour}-{datetime.datetime.now().minute}-{datetime.datetime.now().second}"
file_dir = '/kaggle/working/notionai' if 'KAGGLE_DATA_PROXY_TOKEN' in os.environ else os.path.dirname(os.path.abspath(__file__))
def pcs():
    import os
    import shutil
    
    config_dir = os.path.join(os.environ['APPDATA'],'BaiduPCS-Go') if 'APPDATA' \
        in os.environ else os.path.join(os.path.expanduser('~'),'.config','BaiduPCS-Go')
    if not os.path.exists(config_dir):
        shutil.copytree(os.path.join(file_dir,"config"),config_dir)

    shutil.copy(os.path.join(file_dir,"pcs"),'/bin')
    os.chmod('/bin/pcs',777)
pcs()
url = 'https://www.notion.so/api/v3/getCompletion'

# s1 is the free
# s2 is the $10
useS1 = True
useS2 = False if useS1 else True
c1 = 'token_v2=v02:user_token_or_cookies:JURwncce5rjoDO_SUONJYuGj5tfSlG-A1GECgXiTIRYvUTBWoJr3DhVxaP3dWNGKCwjz2mdUMLDlOQSUkcnNUUZa0330lqCw--cJzAhCecmluXvwB6z7gJHGmVq98jV3eXjq'
c2 = 'token_v2=v02:user_token_or_cookies:ghLNDMAN1kRuevtgnq1c0VzdoJTQdmjaDpV7wZdNlo1wCLVcZsmEtqO4iReTnKefofkhY1_DiftGA31iWeiFFg0lYdo1_TgSQG6vPNH8aV2UkEostEaW9NcEN0OEM6DTGvLN'
s1 = '32b5fe7a-8485-4cbd-b678-686a3b7ccd02'
s2 = "3133fae2-38d4-481d-9fc2-3bfc3df0325e"
c ,s = c1 ,s1
if useS1:
    c ,s = c1 ,s1
if useS2:
    c ,s = c2 ,s2
headers = {
    "accept": "application/json",
    "Content-Type": "application/json",
    "cookie": c,
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1661.62",
}
# v02:user_token_or_cookies:JURwncce5rjoDO_SUONJYuGj5tfSlG-A1GECgXiTIRYvUTBWoJr3DhVxaP3dWNGKCwjz2mdUMLDlOQSUkcnNUUZa0330lqCw--cJzAhCecmluXvwB6z7gJHGmVq98jV3eXjq
# v02:user_token_or_cookies:ghLNDMAN1kRuevtgnq1c0VzdoJTQdmjaDpV7wZdNlo1wCLVcZsmEtqO4iReTnKefofkhY1_DiftGA31iWeiFFg0lYdo1_TgSQG6vPNH8aV2UkEostEaW9NcEN0OEM6DTGvLN

context = {
    "type": "translate",
    "language": "chinese",
    "text": "In this fast-paced era of technology"
}

for name in tqdm(os.listdir('md')):
    
    md = open(f'md/{name}').read()

    body = {
        "id": str(uuid.uuid4()),
        "model": "openai-3",
        "spaceId": s,
        "isSpacePermission": False,
        "context": {
            "type": "translate",
            "language": "chinese",
            "text": md
        }
    }

    body = json.dumps(body)

    ss = datetime.datetime.now()
    try:
        print(f'request {name}')
        r = requests.post(url, data=body, headers=headers, stream=False)
        if r.status_code != 200:
            print(f"r.status_code ===> {r.status_code}")
            continue
    except:
        print(f'error {name}')
        continue
    print(f'finish request {name}')    
    
    ee = datetime.datetime.now()

    print(f"{name}:"+str((ee - ss).seconds))

    try:
        result = "".join([json.loads(line)['completion'] for line in r.text.splitlines()])
        assert len(result) != 0
    except:
        continue
#     print(result)

    html = markdown.markdown(result,extensions=['tables'])

    save_name = f"{name[:-5]}.html"
    output_file = open(os.path.join(file_dir,'mdhtml',save_name), mode="w", encoding="utf-8")
    output_file.write(html)
    try:
        os.system(f"pcs u {os.path.join(file_dir,'mdhtml',save_name)} /freeaitools/data/otherweb/wikitools/{TaskName}/")
    except:
        pass