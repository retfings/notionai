import os
from tqdm import tqdm

for name in tqdm(os.listdir('md')):
    txt = open(f'md/{name}').read()
    assert "| -----" in txt , name