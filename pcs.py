import os
import shutil
file_dir = os.path.dirname(os.path.abspath(__file__))
config_dir = os.path.join(os.environ['APPDATA'],'BaiduPCS-Go') if 'APPDATA' \
    in os.environ else os.path.join(os.path.expanduser('~'),'.config','BaiduPCS-Go')
if not os.path.exists(config_dir):
    shutil.copytree(os.path.join(file_dir,"config"),config_dir)

shutil.copy(os.path.join(file_dir,"pcs"),'/bin')
os.chmod('/bin/pcs',777)